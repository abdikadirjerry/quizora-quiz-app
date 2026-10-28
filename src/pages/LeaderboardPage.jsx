import { ArrowRight, Medal, Trophy, Users } from "lucide-react";

import { Link } from "react-router";

import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

function LeaderboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="CELEBRATE PROGRESS"
        title="Leaderboard"
        description="A place to celebrate great scores, friendly competition, and consistent learning."
      />

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <article className="surface-card p-5">
          <Trophy size={22} className="text-amber-300" />
          <p className="mt-4 text-sm text-text-secondary">Top player</p>
          <p className="mt-2 font-semibold text-white">Awaiting first score</p>
        </article>

        <article className="surface-card p-5">
          <Users size={22} className="text-sky-300" />
          <p className="mt-4 text-sm text-text-secondary">Players ranked</p>
          <p className="mt-2 font-semibold text-white">0 players</p>
        </article>

        <article className="surface-card p-5">
          <Medal size={22} className="text-brand-300" />
          <p className="mt-4 text-sm text-text-secondary">Your position</p>
          <p className="mt-2 font-semibold text-white">Not ranked yet</p>
        </article>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border-subtle p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="display-font text-lg font-bold text-white">
              Top performers
            </h2>

            <p className="mt-1 text-xs text-text-muted">
              Rankings will appear after quiz attempts are recorded.
            </p>
          </div>

          <span className="w-fit rounded-lg border border-border-subtle bg-surface px-3 py-1.5 text-xs text-text-secondary">
            All categories
          </span>
        </div>

        <div className="flex flex-col items-center px-6 py-16 text-center sm:py-20">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/15 bg-amber-400/10 text-amber-300">
            <Trophy size={29} />
          </span>

          <h3 className="display-font mt-6 text-xl font-bold text-white">
            The leaderboard awaits its first champion.
          </h3>

          <p className="mt-3 max-w-md text-sm leading-7 text-text-secondary">
            Complete a quiz to begin your journey. We'll build the scoring
            system and persistent leaderboard after the quiz engine is ready.
          </p>

          <Link to="/explore" className="mt-6">
            <Button>
              Explore quizzes
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LeaderboardPage;
