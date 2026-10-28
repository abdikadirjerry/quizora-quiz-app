import { useEffect, useReducer } from "react";

const SECONDS_PER_QUESTION = 20;

function createInitialState(questions) {
  return {
    questions,
    currentIndex: 0,
    selectedAnswer: null,
    answers: [],
    timeLeft: SECONDS_PER_QUESTION,
    status: "playing",
  };
}

function recordAnswer(state, answerIndex) {
  const question = state.questions[state.currentIndex];

  const answer = {
    questionId: question.id,
    selectedAnswerIndex: answerIndex,
    correctAnswerIndex: question.correctAnswerIndex,
    isCorrect: answerIndex === question.correctAnswerIndex,
    timedOut: answerIndex === null,
  };

  const answers = [...state.answers, answer];
  const isLastQuestion = state.currentIndex === state.questions.length - 1;

  if (isLastQuestion) {
    return {
      ...state,
      answers,
      status: "completed",
    };
  }

  return {
    ...state,
    answers,
    currentIndex: state.currentIndex + 1,
    selectedAnswer: null,
    timeLeft: SECONDS_PER_QUESTION,
  };
}

function quizReducer(state, action) {
  switch (action.type) {
    case "SELECT_ANSWER":
      if (state.status !== "playing" || state.selectedAnswer !== null) {
        return state;
      }

      return {
        ...state,
        selectedAnswer: action.index,
      };

    case "NEXT":
      if (state.status !== "playing") return state;

      return recordAnswer(state, state.selectedAnswer);

    case "TICK":
      if (state.status !== "playing") return state;

      if (state.timeLeft <= 1) {
        return recordAnswer(state, state.selectedAnswer);
      }

      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };

    case "RESET":
      return createInitialState(action.questions);

    default:
      return state;
  }
}

export default function useQuiz(questions) {
  const [state, dispatch] = useReducer(
    quizReducer,
    questions,
    createInitialState,
  );

  useEffect(() => {
    dispatch({ type: "RESET", questions });
  }, [questions]);

  useEffect(() => {
    if (state.status !== "playing") return undefined;

    const timer = window.setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [state.status, state.currentIndex]);

  const score = state.answers.filter((answer) => answer.isCorrect).length;

  return {
    ...state,
    score,
    totalQuestions: state.questions.length,
    progress:
      state.questions.length > 0
        ? ((state.currentIndex + (state.status === "completed" ? 1 : 0)) /
            state.questions.length) *
          100
        : 0,
    selectAnswer: (index) => dispatch({ type: "SELECT_ANSWER", index }),
    nextQuestion: () => dispatch({ type: "NEXT" }),
    restartQuiz: () => dispatch({ type: "RESET", questions }),
  };
}
