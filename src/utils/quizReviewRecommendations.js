export function getQuizReviewRecommendations({
  accuracy,
  skippedCount = 0,
  totalQuestions = 0,
} = {}) {
  const hasValidAccuracy =
    Number.isFinite(accuracy) &&
    accuracy >= 0 &&
    accuracy <= 100 &&
    Number.isFinite(totalQuestions) &&
    totalQuestions > 0;

  if (!hasValidAccuracy) {
    return [
      {
        id: "complete-quiz",
        priority: "info",
        title: "Complete a quiz first",
        message:
          "Complete a quiz to receive personalized recommendations based on your performance.",
        action: "Start a quiz and review your results.",
      },
    ];
  }

  const recommendations = [];

  if (accuracy < 60) {
    recommendations.push({
      id: "review-mistakes",
      priority: "high",
      title: "Review your mistakes",
      message:
        "Your accuracy shows that some topics need more attention. Review your incorrect answers and understand why the correct options are right.",
      action: "Review your incorrect answers.",
    });
  } else if (accuracy < 80) {
    recommendations.push({
      id: "practice-more",
      priority: "medium",
      title: "Keep practising",
      message:
        "You're building your knowledge. Another practice quiz can help strengthen what you've learned and improve your accuracy.",
      action: "Take another practice quiz.",
    });
  } else if (accuracy < 100) {
    recommendations.push({
      id: "increase-difficulty",
      priority: "low",
      title: "Challenge yourself",
      message:
        "You're performing well. Try a harder difficulty to test your knowledge and develop your skills further.",
      action: "Try a harder difficulty.",
    });
  } else {
    recommendations.push({
      id: "perfect-score",
      priority: "success",
      title: "Excellent work!",
      message:
        "You answered every question correctly. Keep challenging yourself with harder questions or explore a new category.",
      action: "Try a harder quiz or a new category.",
    });
  }

  const safeSkippedCount =
    Number.isFinite(skippedCount) && skippedCount > 0
      ? Math.floor(skippedCount)
      : 0;

  if (safeSkippedCount > 0) {
    recommendations.push({
      id: "answer-skipped",
      priority: "medium",
      title: "Practise answering every question",
      message: `You skipped ${safeSkippedCount} ${
        safeSkippedCount === 1 ? "question" : "questions"
      }. Try to attempt every question, even when you're unsure of the answer.`,
      action: "Review your skipped questions.",
    });
  }

  return recommendations;
}
