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

export function deleteQuizAttempt(attemptId) {
  const history = getQuizHistory();

  const updatedHistory = history.filter((attempt) => attempt.id !== attemptId);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

  return updatedHistory;
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

  // Compare the two most recent quiz attempts.
  const latestAttempt = history[0];
  const previousAttempt = history[1];

  const latestAccuracy = Number(latestAttempt?.accuracy) || 0;
  const previousAccuracy = Number(previousAttempt?.accuracy) || 0;

  const improvement =
    previousAttempt && latestAttempt ? latestAccuracy - previousAccuracy : null;

  return {
    totalQuizzes,
    totalQuestions,
    totalCorrect,
    averageAccuracy,
    bestAccuracy,
    improvement,
  };
}

export function exportQuizHistoryToCSV(history = getQuizHistory()) {
  if (!history.length) {
    return null;
  }

  const headers = [
    "Date",
    "Category",
    "Difficulty",
    "Score",
    "Total Questions",
    "Accuracy",
  ];

  const escapeCSV = (value) => {
    let safeValue = String(value ?? "");

    // Prevent spreadsheet formula injection.
    if (/^[\s]*[=+\-@]/.test(safeValue)) {
      safeValue = `'${safeValue}`;
    }

    return `"${safeValue.replace(/"/g, '""')}"`;
  };

  const rows = history.map((attempt) => [
    attempt.completedAt,
    attempt.category,
    attempt.difficulty ?? "Mixed",
    attempt.score,
    attempt.totalQuestions,
    `${Number(attempt.accuracy) || 0}%`,
  ]);

  return [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\r\n");
}
