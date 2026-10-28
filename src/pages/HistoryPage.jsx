import { ArrowRight, History, RotateCcw, Trophy } from "lucide-react";

import { Link } from "react-router";

import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

function HistoryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="YOUR PROGRESS"
        title="Quiz history"
        description="Review your previous attempts, revisit challenging questions, and see how your knowledge develops over time."
      />

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <article className="surface-card p-5">
          <p className="text-sm text-text-secondary">Total attempts</p>
          <p className="display-font mt-3 text-2xl font-bold text-white">0</p>
          <p className="mt-2 text-xs text-text-muted">All completed quizzes</p>
        </article>

        <article className="surface-card p-5">
          <p className="text-sm text-text-secondary">Average score</p>
          <p className="display-font mt-3 text-2xl font-bold text-white">—</p>
          <p className="mt-2 text-xs text-text-muted">No results available</p>
        </article>

        <article className="surface-card p-5">
          <p className="text-sm text-text-secondary">Best score</p>
          <p className="display-font mt-3 text-2xl font-bold text-white">—</p>
          <p className="mt-2 text-xs text-text-muted">Your personal best</p>
        </article>
      </section>

      <section className="surface-card flex flex-col items-center px-6 py-16 text-center sm:py-20">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-400/15 bg-brand-500/10 text-brand-300">
          <History size={29} />
        </span>

        <h2 className="display-font mt-6 text-xl font-bold text-white">
          Your story starts with your first quiz.
        </h2>

        <p className="mt-3 max-w-md text-sm leading-7 text-text-secondary">
          You haven't completed any quizzes yet. Once quiz history is
          implemented, your scores and completed challenges will appear here.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/explore">
            <Button>
              Find a quiz
              <ArrowRight size={16} />
            </Button>
          </Link>

          <Link to="/leaderboard">
            <Button variant="secondary">
              <Trophy size={16} />
              View leaderboard
            </Button>
          </Link>
        </div>
      </section>

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-raised p-4">
        <RotateCcw size={18} className="mt-0.5 shrink-0 text-text-muted" />

        <p className="text-xs leading-5 text-text-muted">
          History statistics will be calculated from completed attempts. No
          scores or activity are fabricated.
        </p>
      </div>
    </div>
  );
}

export default HistoryPage;
