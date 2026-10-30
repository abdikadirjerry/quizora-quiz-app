import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import useQuiz from "../useQuiz";
import { saveQuizAttempt } from "../../utils/quizStorage";

vi.mock("../../utils/quizStorage", () => ({
  saveQuizAttempt: vi.fn(),
}));

const questions = [
  {
    id: "q1",
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswerIndex: 1,
    category: "Math",
    difficulty: "Easy",
  },
  {
    id: "q2",
    question: "What is 3 + 3?",
    options: ["5", "6", "7", "8"],
    correctAnswerIndex: 1,
    category: "Math",
    difficulty: "Easy",
  },
  {
    id: "q3",
    question: "What is 4 + 4?",
    options: ["6", "7", "8", "9"],
    correctAnswerIndex: 2,
    category: "Math",
    difficulty: "Easy",
  },
];

describe("useQuiz", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("initializes the quiz correctly", () => {
    const { result } = renderHook(() => useQuiz(questions, 20));

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.status).toBe("playing");
    expect(result.current.timeLeft).toBe(20);
    expect(result.current.totalQuestions).toBe(3);
    expect(result.current.answers).toEqual([null, null, null]);
    expect(result.current.score).toBe(0);
  });

  it("selects an answer", () => {
    const { result } = renderHook(() => useQuiz(questions, 0));

    act(() => {
      result.current.selectAnswer(1);
    });

    expect(result.current.selectedAnswer).toBe(1);
  });

  it("rejects invalid answer indexes", () => {
    const { result } = renderHook(() => useQuiz(questions, 0));

    act(() => {
      result.current.selectAnswer(10);
    });

    expect(result.current.selectedAnswer).toBe(null);
  });

  it("moves to the next question and records the answer", () => {
    const { result } = renderHook(() => useQuiz(questions, 0));

    act(() => {
      result.current.selectAnswer(1);
      result.current.nextQuestion();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.answers[0].selectedAnswerIndex).toBe(1);
    expect(result.current.answers[0].isCorrect).toBe(true);
  });

  it("updates an answer when revisiting a question", () => {
    const { result } = renderHook(() => useQuiz(questions, 0));

    act(() => {
      result.current.selectAnswer(0);
      result.current.nextQuestion();
      result.current.jumpToQuestion(0);
      result.current.selectAnswer(1);
      result.current.nextQuestion();
    });

    expect(result.current.answers[0].selectedAnswerIndex).toBe(1);
    expect(result.current.answers[0].isCorrect).toBe(true);
  });

  it("records skipped questions when finishing the quiz", () => {
    const { result } = renderHook(() => useQuiz(questions, 0));

    act(() => {
      result.current.nextQuestion();
      result.current.nextQuestion();
      result.current.nextQuestion();
    });

    expect(result.current.status).toBe("completed");
    expect(result.current.answers).toHaveLength(3);
    expect(result.current.answers.every((answer) => answer.skipped)).toBe(true);
  });

  it("calculates the final score correctly", () => {
    const { result } = renderHook(() => useQuiz(questions, 0));

    act(() => {
      result.current.selectAnswer(1);
      result.current.nextQuestion();

      result.current.selectAnswer(0);
      result.current.nextQuestion();

      result.current.selectAnswer(2);
      result.current.nextQuestion();
    });

    expect(result.current.status).toBe("completed");
    expect(result.current.score).toBe(2);
  });

  it("pauses and resumes the quiz", () => {
    const { result } = renderHook(() => useQuiz(questions, 10));

    act(() => {
      result.current.pauseQuiz();
    });

    expect(result.current.status).toBe("paused");

    act(() => {
      result.current.resumeQuiz();
    });

    expect(result.current.status).toBe("playing");
  });

  it("stops the timer while paused", () => {
    const { result } = renderHook(() => useQuiz(questions, 10));

    act(() => {
      result.current.pauseQuiz();
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(10);
  });

  it("counts down and advances when time expires", () => {
    const { result } = renderHook(() => useQuiz(questions, 10));

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.answers[0].timedOut).toBe(true);
    expect(result.current.timeLeft).toBe(10);
  });

  it("restarts the quiz with a fresh state", () => {
    const { result } = renderHook(() => useQuiz(questions, 10));

    act(() => {
      result.current.selectAnswer(1);
      result.current.nextQuestion();
      result.current.restartQuiz();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.selectedAnswer).toBe(null);
    expect(result.current.answers).toEqual([null, null, null]);
    expect(result.current.status).toBe("playing");
    expect(result.current.timeLeft).toBe(10);
  });

  it("saves the completed quiz attempt", () => {
    const { result } = renderHook(() => useQuiz(questions, 0));

    act(() => {
      result.current.selectAnswer(1);
      result.current.nextQuestion();

      result.current.selectAnswer(1);
      result.current.nextQuestion();

      result.current.selectAnswer(2);
      result.current.nextQuestion();
    });

    expect(saveQuizAttempt).toHaveBeenCalledTimes(1);

    expect(saveQuizAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        category: "Math",
        difficulty: "Easy",
        score: 3,
        totalQuestions: 3,
        accuracy: 100,
      }),
    );
  });
});
