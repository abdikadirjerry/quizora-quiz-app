import {
  ArrowRight,
  Medal,
  Trophy,
  Target,
  BrainCircuit,
  Award,
} from "lucide-react";
import { Link } from "react-router";

import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { getQuizHistory } from "../utils/quizStorage";

function LeaderboardPage() {
  const history = getQuizHistory();

  const totalQuestions = history.reduce(
    (sum, attempt) => sum + (Number(attempt.totalQuestions) || 0),
    0,
  );

  const totalCorrect = history.reduce(
    (sum, attempt) => sum + (Number(attempt.score) || 0),
    0,
  );

  const accuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const rankedAttempts = [...history].sort((a, b) => {
    const accuracyDifference =
      (Number(b.accuracy) || 0) - (Number(a.accuracy) || 0);
    if (accuracyDifference !== 0) return accuracyDifference;

    const scoreDifference = (Number(b.score) || 0) - (Number(a.score) || 0);
    if (scoreDifference !== 0) return scoreDifference;

    return new Date(b.completedAt) - new Date(a.completedAt);
  });

  const bestAttempt = rankedAttempts[0];

  function formatDate(dateString) {
    if (!dateString) return "Date unavailable";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function formatCategory(category) {
    if (!category) return "General Knowledge";

    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <div>
      <PageHeader
        eyebrow="CELEBRATE PROGRESS"
        title="Leaderboard"
        description="Track your best performances, celebrate your progress, and keep challenging yourself."
      />

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <article className="surface-card p-5">
          <Trophy size={22} className="text-amber-300" />

          <p className="mt-4 text-sm text-text-secondary">Personal best</p>

          <p className="mt-2 font-semibold text-white">
            {bestAttempt
              ? `${Number(bestAttempt.accuracy) || 0}% accuracy`
              : "No scores yet"}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            {bestAttempt
              ? `${Number(bestAttempt.score) || 0}/${Number(bestAttempt.totalQuestions) || 0} correct`
              : "Complete a quiz to get started"}
          </p>
        </article>

        <article className="surface-card p-5">
          <BrainCircuit size={22} className="text-sky-300" />

          <p className="mt-4 text-sm text-text-secondary">Attempts recorded</p>

          <p className="mt-2 font-semibold text-white">
            {history.length} {history.length === 1 ? "quiz" : "quizzes"}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Your completed quiz history
          </p>
        </article>

        <article className="surface-card p-5">
          <Target size={22} className="text-brand-300" />

          <p className="mt-4 text-sm text-text-secondary">Overall accuracy</p>

          <p className="mt-2 font-semibold text-white">
            {history.length > 0 ? `${accuracy}%` : "—"}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Across all recorded attempts
          </p>
        </article>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border-subtle p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="display-font text-lg font-bold text-white">
              Your top performances
            </h2>

            <p className="mt-1 text-xs text-text-muted">
              Ranked by accuracy, then correct answers.
            </p>
          </div>

          <span className="w-fit rounded-lg border border-border-subtle bg-surface px-3 py-1.5 text-xs text-text-secondary">
            Personal rankings
          </span>
        </div>

        {rankedAttempts.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center sm:py-20">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/15 bg-amber-400/10 text-amber-300">
              <Trophy size={29} />
            </span>

            <h3 className="display-font mt-6 text-xl font-bold text-white">
              Your first victory starts here.
            </h3>

            <p className="mt-3 max-w-md text-sm leading-7 text-text-secondary">
              Complete a quiz to record your first score. Your best performances
              will appear here automatically.
            </p>

            <Link to="/explore" className="mt-6">
              <Button>
                Explore quizzes
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-b border-border-subtle text-xs text-text-muted">
                  <th className="px-6 py-4 font-medium">Rank</th>
                  <th className="px-6 py-4 font-medium">Quiz category</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium">Accuracy</th>
                  <th className="px-6 py-4 font-medium">Completed</th>
                </tr>
              </thead>

              <tbody>
                {rankedAttempts.map((attempt, index) => {
                  const rank = index + 1;
                  const attemptAccuracy = Number(attempt.accuracy) || 0;

                  return (
                    <tr
                      key={attempt.id ?? `${attempt.completedAt}-${index}`}
                      className="border-b border-border-subtle/70 transition hover:bg-surface-raised/60 last:border-b-0"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                              rank === 1
                                ? "bg-amber-400/10 text-amber-300"
                                : rank === 2
                                  ? "bg-slate-400/10 text-slate-300"
                                  : rank === 3
                                    ? "bg-orange-400/10 text-orange-300"
                                    : "bg-surface text-text-muted"
                            }`}
                          >
                            {rank <= 3 ? (
                              <Medal size={18} />
                            ) : (
                              <span className="text-xs font-semibold">
                                {rank}
                              </span>
                            )}
                          </span>

                          <span className="text-sm font-semibold text-text-primary">
                            #{rank}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-300">
                            <Award size={17} />
                          </span>

                          <div>
                            <p className="text-sm font-medium text-white">
                              {formatCategory(attempt.category)}
                            </p>

                            <p className="mt-1 text-xs text-text-muted">
                              {attempt.difficulty || "Mixed"} difficulty
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-text-primary">
                        {Number(attempt.score) || 0}/
                        {Number(attempt.totalQuestions) || 0}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            attemptAccuracy >= 80
                              ? "bg-emerald-400/10 text-emerald-300"
                              : attemptAccuracy >= 50
                                ? "bg-amber-400/10 text-amber-300"
                                : "bg-rose-400/10 text-rose-300"
                          }`}
                        >
                          {attemptAccuracy}%
                        </span>
                      </td>

                      <td className="px-6 py-5 text-xs text-text-secondary">
                        {formatDate(attempt.completedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default LeaderboardPage;
