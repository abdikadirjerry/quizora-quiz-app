const HISTORY_KEY = "quizora:quiz-history";

export function getQuizHistory() {
  try {
    const storedHistory = localStorage.getItem(HISTORY_KEY);

    if (!storedHistory) return [];

    const parsedHistory = JSON.parse(storedHistory);

    return Array.isArray(parsedHistory) ? parsedHistory : [];
  } catch {
    return [];
  }
}

export function saveQuizAttempt(attempt) {
  const history = getQuizHistory();

  const newAttempt = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    ...attempt,
    completedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify([newAttempt, ...history].slice(0, 100)),
  );

  return newAttempt;
}

export function clearQuizHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function getQuizStatistics(history = getQuizHistory()) {
  const totalQuizzes = history.length;

  const totalQuestions = history.reduce(
    (sum, attempt) => sum + (Number(attempt.totalQuestions) || 0),
    0,
  );

  const totalCorrect = history.reduce(
    (sum, attempt) => sum + (Number(attempt.score) || 0),
    0,
  );

  const averageAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const bestAccuracy =
    totalQuizzes > 0
      ? Math.max(...history.map((attempt) => Number(attempt.accuracy) || 0))
      : 0;

  return {
    totalQuizzes,
    totalQuestions,
    totalCorrect,
    averageAccuracy,
    bestAccuracy,
  };
}
