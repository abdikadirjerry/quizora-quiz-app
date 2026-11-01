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
    questionTimes: questions.map(() => 0),
    questionStartedAt: Date.now(),
    timeLeft: timerDuration === 0 ? null : timerDuration,
    status: "playing",
  };
}

function makeAnswer(question, answerIndex, outcome = {}) {
  const timedOut = outcome.timedOut === true;
  const skipped = outcome.skipped === true;
  const timeSpent = Number(outcome.timeSpent) || 0;

  return {
    questionId: question.id,
    selectedAnswerIndex: answerIndex,
    correctAnswerIndex: question.correctAnswerIndex,
    isCorrect:
      answerIndex !== null && answerIndex === question.correctAnswerIndex,
    timedOut,
    skipped,
    timeSpent,
  };
}

function getElapsedTime(state) {
  if (state.status !== "playing") {
    return 0;
  }

  return Math.max(0, Math.floor((Date.now() - state.questionStartedAt) / 1000));
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

  const elapsedTime = getElapsedTime(state);

  const timeSpent =
    (state.questionTimes[state.currentIndex] || 0) + elapsedTime;

  const questionTimes = state.questionTimes.map((time, index) =>
    index === state.currentIndex ? timeSpent : time,
  );

  // Preserve an existing answer but still record additional time.
  if (answerIndex === null && existingAnswer && !outcome.timedOut) {
    const answers = [...state.answers];

    answers[state.currentIndex] = {
      ...existingAnswer,
      timeSpent,
    };

    return {
      ...state,
      answers,
      questionTimes,
      questionStartedAt: Date.now(),
    };
  }

  const answers = [...state.answers];

  answers[state.currentIndex] = makeAnswer(question, answerIndex, {
    ...outcome,
    timeSpent,
  });

  return {
    ...state,
    answers,
    questionTimes,
    questionStartedAt: Date.now(),
  };
}

function completeState(state) {
  const currentAnswerExists = Boolean(state.answers[state.currentIndex]);

  const next = commitCurrent(
    state,
    state.selectedAnswer,
    state.selectedAnswer === null && !currentAnswerExists
      ? { skipped: true }
      : {},
  );

  const answers = next.answers.map((answer, index) => {
    if (answer) {
      return answer;
    }

    return makeAnswer(next.questions[index], null, {
      skipped: true,
      timeSpent: next.questionTimes[index] || 0,
    });
  });

  return {
    ...next,
    answers,
    selectedAnswer: null,
    questionStartedAt: null,
    status: "completed",
  };
}

function getNextQuestionState(state, nextIndex, committed) {
  return {
    ...committed,
    currentIndex: nextIndex,
    selectedAnswer: committed.answers[nextIndex]?.selectedAnswerIndex ?? null,
    timeLeft: state.timerDuration === 0 ? null : state.timerDuration,
    questionStartedAt: Date.now(),
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
      const nextIndex = action.index;

      if (
        nextIndex < 0 ||
        nextIndex >= state.questions.length ||
        nextIndex === state.currentIndex ||
        state.status !== "playing"
      ) {
        return state;
      }

      let committed;

      if (state.selectedAnswer !== null) {
        committed = commitCurrent(state, state.selectedAnswer);
      } else if (!state.answers[state.currentIndex]) {
        committed = commitCurrent(state, null, { skipped: true });
      } else {
        committed = commitCurrent(state, null);
      }

      return getNextQuestionState(state, nextIndex, committed);
    }

    case "TICK": {
      if (state.timerDuration === 0 || state.status !== "playing") {
        return state;
      }

      if (state.timeLeft <= 1) {
        const committed = commitCurrent(state, state.selectedAnswer, {
          timedOut: state.selectedAnswer === null,
        });

        const nextIndex = state.currentIndex + 1;

        if (nextIndex >= state.questions.length) {
          return completeState(committed);
        }

        return getNextQuestionState(state, nextIndex, committed);
      }

      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };
    }

    case "PAUSE": {
      if (state.status !== "playing") return state;

      const elapsedTime = getElapsedTime(state);

      return {
        ...state,
        questionTimes: state.questionTimes.map((time, index) =>
          index === state.currentIndex ? time + elapsedTime : time,
        ),
        questionStartedAt: null,
        status: "paused",
      };
    }

    case "RESUME": {
      if (state.status !== "paused") return state;

      return {
        ...state,
        questionStartedAt: Date.now(),
        status: "playing",
      };
    }

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
        questions: state.questions,
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
