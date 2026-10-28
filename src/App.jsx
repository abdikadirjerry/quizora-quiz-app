import {
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Flame,
  Layers3,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

const designTokens = [
  {
    name: "Primary",
    className: "bg-brand-500",
    value: "#8B5CF6",
  },
  {
    name: "Background",
    className: "bg-surface",
    value: "#11111B",
  },
  {
    name: "Card",
    className: "bg-surface-raised",
    value: "#181825",
  },
  {
    name: "Success",
    className: "bg-success",
    value: "#34D399",
  },
];

const previewCategories = [
  {
    name: "Science & Nature",
    description: "Explore the world around you.",
    questions: 20,
    icon: Sparkles,
    iconStyle: "bg-emerald-400/10 text-emerald-300",
  },
  {
    name: "Technology",
    description: "Test your digital knowledge.",
    questions: 15,
    icon: Zap,
    iconStyle: "bg-sky-400/10 text-sky-300",
  },
  {
    name: "General Knowledge",
    description: "A little bit of everything.",
    questions: 25,
    icon: BrainCircuit,
    iconStyle: "bg-brand-400/10 text-brand-300",
  },
];

function BrandLogo() {
  return (
    <a
      href="#home"
      className="flex w-fit items-center gap-3 rounded-xl"
      aria-label="Quizora home"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-glow">
        <BrainCircuit size={23} strokeWidth={2.2} />
      </span>

      <span className="display-font text-xl font-bold tracking-tight text-white">
        quizora<span className="text-brand-400">.</span>
      </span>
    </a>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-300">
        {eyebrow}
      </p>

      <h2 className="display-font text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
        {description}
      </p>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="surface-card p-5 transition duration-200 hover:border-brand-500/40">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-sm text-text-secondary">{label}</span>

        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300">
          <Icon size={20} />
        </span>
      </div>

      <p className="display-font text-3xl font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-text-muted">{detail}</p>
    </article>
  );
}

function App() {
  return (
    <div
      id="home"
      className="min-h-screen overflow-hidden bg-surface text-text-primary"
    >
      <header className="border-b border-border-subtle bg-surface/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
          <BrandLogo />

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-border-subtle bg-surface-raised px-3 py-2 text-xs text-text-secondary sm:flex">
              <span className="h-2 w-2 rounded-full bg-success" />
              Design system preview
            </span>

            <a
              href="#components"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-surface transition hover:bg-brand-100"
            >
              Explore UI
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-brand-500/10 blur-[120px]"
        />

        <section className="relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-2 text-xs font-semibold text-brand-200">
              <Sparkles size={15} />
              THE NEW WAY TO PLAY & LEARN
            </div>

            <h1 className="display-font max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Challenge your mind.
              <br />
              <span className="text-gradient">Discover your genius.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-text-secondary sm:text-lg">
              Welcome to Quizora, where curiosity becomes a challenge. Explore
              interesting topics, test your knowledge, and celebrate every new
              thing you learn.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 text-sm font-bold text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.98]"
              >
                Start exploring
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-raised px-5 py-3.5 text-sm font-semibold text-text-primary transition hover:border-brand-400/50 hover:bg-surface-overlay"
              >
                <CircleHelp size={17} />
                Discover Quizora
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-text-muted">
              <span className="flex items-center gap-2">
                <Check size={15} className="text-success" />
                Fun learning
              </span>

              <span className="flex items-center gap-2">
                <Check size={15} className="text-success" />
                Instant feedback
              </span>

              <span className="flex items-center gap-2">
                <Check size={15} className="text-success" />
                Track progress
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-brand-500/10 via-transparent to-sky-500/10 blur-2xl" />

            <div className="surface-card relative overflow-hidden p-6 sm:p-8">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
                    Your next challenge
                  </p>

                  <h2 className="display-font mt-2 text-xl font-bold text-white">
                    Knowledge Quest
                  </h2>
                </div>

                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-300">
                  <BrainCircuit size={25} />
                </span>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border-subtle bg-surface p-4">
                  <Clock3 size={19} className="mb-3 text-brand-300" />

                  <p className="text-xs text-text-muted">Time limit</p>

                  <p className="mt-1 font-semibold text-white">10 minutes</p>
                </div>

                <div className="rounded-xl border border-border-subtle bg-surface p-4">
                  <Layers3 size={19} className="mb-3 text-sky-300" />

                  <p className="text-xs text-text-muted">Questions</p>

                  <p className="mt-1 font-semibold text-white">15 questions</p>
                </div>
              </div>

              <div className="rounded-xl border border-brand-400/20 bg-brand-500/5 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-brand-200">
                    SAMPLE QUESTION
                  </span>

                  <span className="rounded-md bg-brand-500/10 px-2 py-1 text-[10px] font-bold uppercase text-brand-300">
                    Easy
                  </span>
                </div>

                <h3 className="display-font text-lg font-semibold leading-7 text-white">
                  Which planet is known as the Red Planet?
                </h3>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-surface-raised px-4 py-3">
                    <span className="text-sm text-text-secondary">
                      A. Venus
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-lg border border-success/40 bg-success/10 px-4 py-3">
                    <span className="text-sm font-medium text-white">
                      B. Mars
                    </span>

                    <Check size={17} className="text-success" />
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-surface-raised px-4 py-3">
                    <span className="text-sm text-text-secondary">
                      C. Jupiter
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-text-muted">
                  Preview only. We'll implement real questions and interactive
                  answer selection in a later milestone.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="components" className="relative mt-20 sm:mt-28">
          <SectionHeading
            eyebrow="01 / Design system"
            title="Built on consistency."
            description="Our reusable colors, typography, and components will keep the entire application visually consistent."
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {designTokens.map((token) => (
              <article
                key={token.name}
                className="surface-card overflow-hidden p-3"
              >
                <div
                  className={`h-24 rounded-lg border border-white/5 ${token.className}`}
                />

                <div className="px-1 pb-1 pt-4">
                  <p className="text-sm font-semibold text-white">
                    {token.name}
                  </p>

                  <p className="mt-1 font-mono text-xs text-text-muted">
                    {token.value}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mt-20 sm:mt-24">
          <SectionHeading
            eyebrow="02 / Components"
            title="Designed for every challenge."
            description="Reusable components help us build new features faster without sacrificing visual quality."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {previewCategories.map((category) => {
              const Icon = category.icon;

              return (
                <article
                  key={category.name}
                  className="surface-card group p-5 transition duration-200 hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-glow"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.iconStyle}`}
                    >
                      <Icon size={23} />
                    </span>

                    <span className="rounded-lg border border-border-subtle px-2.5 py-1 text-xs text-text-muted">
                      {category.questions} questions
                    </span>
                  </div>

                  <h3 className="display-font text-lg font-bold text-white">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {category.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-4">
                    <span className="text-xs text-text-muted">
                      Category preview
                    </span>

                    <ChevronRight
                      size={18}
                      className="text-text-muted transition group-hover:translate-x-1 group-hover:text-brand-300"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="relative mt-20 sm:mt-24">
          <SectionHeading
            eyebrow="03 / Interface metrics"
            title="A glimpse of the experience."
            description="These sample metrics demonstrate how we'll present quiz statistics in the dashboard. They are illustrative, not real user data."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Layers3}
              label="Quiz categories"
              value="06"
              detail="Planned starting categories"
            />

            <MetricCard
              icon={CircleHelp}
              label="Question bank"
              value="120+"
              detail="Target sample question count"
            />

            <MetricCard
              icon={Flame}
              label="Daily challenges"
              value="01"
              detail="Feature planned for later"
            />

            <MetricCard
              icon={Trophy}
              label="Achievements"
              value="08"
              detail="Illustrative achievement target"
            />
          </div>
        </section>

        <section className="relative mt-20 overflow-hidden rounded-2xl border border-brand-400/20 bg-gradient-to-br from-brand-500/15 via-surface-raised to-surface-raised p-7 sm:p-10">
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-200">
                <Sparkles size={17} />
                THE JOURNEY STARTS HERE
              </div>

              <h2 className="display-font text-2xl font-bold text-white sm:text-3xl">
                Great things start with curiosity.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary">
                This is the visual foundation. Next, we'll turn it into a
                complete application with real navigation, quiz categories, and
                working interactive features.
              </p>
            </div>

            <a
              href="#home"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              Back to top
              <ArrowRight size={17} />
            </a>
          </div>
        </section>

        <footer className="mt-16 border-t border-border-subtle pt-6 text-center text-xs text-text-muted">
          <p>© {new Date().getFullYear()} Quizora. Built for curious minds.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
