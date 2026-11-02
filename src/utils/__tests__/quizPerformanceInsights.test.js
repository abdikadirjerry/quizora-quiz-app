import { describe, expect, it } from "vitest";
import { getQuizPerformanceInsights } from "../quizPerformanceInsights";

describe("getQuizPerformanceInsights", () => {
  it("identifies the strongest and weakest difficulty levels", () => {
    const result = getQuizPerformanceInsights([
      { difficulty: "Easy", correct: 5, total: 5 },
      { difficulty: "Medium", correct: 3, total: 5 },
      { difficulty: "Hard", correct: 2, total: 5 },
    ]);

    expect(result.strongest).toMatchObject({
      difficulty: "Easy",
      accuracy: 100,
    });

    expect(result.needsPractice).toMatchObject({
      difficulty: "Hard",
      accuracy: 40,
    });

    expect(result.message).toContain("Hard");
  });

  it("ignores difficulty levels with no questions", () => {
    const result = getQuizPerformanceInsights([
      { difficulty: "Easy", correct: 4, total: 5 },
      { difficulty: "Medium", correct: 0, total: 0 },
      { difficulty: "Hard", correct: 1, total: 5 },
    ]);

    expect(result.strongest.difficulty).toBe("Easy");
    expect(result.needsPractice.difficulty).toBe("Hard");
  });

  it("handles an attempt with no difficulty data", () => {
    const result = getQuizPerformanceInsights([
      { difficulty: "Easy", correct: 0, total: 0 },
      { difficulty: "Medium", correct: 0, total: 0 },
      { difficulty: "Hard", correct: 0, total: 0 },
    ]);

    expect(result.strongest).toBeNull();
    expect(result.needsPractice).toBeNull();
    expect(result.message).toContain("Complete a quiz");
  });

  it("handles a quiz containing only one available difficulty", () => {
    const result = getQuizPerformanceInsights([
      { difficulty: "Easy", correct: 4, total: 5 },
      { difficulty: "Medium", correct: 0, total: 0 },
      { difficulty: "Hard", correct: 0, total: 0 },
    ]);

    expect(result.strongest.difficulty).toBe("Easy");
    expect(result.needsPractice.difficulty).toBe("Easy");
    expect(result.message).toContain("another difficulty level");
  });

  it("uses a consistent order when difficulty accuracies are tied", () => {
    const result = getQuizPerformanceInsights([
      { difficulty: "Hard", correct: 3, total: 5 },
      { difficulty: "Easy", correct: 3, total: 5 },
      { difficulty: "Medium", correct: 3, total: 5 },
    ]);

    expect(result.strongest.difficulty).toBe("Easy");
    expect(result.needsPractice.difficulty).toBe("Easy");
  });
});
