import {
  ArrowRight,
  BrainCircuit,
  Clock3,
  Flame,
  Play,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import { Link } from "react-router";

import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

const stats = [
  {
    label: "Quizzes completed",
    value: "0",
    note: "Your journey starts here",
    icon: BrainCircuit,
    iconStyle: "bg-brand-500/10 text-brand-300",
  },
  {
    label: "Average accuracy",
    value: "—",
    note: "No attempts yet",
    icon: Target,
    iconStyle: "bg-emerald-400/10 text-emerald-300",
  },
  {
    label: "Time invested",
    value: "0 min",
    note: "Ready for your first quiz?",
    icon: Clock3,
    iconStyle: "bg-sky-400/10 text-sky-300",
  },
  {
    label: "Current streak",
    value: "0 days",
    note: "Start a learning habit",
    icon: Flame,
    iconStyle: "bg-amber-400/10 text-amber-300",
  },
];

const categories = [
  {
    title: "Science & Nature",
    description: "Discover the universe, nature, and scientific ideas.",
    count: "20 questions",
    icon: Sparkles,
    style: "bg-emerald-400/10 text-emerald-300",
  },
  {
    title: "Technology",
    description: "Explore computers, the internet, and innovation.",
    count: "15 questions",
    icon: BrainCircuit,
    style: "bg-sky-400/10 text-sky-300",
  },
  {
    title: "General Knowledge",
    description: "Challenge yourself across a variety of topics.",
    count: "25 questions",
    icon: Trophy,
    style: "bg-brand-400/10 text-brand-300",
  },
];

function Dashboard() {
  return (
    <div>
      <PageHeader
        eyebrow="YOUR LEARNING SPACE"
        title="Welcome to Quizora."
        description="Explore new topics, challenge your knowledge, and build your learning streak one quiz at a time."
        action={
          <Link to="/explore">
            <Button>
              Explore quizzes
              <ArrowRight size={16} />
            </Button>
          </Link>
        }
      />

      <section
        aria-label="Your quiz statistics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article key={stat.label} className="surface-card p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-text-secondary">{stat.label}</p>

                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}
                >
                  <Icon size={19} />
                </span>
              </div>

              <p className="display-font mt-5 text-2xl font-bold text-white">
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-text-muted">{stat.note}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="relative overflow-hidden rounded-2xl border border-brand-400/20 bg-gradient-to-br from-brand-500/15 via-surface-raised to-surface-raised p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl"
          />

          <div className="relative max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-200">
              <Sparkles size={14} />
              YOUR NEXT ADVENTURE
            </span>

            <h2 className="display-font mt-5 text-2xl font-bold leading-tight text-white sm:text-3xl">
              A sharper mind starts with one question.
            </h2>

            <p className="mt-4 text-sm leading-7 text-text-secondary">
              Choose a topic, test what you know, and discover what you can
              learn next. Your first challenge is waiting.
            </p>

            <Link to="/explore" className="mt-6 inline-flex">
              <Button size="lg">
                <Play size={16} />
                Find your first quiz
              </Button>
            </Link>
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
              <Flame size={21} />
            </span>

            <div>
              <h2 className="font-semibold text-white">Daily inspiration</h2>

              <p className="mt-1 text-xs text-text-muted">
                A thought for curious minds
              </p>
            </div>
          </div>

          <blockquote className="mt-6 text-lg font-medium leading-8 text-text-primary">
            "The more you learn, the more you discover how much there is to
            know."
          </blockquote>

          <p className="mt-4 text-xs leading-5 text-text-muted">
            Your learning journey doesn't need to be perfect. It just needs to
            begin.
          </p>

          <div className="mt-6 border-t border-border-subtle pt-5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">Your next step</span>

              <Link
                to="/explore"
                className="inline-flex items-center gap-1.5 font-semibold text-brand-300 hover:text-brand-200"
              >
                Explore
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <PageHeader
          eyebrow="EXPLORE YOUR INTERESTS"
          title="Find your next challenge"
          description="Choose a category that interests you. We'll add difficulty selection and playable quizzes in the next milestones."
          action={
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <article
                key={category.title}
                className="surface-card group p-5 transition duration-200 hover:-translate-y-1 hover:border-brand-400/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.style}`}
                  >
                    <Icon size={22} />
                  </span>

                  <span className="rounded-lg border border-border-subtle px-2.5 py-1 text-[10px] text-text-muted">
                    {category.count}
                  </span>
                </div>

                <h3 className="display-font mt-5 text-lg font-bold text-white">
                  {category.title}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-text-secondary">
                  {category.description}
                </p>

                <Link
                  to="/explore"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition group-hover:gap-3"
                >
                  Explore category
                  <ArrowRight size={15} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
