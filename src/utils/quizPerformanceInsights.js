const DIFFICULTY_ORDER = ["Easy", "Medium", "Hard"];

export function getQuizPerformanceInsights(difficultyStats) {
  const availableStats = DIFFICULTY_ORDER.map((difficulty) =>
    difficultyStats.find(
      (item) => item.difficulty === difficulty && item.total > 0,
    ),
  ).filter(Boolean);

  if (availableStats.length === 0) {
    return {
      strongest: null,
      needsPractice: null,
      message:
        "Complete a quiz with difficulty data to discover your strengths and areas to improve.",
    };
  }

  const statsWithAccuracy = availableStats.map((item) => ({
    ...item,
    accuracy: Math.round((item.correct / item.total) * 100),
  }));

  const strongest = statsWithAccuracy.reduce((best, item) =>
    item.accuracy > best.accuracy ? item : best,
  );

  const needsPractice = statsWithAccuracy.reduce((lowest, item) =>
    item.accuracy < lowest.accuracy ? item : lowest,
  );

  let message;

  if (statsWithAccuracy.length === 1) {
    message = `You scored ${strongest.accuracy}% on ${strongest.difficulty} questions. Try another difficulty level to get a broader picture of your performance.`;
  } else if (strongest.difficulty === needsPractice.difficulty) {
    message = `Your accuracy is consistent across the difficulty levels you attempted. Keep practising to strengthen your overall performance.`;
  } else if (needsPractice.accuracy < 60) {
    message = `${needsPractice.difficulty} questions are your biggest opportunity for improvement. Review your incorrect answers and practise similar questions.`;
  } else if (strongest.accuracy >= 80) {
    message = `You're doing well with ${strongest.difficulty} questions. Keep building confidence while practising ${needsPractice.difficulty} questions.`;
  } else {
    message = `You performed best on ${strongest.difficulty} questions. Review your mistakes in ${needsPractice.difficulty} questions to improve your accuracy.`;
  }

  return {
    strongest: {
      difficulty: strongest.difficulty,
      accuracy: strongest.accuracy,
      correct: strongest.correct,
      total: strongest.total,
    },
    needsPractice: {
      difficulty: needsPractice.difficulty,
      accuracy: needsPractice.accuracy,
      correct: needsPractice.correct,
      total: needsPractice.total,
    },
    message,
  };
}
