function formatSeconds(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "—";
  }

  const wholeSeconds = Math.round(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = wholeSeconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

export function getQuizTimeStats(answers = []) {
  const timedAnswers = answers
    .map((answer, index) => ({
      questionNumber: index + 1,
      timeSpent: answer?.timeSpent,
    }))
    .filter(
      ({ timeSpent }) =>
        typeof timeSpent === "number" &&
        Number.isFinite(timeSpent) &&
        timeSpent >= 0,
    );

  if (timedAnswers.length === 0) {
    return {
      totalSeconds: null,
      averageSeconds: null,
      fastest: null,
      slowest: null,
      timedQuestionCount: 0,
    };
  }

  const totalSeconds = timedAnswers.reduce(
    (total, answer) => total + answer.timeSpent,
    0,
  );

  const fastest = timedAnswers.reduce((best, answer) =>
    answer.timeSpent < best.timeSpent ? answer : best,
  );

  const slowest = timedAnswers.reduce((best, answer) =>
    answer.timeSpent > best.timeSpent ? answer : best,
  );

  return {
    totalSeconds,
    averageSeconds: totalSeconds / timedAnswers.length,
    fastest,
    slowest,
    timedQuestionCount: timedAnswers.length,
  };
}

export { formatSeconds };
