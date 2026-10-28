import {
  ArrowLeft,
  BrainCircuit,
  Clock3,
  Construction,
  Layers3,
  Sparkles,
} from "lucide-react";

import { Link, useLocation } from "react-router";

import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

function QuizPage() {
  const location = useLocation();

  const categoryName = location.state?.categoryName ?? "General Knowledge";

  return (
    <div>
      <PageHeader
        eyebrow="YOUR NEXT CHALLENGE"
        title="Ready to test your knowledge?"
        description="Your selected quiz will start here once the quiz engine is implemented."
        action={
          <Link to="/explore">
            <Button variant="secondary">
              <ArrowLeft size={16} />
              Browse categories
            </Button>
          </Link>
        }
      />

      <section className="mx-auto max-w-3xl">
        <div className="surface-card overflow-hidden">
          <div className="border-b border-border-subtle bg-gradient-to-br from-brand-500/10 to-transparent p-6 sm:p-8">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-300">
              <BrainCircuit size={28} />
            </span>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-300">
              SELECTED CATEGORY
            </p>

            <h2 className="display-font mt-2 text-2xl font-bold text-white sm:text-3xl">
              {categoryName}
            </h2>

            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Get ready for a focused challenge designed to test your knowledge
              and help you learn something new.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            <div className="rounded-xl border border-border-subtle bg-surface p-4">
              <Clock3 size={19} className="text-brand-300" />

              <p className="mt-3 text-xs text-text-muted">Time limit</p>

              <p className="mt-1 font-semibold text-white">To be configured</p>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface p-4">
              <Layers3 size={19} className="text-sky-300" />

              <p className="mt-3 text-xs text-text-muted">Question count</p>

              <p className="mt-1 font-semibold text-white">To be configured</p>
            </div>
          </div>

          <div className="mx-6 mb-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-5 sm:mx-8 sm:mb-8">
            <div className="flex items-start gap-3">
              <Construction
                size={21}
                className="mt-0.5 shrink-0 text-amber-300"
              />

              <div>
                <h3 className="font-semibold text-white">
                  Quiz engine coming next
                </h3>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  The application layout and navigation are ready. Next, we'll
                  build the real question data, answer selection, progress
                  tracking, and scoring logic.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border-subtle px-6 py-5 sm:px-8">
            <Link to="/explore">
              <Button variant="secondary" className="w-full">
                <Sparkles size={16} />
                Choose another category
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default QuizPage;
