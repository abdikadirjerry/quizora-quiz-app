import { describe, expect, it } from "vitest";
import { formatSeconds, getQuizTimeStats } from "../quizTimeStats";

describe("formatSeconds", () => {
  it("formats seconds below one minute", () => {
    expect(formatSeconds(45)).toBe("45s");
  });

  it("formats minutes and remaining seconds", () => {
    expect(formatSeconds(80)).toBe("1m 20s");
  });

  it("formats exact minutes", () => {
    expect(formatSeconds(120)).toBe("2m 0s");
  });

  it("handles invalid values", () => {
    expect(formatSeconds(null)).toBe("—");
    expect(formatSeconds(-1)).toBe("—");
    expect(formatSeconds(Number.NaN)).toBe("—");
  });
});

describe("getQuizTimeStats", () => {
  it("calculates total, average, fastest, and slowest times", () => {
    const stats = getQuizTimeStats([
      { timeSpent: 10 },
      { timeSpent: 30 },
      { timeSpent: 20 },
    ]);

    expect(stats).toEqual({
      totalSeconds: 60,
      averageSeconds: 20,
      fastest: { questionNumber: 1, timeSpent: 10 },
      slowest: { questionNumber: 2, timeSpent: 30 },
      timedQuestionCount: 3,
    });
  });

  it("ignores answers without valid recorded times", () => {
    const stats = getQuizTimeStats([
      { timeSpent: 10 },
      {},
      { timeSpent: null },
      { timeSpent: -5 },
      { timeSpent: 20 },
    ]);

    expect(stats.totalSeconds).toBe(30);
    expect(stats.averageSeconds).toBe(15);
    expect(stats.timedQuestionCount).toBe(2);
    expect(stats.fastest.questionNumber).toBe(1);
    expect(stats.slowest.questionNumber).toBe(5);
  });

  it("returns empty stats when no timing data exists", () => {
    expect(getQuizTimeStats([{}, null])).toEqual({
      totalSeconds: null,
      averageSeconds: null,
      fastest: null,
      slowest: null,
      timedQuestionCount: 0,
    });
  });

  it("handles an empty answer list", () => {
    expect(getQuizTimeStats()).toEqual({
      totalSeconds: null,
      averageSeconds: null,
      fastest: null,
      slowest: null,
      timedQuestionCount: 0,
    });
  });
});
