import { useEffect, useReducer, useRef } from "react";
import { saveQuizAttempt } from "../utils/quizStorage";

const DEFAULT_SECONDS_PER_QUESTION = 20;

function normalizeTimerDuration(value) {
  const duration = Number(value ?? DEFAULT_SECONDS_PER_QUESTION);
  return [0, 10, 20, 30].includes(duration)
    ? duration
    : DEFAULT_SECONDS_PER_QUESTION;
}

function createInitialState({ questions, timerDuration }) {
  return {
    questions,
    timerDuration,
    currentIndex: 0,
    selectedAnswer: null,
    answers: questions.map(() => null),
    timeLeft: timerDuration === 0 ? null : timerDuration,
    status: "playing",
  };
}

function makeAnswer(question, answerIndex) {
  return {
    questionId: question.id,
    selectedAnswerIndex: answerIndex,
    correctAnswerIndex: question.correctAnswerIndex,
    isCorrect:
      answerIndex !== null && answerIndex === question.correctAnswerIndex,
    timedOut: answerIndex === null,
  };
}

function commitCurrent(state, answerIndex = state.selectedAnswer) {
  const question = state.questions[state.currentIndex];
  if (!question) return state;
  const answers = [...state.answers];
  answers[state.currentIndex] = makeAnswer(question, answerIndex);
  return { ...state, answers };
}

function completeState(state, answerIndex = state.selectedAnswer) {
  let next = commitCurrent(state, answerIndex);
  const answers = next.answers.map(
    (answer, index) => answer ?? makeAnswer(next.questions[index], null),
  );
  return { ...next, answers, selectedAnswer: null, status: "completed" };
}

function quizReducer(state, action) {
  switch (action.type) {
    case "SELECT_ANSWER":
      if (state.status !== "playing") return state;
      return { ...state, selectedAnswer: action.index };

    case "NEXT": {
      if (state.status !== "playing") return state;
      if (state.currentIndex === state.questions.length - 1) {
        return completeState(state);
      }
      const committed = commitCurrent(state);
      const nextIndex = state.currentIndex + 1;
      return {
        ...committed,
        currentIndex: nextIndex,
        selectedAnswer:
          committed.answers[nextIndex]?.selectedAnswerIndex ?? null,
        timeLeft: state.timerDuration === 0 ? null : state.timerDuration,
      };
    }

    case "JUMP": {
      if (
        state.status !== "playing" ||
        action.index < 0 ||
        action.index >= state.questions.length
      )
        return state;
      if (action.index === state.currentIndex) return state;
      const committed = commitCurrent(state);
      return {
        ...committed,
        currentIndex: action.index,
        selectedAnswer:
          committed.answers[action.index]?.selectedAnswerIndex ?? null,
        timeLeft: state.timerDuration === 0 ? null : state.timerDuration,
      };
    }

    case "TICK":
      if (state.status !== "playing" || state.timerDuration === 0) return state;
      if (state.timeLeft <= 1) {
        if (state.currentIndex === state.questions.length - 1)
          return completeState(state);
        const timedOut = commitCurrent(state);
        const nextIndex = state.currentIndex + 1;
        return {
          ...timedOut,
          currentIndex: nextIndex,
          selectedAnswer:
            timedOut.answers[nextIndex]?.selectedAnswerIndex ?? null,
          timeLeft: state.timerDuration,
        };
      }
      return { ...state, timeLeft: state.timeLeft - 1 };

    case "PAUSE":
      return state.status === "playing"
        ? { ...state, status: "paused" }
        : state;
    case "RESUME":
      return state.status === "paused"
        ? { ...state, status: "playing" }
        : state;
    case "RESET":
      return createInitialState({
        questions: action.questions,
        timerDuration: normalizeTimerDuration(action.timerDuration),
      });
    default:
      return state;
  }
}

export default function useQuiz(
  questions,
  requestedTimerDuration = DEFAULT_SECONDS_PER_QUESTION,
) {
  const timerDuration = normalizeTimerDuration(requestedTimerDuration);
  const [state, dispatch] = useReducer(
    quizReducer,
    { questions, timerDuration },
    createInitialState,
  );
  const lastSavedAttempt = useRef(null);

  useEffect(() => {
    dispatch({ type: "RESET", questions, timerDuration });
  }, [questions, timerDuration]);

  useEffect(() => {
    if (state.status !== "playing" || state.timerDuration === 0)
      return undefined;
    const timer = window.setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => window.clearInterval(timer);
  }, [state.status, state.currentIndex, state.timerDuration]);

  const score = state.answers.filter((answer) => answer?.isCorrect).length;

  useEffect(() => {
    if (state.status === "playing") {
      lastSavedAttempt.current = null;
      return;
    }
    if (state.status !== "completed" || state.questions.length === 0) return;

    const signature = JSON.stringify({
      questionIds: state.questions.map((question) => question.id),
      answers: state.answers,
    });
    if (lastSavedAttempt.current === signature) return;
    lastSavedAttempt.current = signature;

    const totalQuestions = state.questions.length;
    const correctAnswers = state.answers.filter(
      (answer) => answer?.isCorrect,
    ).length;
    try {
      saveQuizAttempt({
        category: state.questions[0]?.category ?? "general-knowledge",
        difficulty: getAttemptDifficulty(state.questions),
        score: correctAnswers,
        totalQuestions,
        accuracy:
          totalQuestions > 0
            ? Math.round((correctAnswers / totalQuestions) * 100)
            : 0,
        answers: state.answers,
      });
    } catch (error) {
      console.error("Unable to save quiz history:", error);
    }
  }, [state.status, state.questions, state.answers]);

  return {
    ...state,
    score,
    totalQuestions: state.questions.length,
    hasTimer: state.timerDuration > 0,
    progress:
      state.questions.length > 0
        ? (state.answers.filter(Boolean).length / state.questions.length) * 100
        : 0,
    selectAnswer: (index) => dispatch({ type: "SELECT_ANSWER", index }),
    nextQuestion: () => dispatch({ type: "NEXT" }),
    jumpToQuestion: (index) => dispatch({ type: "JUMP", index }),
    pauseQuiz: () => dispatch({ type: "PAUSE" }),
    resumeQuiz: () => dispatch({ type: "RESUME" }),
    restartQuiz: () => dispatch({ type: "RESET", questions, timerDuration }),
  };
}

function getAttemptDifficulty(questions) {
  const difficulties = [
    ...new Set(questions.map((question) => question.difficulty)),
  ];
  return difficulties.length === 1 ? difficulties[0] : "Mixed";
}
