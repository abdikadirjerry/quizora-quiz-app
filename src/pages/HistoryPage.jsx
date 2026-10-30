import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowDownWideNarrow,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Filter,
  History,
  Minus,
  RotateCcw,
  Search,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import {
  clearQuizHistory,
  deleteQuizAttempt,
  exportQuizHistoryToCSV,
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

function getCategoryName(category) {
  return CATEGORY_LABELS[category] ?? category ?? "Quiz";
}

function getAccuracyColor(accuracy) {
  if (accuracy >= 80) return "text-success";
  if (accuracy >= 50) return "text-brand-300";
  return "text-text-secondary";
}

function getAttemptDate(attempt) {
  const date = new Date(attempt.completedAt);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function HistoryPage() {
  const [history, setHistory] = useState(() => getQuizHistory());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [attemptToDelete, setAttemptToDelete] = useState(null);

  const statistics = getQuizStatistics(history);

  const categories = useMemo(
    () =>
      [
        ...new Set(history.map((attempt) => attempt.category).filter(Boolean)),
      ].sort((a, b) => getCategoryName(a).localeCompare(getCategoryName(b))),
    [history],
  );

  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = history.filter((attempt) => {
      const categoryName = getCategoryName(attempt.category).toLowerCase();

      const matchesSearch =
        !query ||
        categoryName.includes(query) ||
        String(attempt.difficulty ?? "Mixed")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === "all" || attempt.category === categoryFilter;

      const matchesDifficulty =
        difficultyFilter === "all" ||
        (attempt.difficulty ?? "Mixed").toLowerCase() ===
          difficultyFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "accuracy") {
        return (
          (Number(b.accuracy) || 0) - (Number(a.accuracy) || 0) ||
          getAttemptDate(b) - getAttemptDate(a)
        );
      }

      if (sortBy === "score") {
        const scoreDifference = (Number(b.score) || 0) - (Number(a.score) || 0);

        if (scoreDifference !== 0) return scoreDifference;

        return getAttemptDate(b) - getAttemptDate(a);
      }

      return getAttemptDate(b) - getAttemptDate(a);
    });
  }, [history, searchQuery, categoryFilter, difficultyFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    categoryFilter !== "all" ||
    difficultyFilter !== "all" ||
    sortBy !== "recent";

  function resetFilters() {
    setSearchQuery("");
    setCategoryFilter("all");
    setDifficultyFilter("all");
    setSortBy("recent");
  }

  function handleClearHistory() {
    clearQuizHistory();
    setHistory([]);
    setShowClearConfirmation(false);
    resetFilters();
  }

  function handleDeleteAttempt(attemptId) {
    const updatedHistory = deleteQuizAttempt(attemptId);

    setHistory(updatedHistory);
    setAttemptToDelete(null);
  }

  function handleExportHistory() {
    const csv = exportQuizHistoryToCSV(history);

    if (!csv) return;

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `quizora-history-${new Date().toISOString().slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  const statCards = [
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
  ];

  const improvement = statistics.improvement;

  const improvementIcon =
    improvement === null
      ? Minus
      : improvement > 0
        ? TrendingUp
        : improvement < 0
          ? TrendingDown
          : Minus;

  const ImprovementIcon = improvementIcon;

  const improvementColor =
    improvement === null
      ? "text-text-secondary"
      : improvement > 0
        ? "text-success"
        : improvement < 0
          ? "text-danger"
          : "text-text-secondary";

  const improvementValue =
    improvement === null ? "—" : `${improvement > 0 ? "+" : ""}${improvement}%`;

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="YOUR PROGRESS"
        title="Quiz history"
        description="Review your attempts, track your accuracy, and see how far you've come."
        action={
          history.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={handleExportHistory}>
                <Download size={15} />
                Export CSV
              </Button>

              <Button
                variant="secondary"
                onClick={() => setShowClearConfirmation(true)}
              >
                <Trash2 size={15} />
                Clear history
              </Button>
            </div>
          ) : null
        }
      />

      {showClearConfirmation && (
        <div
          role="alertdialog"
          aria-labelledby="clear-history-title"
          aria-describedby="clear-history-description"
          className="flex flex-col gap-4 rounded-2xl border border-danger/20 bg-danger/5 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2
              id="clear-history-title"
              className="text-sm font-bold text-white"
            >
              Clear all quiz history?
            </h2>

            <p
              id="clear-history-description"
              className="mt-1 text-xs leading-5 text-text-secondary"
            >
              This permanently removes your saved quiz attempts from this
              browser. This action cannot be undone.
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
              <Trash2 size={14} />
              Clear all
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((stat) => {
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

        <article className="surface-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-text-secondary">
              Recent improvement
            </span>

            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-surface-raised ${improvementColor}`}
            >
              <ImprovementIcon size={19} />
            </span>
          </div>

          <p
            className={`display-font mt-5 text-3xl font-bold tracking-tight ${improvementColor}`}
          >
            {improvementValue}
          </p>

          <p className="mt-2 text-xs leading-5 text-text-secondary">
            Compared with your previous quiz
          </p>
        </article>
      </div>

      <section className="surface-card overflow-hidden rounded-3xl">
        <div className="space-y-5 border-b border-border-subtle p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Your attempts</h2>

              <p className="mt-1 text-xs text-text-secondary">
                Search, filter, and compare your completed quizzes.
              </p>
            </div>

            <span className="w-fit rounded-full border border-border-subtle bg-surface-raised px-3 py-1.5 text-xs font-semibold text-text-secondary">
              {filteredHistory.length} of {history.length}{" "}
              {history.length === 1 ? "attempt" : "attempts"}
            </span>
          </div>

          {history.length > 0 && (
            <>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                  />

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search quiz categories..."
                    aria-label="Search quiz history"
                    className="w-full rounded-xl border border-border-subtle bg-surface-raised py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-text-muted focus:border-brand-400"
                  />
                </div>

                <Button
                  variant="secondary"
                  onClick={() => setShowFilters((current) => !current)}
                  aria-expanded={showFilters}
                >
                  <Filter size={15} />
                  Filters
                  {(categoryFilter !== "all" || difficultyFilter !== "all") && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                      {(categoryFilter !== "all" ? 1 : 0) +
                        (difficultyFilter !== "all" ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </div>

              {showFilters && (
                <div className="grid gap-3 rounded-2xl border border-border-subtle bg-surface-raised/50 p-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-text-secondary">
                      Category
                    </span>

                    <select
                      value={categoryFilter}
                      onChange={(event) =>
                        setCategoryFilter(event.target.value)
                      }
                      className="w-full rounded-xl border border-border-subtle bg-surface-raised px-3 py-3 text-sm text-white outline-none focus:border-brand-400"
                    >
                      <option value="all">All categories</option>

                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {getCategoryName(category)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-medium text-text-secondary">
                      Difficulty
                    </span>

                    <select
                      value={difficultyFilter}
                      onChange={(event) =>
                        setDifficultyFilter(event.target.value)
                      }
                      className="w-full rounded-xl border border-border-subtle bg-surface-raised px-3 py-3 text-sm text-white outline-none focus:border-brand-400"
                    >
                      <option value="all">All difficulties</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </label>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 text-xs text-text-secondary">
                  <ArrowDownWideNarrow size={15} />

                  <span>Sort by</span>

                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    aria-label="Sort quiz history"
                    className="rounded-lg border border-border-subtle bg-surface-raised px-3 py-2 text-xs font-medium text-white outline-none focus:border-brand-400"
                  >
                    <option value="recent">Most recent</option>
                    <option value="accuracy">Highest accuracy</option>
                    <option value="score">Highest score</option>
                  </select>
                </label>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-brand-300 transition hover:text-white"
                  >
                    <X size={14} />
                    Reset filters
                  </button>
                )}
              </div>
            </>
          )}
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
        ) : filteredHistory.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border-subtle bg-surface-raised text-text-secondary">
              <Search size={24} />
            </div>

            <h3 className="mt-4 text-base font-bold text-white">
              No matching attempts
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
              Try another search term or change your filters to find your quiz
              attempts.
            </p>

            <Button variant="secondary" className="mt-5" onClick={resetFilters}>
              <RotateCcw size={14} />
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {filteredHistory.map((attempt) => {
              const accuracy = Number(attempt.accuracy) || 0;
              const totalQuestions = Number(attempt.totalQuestions) || 0;
              const score = Number(attempt.score) || 0;

              return (
                <article
                  key={attempt.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-surface-raised/50 sm:flex-row sm:items-center sm:p-6"
                >
                  <Link
                    to={`/history/${encodeURIComponent(attempt.id)}`}
                    className="flex min-w-0 flex-1 items-center gap-4"
                    aria-label={`Review ${getCategoryName(attempt.category)} quiz attempt`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-400/20 bg-brand-500/10 text-brand-300">
                      <BarChart3 size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-white">
                        {getCategoryName(attempt.category)}
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

                        <span>
                          {totalQuestions}{" "}
                          {totalQuestions === 1 ? "question" : "questions"}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-5">
                      <div className="min-w-20">
                        <p className="display-font text-xl font-bold text-white">
                          {score}/{totalQuestions}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          Correct answers
                        </p>
                      </div>

                      <div className="min-w-16 text-right">
                        <p
                          className={`text-lg font-bold ${getAccuracyColor(accuracy)}`}
                        >
                          {accuracy}%
                        </p>
                        <p className="mt-1 text-xs text-text-muted">Accuracy</p>
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 sm:ml-2">
                    {attemptToDelete === attempt.id ? (
                      <>
                        <span className="text-xs text-text-secondary">
                          Delete this attempt?
                        </span>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteAttempt(attempt.id)}
                        >
                          Confirm
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setAttemptToDelete(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setAttemptToDelete(attempt.id)}
                        aria-label={`Delete ${getCategoryName(attempt.category)} attempt`}
                      >
                        <Trash2 size={15} />
                      </Button>
                    )}
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
