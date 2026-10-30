import { useEffect, useReducer, useRef } from "react";
import { saveQuizAttempt } from "../utils/quizStorage";

const DEFAULT_SECONDS_PER_QUESTION = 20;
const ALLOWED_TIMER_DURATIONS = [0, 10, 20, 30];

function normalizeTimerDuration(value) {
  const duration = Number(value ?? DEFAULT_SECONDS_PER_QUESTION);

  return ALLOWED_TIMER_DURATIONS.includes(duration)
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

function makeAnswer(question, answerIndex, outcome = {}) {
  const timedOut = outcome.timedOut === true;
  const skipped = outcome.skipped === true;

  return {
    questionId: question.id,
    selectedAnswerIndex: answerIndex,
    correctAnswerIndex: question.correctAnswerIndex,
    isCorrect:
      answerIndex !== null && answerIndex === question.correctAnswerIndex,
    timedOut,
    skipped,
  };
}

/**
 * Records the current answer without accidentally erasing an existing
 * answer when the user navigates away without making a new selection.
 */
function commitCurrent(
  state,
  answerIndex = state.selectedAnswer,
  outcome = {},
) {
  const question = state.questions[state.currentIndex];

  if (!question) {
    return state;
  }

  const existingAnswer = state.answers[state.currentIndex];

  // Preserve an existing answer when no new answer was selected.
  // Timer expiry is the exception because it represents a new timeout.
  if (answerIndex === null && existingAnswer && !outcome.timedOut) {
    return state;
  }

  const answers = [...state.answers];

  answers[state.currentIndex] = makeAnswer(question, answerIndex, outcome);

  return {
    ...state,
    answers,
  };
}

function completeState(state) {
  let next = state;

  const currentAnswerAlreadyExists = Boolean(state.answers[state.currentIndex]);

  if (state.selectedAnswer !== null) {
    next = commitCurrent(state, state.selectedAnswer);
  } else if (!currentAnswerAlreadyExists) {
    next = commitCurrent(state, null, { skipped: true });
  }

  const answers = next.answers.map((answer, index) => {
    if (answer) {
      return answer;
    }

    return makeAnswer(next.questions[index], null, { skipped: true });
  });

  return {
    ...next,
    answers,
    selectedAnswer: null,
    status: "completed",
  };
}

function getNextQuestionState(state, nextIndex, committed) {
  return {
    ...committed,
    currentIndex: nextIndex,
    selectedAnswer: committed.answers[nextIndex]?.selectedAnswerIndex ?? null,
    timeLeft: state.timerDuration === 0 ? null : state.timerDuration,
  };
}

function quizReducer(state, action) {
  switch (action.type) {
    case "SELECT_ANSWER": {
      if (state.status !== "playing") {
        return state;
      }

      const question = state.questions[state.currentIndex];

      if (
        !question ||
        !Number.isInteger(action.index) ||
        action.index < 0 ||
        action.index >= question.options.length
      ) {
        return state;
      }

      // A new selection replaces the previous selection.
      // This supports changing an answer when revisiting a question.
      return {
        ...state,
        selectedAnswer: action.index,
      };
    }

    case "NEXT": {
      if (state.status !== "playing" || state.questions.length === 0) {
        return state;
      }

      if (state.currentIndex === state.questions.length - 1) {
        return completeState(state);
      }

      let committed;

      if (state.selectedAnswer !== null) {
        committed = commitCurrent(state, state.selectedAnswer);
      } else if (!state.answers[state.currentIndex]) {
        committed = commitCurrent(state, null, { skipped: true });
      } else {
        // Preserve a previously recorded skipped or timed-out answer.
        committed = state;
      }

      return getNextQuestionState(state, state.currentIndex + 1, committed);
    }

    case "JUMP": {
      if (
        state.status !== "playing" ||
        !Number.isInteger(action.index) ||
        action.index < 0 ||
        action.index >= state.questions.length
      ) {
        return state;
      }

      if (action.index === state.currentIndex) {
        return state;
      }

      // Only commit a new selection when the current question has one.
      // Merely navigating away must not mark an unanswered question as skipped.
      const committed =
        state.selectedAnswer !== null
          ? commitCurrent(state, state.selectedAnswer)
          : state;

      return getNextQuestionState(state, action.index, committed);
    }

    case "TICK": {
      if (
        state.status !== "playing" ||
        state.timerDuration === 0 ||
        state.questions.length === 0
      ) {
        return state;
      }

      if (state.timeLeft <= 1) {
        // A selected answer remains valid when the timer reaches zero.
        // Otherwise, record that the question timed out.
        const timedOut =
          state.selectedAnswer !== null
            ? commitCurrent(state, state.selectedAnswer)
            : commitCurrent(state, null, { timedOut: true });

        if (state.currentIndex === state.questions.length - 1) {
          return completeState(timedOut);
        }

        return getNextQuestionState(state, state.currentIndex + 1, timedOut);
      }

      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };
    }

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
    dispatch({
      type: "RESET",
      questions,
      timerDuration,
    });
  }, [questions, timerDuration]);

  useEffect(() => {
    if (state.status !== "playing" || state.timerDuration === 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [state.status, state.currentIndex, state.timerDuration]);

  const score = state.answers.filter((answer) => answer?.isCorrect).length;

  useEffect(() => {
    if (state.status === "playing") {
      lastSavedAttempt.current = null;
      return;
    }

    if (state.status !== "completed" || state.questions.length === 0) {
      return;
    }

    const signature = JSON.stringify({
      questionIds: state.questions.map((question) => question.id),
      answers: state.answers,
    });

    if (lastSavedAttempt.current === signature) {
      return;
    }

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
