import { describe, expect, it } from "vitest";
import { getQuizReviewRecommendations } from "../quizReviewRecommendations";

describe("getQuizReviewRecommendations", () => {
  it("recommends reviewing mistakes when accuracy is below 60%", () => {
    const result = getQuizReviewRecommendations({
      accuracy: 45,
      skippedCount: 0,
      totalQuestions: 10,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("review-mistakes");
    expect(result[0].priority).toBe("high");
  });

  it("recommends more practice when accuracy is between 60% and 79%", () => {
    const result = getQuizReviewRecommendations({
      accuracy: 70,
      skippedCount: 0,
      totalQuestions: 10,
    });

    expect(result[0].id).toBe("practice-more");
  });

  it("recommends a harder difficulty when accuracy is between 80% and 99%", () => {
    const result = getQuizReviewRecommendations({
      accuracy: 90,
      skippedCount: 0,
      totalQuestions: 10,
    });

    expect(result[0].id).toBe("increase-difficulty");
  });

  it("celebrates a perfect score", () => {
    const result = getQuizReviewRecommendations({
      accuracy: 100,
      skippedCount: 0,
      totalQuestions: 10,
    });

    expect(result[0].id).toBe("perfect-score");
    expect(result[0].priority).toBe("success");
  });

  it("adds a recommendation when questions were skipped", () => {
    const result = getQuizReviewRecommendations({
      accuracy: 90,
      skippedCount: 2,
      totalQuestions: 10,
    });

    expect(result).toHaveLength(2);
    expect(result[1].id).toBe("answer-skipped");
    expect(result[1].message).toContain("2 questions");
  });

  it("uses singular wording when one question was skipped", () => {
    const result = getQuizReviewRecommendations({
      accuracy: 80,
      skippedCount: 1,
      totalQuestions: 10,
    });

    expect(result[1].message).toContain("1 question.");
  });

  it("handles missing quiz data", () => {
    const result = getQuizReviewRecommendations();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("complete-quiz");
  });

  it("rejects invalid accuracy and question counts", () => {
    const invalidAccuracy = getQuizReviewRecommendations({
      accuracy: 120,
      skippedCount: 0,
      totalQuestions: 10,
    });

    const invalidTotal = getQuizReviewRecommendations({
      accuracy: 80,
      skippedCount: 0,
      totalQuestions: 0,
    });

    expect(invalidAccuracy[0].id).toBe("complete-quiz");
    expect(invalidTotal[0].id).toBe("complete-quiz");
  });
});
