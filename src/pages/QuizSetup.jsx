import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Flame,
  Layers3,
  Sparkles,
  Target,
} from "lucide-react";
import Button from "../components/ui/Button";
import { getQuestionsForCategory } from "../data/questions";

const DIFFICULTIES = [
  { id: "all", label: "Mixed", description: "A balanced challenge" },
  { id: "Easy", label: "Easy", description: "Warm up your knowledge" },
  { id: "Medium", label: "Medium", description: "Put your skills to the test" },
];

function QuizSetup() {
  const location = useLocation();
  const navigate = useNavigate();

  const categoryId = location.state?.categoryId ?? "general-knowledge";
  const categoryName = location.state?.categoryName ?? "General Knowledge";

  const [difficulty, setDifficulty] = useState("all");
  const [questionCount, setQuestionCount] = useState(4);

  const categoryQuestions = useMemo(
    () => getQuestionsForCategory(categoryId, categoryName),
    [categoryId, categoryName],
  );

  const availableQuestions = useMemo(() => {
    if (difficulty === "all") return categoryQuestions;

    return categoryQuestions.filter(
      (question) => question.difficulty === difficulty,
    );
  }, [categoryQuestions, difficulty]);

  const questionOptions = [2, 3, 4].filter(
    (count) => count <= availableQuestions.length,
  );

  const selectedCount = questionOptions.includes(questionCount)
    ? questionCount
    : (questionOptions[questionOptions.length - 1] ?? 0);

  function handleDifficultyChange(nextDifficulty) {
    setDifficulty(nextDifficulty);

    const filtered =
      nextDifficulty === "all"
        ? categoryQuestions
        : categoryQuestions.filter(
            (question) => question.difficulty === nextDifficulty,
          );

    const options = [2, 3, 4].filter((count) => count <= filtered.length);

    setQuestionCount(options[options.length - 1] ?? 0);
  }

  function handleStartQuiz() {
    if (selectedCount < 1) return;

    navigate("/quiz/play", {
      state: {
        categoryId,
        categoryName,
        difficulty,
        questionCount: selectedCount,
      },
    });
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/explore"
        className="inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Explore
      </Link>

      <div className="surface-card overflow-hidden rounded-3xl">
        <div className="relative overflow-hidden border-b border-border-subtle bg-gradient-to-br from-brand-500/20 via-surface-raised to-surface p-6 sm:p-9">
          <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-300">
              <Sparkles size={14} />
              PERSONALIZE YOUR SESSION
            </div>

            <h1 className="display-font mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Set up your quiz
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary">
              Choose your difficulty and question count. Make this session
              yours, then see what you know.
            </p>

            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface/80 p-3 pr-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                <Layers3 size={21} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
                  Selected category
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {categoryName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-5 sm:p-8">
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white">
                  Choose difficulty
                </h2>
                <p className="mt-1 text-xs text-text-secondary">
                  Select the challenge that suits you.
                </p>
              </div>
              <Flame size={20} className="text-brand-300" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {DIFFICULTIES.map((item) => {
                const isSelected = difficulty === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleDifficultyChange(item.id)}
                    aria-pressed={isSelected}
                    className={`rounded-2xl border p-4 text-left transition duration-200 ${
                      isSelected
                        ? "border-brand-400 bg-brand-500/10 ring-1 ring-brand-400/20"
                        : "border-border-subtle bg-surface-raised hover:border-brand-400/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-bold ${
                          isSelected ? "text-brand-300" : "text-white"
                        }`}
                      >
                        {item.label}
                      </span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-brand-400 bg-brand-500 text-white"
                            : "border-border-subtle text-transparent"
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-text-secondary">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white">
                  Number of questions
                </h2>
                <p className="mt-1 text-xs text-text-secondary">
                  Options adjust to the selected difficulty.
                </p>
              </div>
              <Target size={20} className="text-brand-300" />
            </div>

            {questionOptions.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {questionOptions.map((count) => {
                  const isSelected = selectedCount === count;

                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      aria-pressed={isSelected}
                      className={`rounded-2xl border px-3 py-5 text-center transition ${
                        isSelected
                          ? "border-brand-400 bg-brand-500/10 ring-1 ring-brand-400/20"
                          : "border-border-subtle bg-surface-raised hover:border-brand-400/40"
                      }`}
                    >
                      <span className="display-font block text-2xl font-bold text-white">
                        {count}
                      </span>
                      <span className="mt-1 block text-xs text-text-secondary">
                        questions
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4 text-sm text-text-secondary">
                There aren't enough questions for this difficulty yet. Try
                another difficulty.
              </div>
            )}
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-raised p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300">
                <Clock3 size={19} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">20 seconds</p>
                <p className="mt-1 text-xs text-text-secondary">Per question</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-raised p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                <Target size={19} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {selectedCount * 100} possible points
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  100 points per correct answer
                </p>
              </div>
            </div>
          </section>

          <div className="border-t border-border-subtle pt-6">
            <Button
              size="lg"
              onClick={handleStartQuiz}
              disabled={selectedCount < 1}
              className="w-full"
            >
              Start quiz
              <ArrowRight size={17} />
            </Button>

            <p className="mt-3 text-center text-xs text-text-muted">
              {availableQuestions.length} questions available for this selection
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuizSetup;
