import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  History,
  RotateCcw,
  Target,
  Trash2,
  Trophy,
} from "lucide-react";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import {
  clearQuizHistory,
  getQuizHistory,
  getQuizStatistics,
} from "../utils/quizStorage";

const CATEGORY_LABELS = {
  "general-knowledge": "General Knowledge",
  "science-nature": "Science & Nature",
  technology: "Technology",
  history: "History",
  "arts-culture": "Arts & Culture",
  "curiosity-corner": "Curiosity Corner",
};

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Unknown date";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function HistoryPage() {
  const [history, setHistory] = useState(() => getQuizHistory());
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const statistics = getQuizStatistics(history);

  function handleClearHistory() {
    clearQuizHistory();
    setHistory([]);
    setShowClearConfirmation(false);
  }

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="YOUR PROGRESS"
        title="Quiz history"
        description="Every completed quiz, every lesson learned, and every new personal best."
        action={
          history.length > 0 ? (
            <Button
              variant="secondary"
              onClick={() => setShowClearConfirmation(true)}
            >
              <Trash2 size={15} />
              Clear history
            </Button>
          ) : null
        }
      />

      {showClearConfirmation && (
        <div className="flex flex-col gap-4 rounded-2xl border border-danger/20 bg-danger/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">
              Clear all quiz history?
            </h2>
            <p className="mt-1 text-xs leading-5 text-text-secondary">
              This permanently removes the saved quiz attempts from this
              browser.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowClearConfirmation(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleClearHistory}>
              Clear all
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Quizzes completed",
            value: statistics.totalQuizzes,
            icon: History,
            color: "text-brand-300",
            background: "bg-brand-500/10",
          },
          {
            label: "Questions answered",
            value: statistics.totalQuestions,
            icon: CheckCircle2,
            color: "text-info",
            background: "bg-info/10",
          },
          {
            label: "Average accuracy",
            value: `${statistics.averageAccuracy}%`,
            icon: Target,
            color: "text-success",
            background: "bg-success/10",
          },
          {
            label: "Best accuracy",
            value: `${statistics.bestAccuracy}%`,
            icon: Trophy,
            color: "text-warning",
            background: "bg-warning/10",
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <article key={stat.label} className="surface-card rounded-2xl p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-text-secondary">
                  {stat.label}
                </span>

                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.background} ${stat.color}`}
                >
                  <Icon size={19} />
                </span>
              </div>

              <p className="display-font mt-5 text-3xl font-bold tracking-tight text-white">
                {stat.value}
              </p>
            </article>
          );
        })}
      </div>

      <section className="surface-card overflow-hidden rounded-3xl">
        <div className="flex items-center justify-between gap-4 border-b border-border-subtle p-5 sm:p-6">
          <div>
            <h2 className="text-base font-bold text-white">Recent attempts</h2>
            <p className="mt-1 text-xs text-text-secondary">
              Your latest completed quiz sessions.
            </p>
          </div>

          <span className="rounded-full border border-border-subtle bg-surface-raised px-3 py-1.5 text-xs font-semibold text-text-secondary">
            {history.length} {history.length === 1 ? "attempt" : "attempts"}
          </span>
        </div>

        {history.length === 0 ? (
          <div className="px-6 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border-subtle bg-surface-raised text-text-secondary">
              <History size={28} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              Your story starts here
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
              Complete your first quiz and your results will appear here
              automatically.
            </p>

            <Link to="/explore" className="mt-6 inline-flex">
              <Button>
                Explore quizzes
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {history.map((attempt) => {
              const accuracy = Number(attempt.accuracy) || 0;

              return (
                <article
                  key={attempt.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-surface-raised/50 sm:flex-row sm:items-center sm:p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-400/20 bg-brand-500/10 text-brand-300">
                    <BarChart3 size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-white">
                      {CATEGORY_LABELS[attempt.category] ??
                        attempt.category ??
                        "Quiz"}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-text-secondary">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} />
                        {formatDate(attempt.completedAt)}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={13} />
                        {attempt.difficulty ?? "Mixed"}
                      </span>

                      <span>{attempt.totalQuestions} questions</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <div className="min-w-20">
                      <p className="display-font text-xl font-bold text-white">
                        {attempt.score}/{attempt.totalQuestions}
                      </p>
                      <p className="mt-1 text-xs text-text-muted">
                        Correct answers
                      </p>
                    </div>

                    <div className="min-w-16 text-right">
                      <p
                        className={`text-lg font-bold ${
                          accuracy >= 80
                            ? "text-success"
                            : accuracy >= 50
                              ? "text-brand-300"
                              : "text-text-secondary"
                        }`}
                      >
                        {accuracy}%
                      </p>
                      <p className="mt-1 text-xs text-text-muted">Accuracy</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {history.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface-raised/50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Ready for another challenge?
            </h3>
            <p className="mt-1 text-xs text-text-secondary">
              Keep practicing to improve your accuracy.
            </p>
          </div>

          <Link to="/explore">
            <Button variant="secondary">
              Explore quizzes
              <RotateCcw size={15} />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}

export default HistoryPage;
