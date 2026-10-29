import {
  ArrowRight,
  BrainCircuit,
  Code2,
  Compass,
  Globe2,
  Landmark,
  Microscope,
  Palette,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

import PageHeader from "../components/ui/PageHeader";
import { getQuizHistory } from "../utils/quizStorage";
import { getQuestionsForCategory } from "../data/questions";

const categories = [
  {
    id: "general-knowledge",
    name: "General Knowledge",
    description: "A mix of fascinating questions from around the world.",
    icon: Globe2,
    style: "bg-brand-400/10 text-brand-300",
  },
  {
    id: "science-nature",
    name: "Science & Nature",
    description: "Explore biology, space, physics, and the natural world.",
    icon: Microscope,
    style: "bg-emerald-400/10 text-emerald-300",
  },
  {
    id: "technology",
    name: "Technology",
    description: "Discover programming, computers, and digital innovation.",
    icon: Code2,
    style: "bg-sky-400/10 text-sky-300",
  },
  {
    id: "history",
    name: "History",
    description: "Travel through important events and past civilizations.",
    icon: Landmark,
    style: "bg-amber-400/10 text-amber-300",
  },
  {
    id: "arts-culture",
    name: "Arts & Culture",
    description: "Explore creativity, literature, music, and traditions.",
    icon: Palette,
    style: "bg-pink-400/10 text-pink-300",
  },
  {
    id: "curiosity-corner",
    name: "Curiosity Corner",
    description: "Unexpected facts and interesting everyday discoveries.",
    icon: Sparkles,
    style: "bg-violet-400/10 text-violet-300",
  },
];

function ExploreQuizzes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  const history = getQuizHistory();

  const categoriesWithStats = useMemo(
    () =>
      categories.map((category) => {
        const questions = getQuestionsForCategory(category.id, category.name);
        const availableQuestions =
          difficultyFilter === "All"
            ? questions
            : questions.filter(
                (question) => question.difficulty === difficultyFilter,
              );

        const attempts = history.filter(
          (attempt) => attempt.category === category.id,
        );

        const bestAccuracy =
          attempts.length > 0
            ? Math.max(
                ...attempts.map((attempt) => Number(attempt.accuracy) || 0),
              )
            : null;

        return {
          ...category,
          questionCount: questions.length,
          availableQuestionCount: availableQuestions.length,
          attemptCount: attempts.length,
          bestAccuracy,
        };
      }),
    [history, difficultyFilter],
  );

  const filteredCategories = categoriesWithStats.filter((category) => {
    const searchMatches = `${category.name} ${category.description}`
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    return searchMatches && category.availableQuestionCount > 0;
  });

  const totalQuestions = categoriesWithStats.reduce(
    (sum, category) => sum + category.questionCount,
    0,
  );

  return (
    <div>
      <PageHeader
        eyebrow="THE QUIZ LIBRARY"
        title="Explore your curiosity."
        description="Find a topic you love, explore something unfamiliar, and challenge your knowledge."
      />

      <section className="mb-8 rounded-2xl border border-brand-400/15 bg-gradient-to-br from-brand-500/10 to-surface-raised p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-brand-300">
              <Compass size={16} />
              YOUR NEXT DISCOVERY
            </div>

            <h2 className="display-font mt-4 text-2xl font-bold text-white">
              Every question opens a new door.
            </h2>

            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Explore {categories.length} categories with {totalQuestions}{" "}
              available questions. Choose your topic and start learning.
            </p>
          </div>

          <span className="flex h-16 w-16 shrink-0 items-center justify-center self-start rounded-2xl border border-brand-400/20 bg-brand-500/10 text-brand-300 sm:self-center">
            <BrainCircuit size={31} />
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border-subtle pt-5 sm:max-w-md">
          <div>
            <p className="text-2xl font-bold text-white">{categories.length}</p>
            <p className="mt-1 text-xs text-text-muted">Quiz categories</p>
          </div>

          <div>
            <p className="text-2xl font-bold text-white">{history.length}</p>
            <p className="mt-1 text-xs text-text-muted">Quizzes completed</p>
          </div>
        </div>
      </section>

      <section aria-label="Quiz categories">
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <h2 className="display-font text-xl font-bold text-white">
              Browse categories
            </h2>

            <p className="mt-1 text-xs text-text-muted">
              {filteredCategories.length}{" "}
              {filteredCategories.length === 1 ? "category" : "categories"}{" "}
              found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-border-subtle bg-surface-raised px-4 transition focus-within:border-brand-400/50 sm:flex-1">
              <Search size={18} className="shrink-0 text-text-muted" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search categories..."
                aria-label="Search quiz categories"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-text-muted"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear category search"
                  className="text-text-muted transition hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <label className="flex min-h-11 items-center gap-3 rounded-xl border border-border-subtle bg-surface-raised px-4 sm:w-52">
              <span className="shrink-0 text-xs text-text-muted">
                Difficulty
              </span>

              <select
                value={difficultyFilter}
                onChange={(event) => setDifficultyFilter(event.target.value)}
                aria-label="Filter by difficulty"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
              >
                <option value="All" className="bg-surface-raised">
                  All
                </option>
                <option value="Easy" className="bg-surface-raised">
                  Easy
                </option>
                <option value="Medium" className="bg-surface-raised">
                  Medium
                </option>
              </select>
            </label>
          </div>
        </div>

        {filteredCategories.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCategories.map((category) => {
              const Icon = category.icon;

              return (
                <article
                  key={category.id}
                  className="surface-card group flex flex-col p-5 transition duration-200 hover:-translate-y-1 hover:border-brand-400/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.style}`}
                    >
                      <Icon size={22} />
                    </span>

                    <span className="rounded-lg border border-border-subtle px-2.5 py-1 text-[10px] text-text-muted">
                      {category.availableQuestionCount}{" "}
                      {category.availableQuestionCount === 1
                        ? "question"
                        : "questions"}
                    </span>
                  </div>

                  <h3 className="display-font mt-5 text-lg font-bold text-white">
                    {category.name}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-text-secondary">
                    {category.description}
                  </p>

                  <div className="mt-5 rounded-xl bg-surface-raised p-3">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-text-secondary">Your attempts</span>

                      <span className="font-semibold text-white">
                        {category.attemptCount}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                      <span className="text-text-secondary">Personal best</span>

                      <span className="font-semibold text-emerald-300">
                        {category.bestAccuracy === null
                          ? "Not played"
                          : `${category.bestAccuracy}%`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-4">
                    <span className="text-xs text-text-muted">
                      {difficultyFilter === "All"
                        ? "All difficulties"
                        : `${difficultyFilter} difficulty`}
                    </span>

                    <Link
                      to="/quiz"
                      state={{
                        categoryId: category.id,
                        categoryName: category.name,
                      }}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition group-hover:gap-3"
                    >
                      Start quiz
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="surface-card flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-overlay text-text-muted">
              <Search size={24} />
            </span>

            <h3 className="mt-5 font-semibold text-white">
              No matching categories
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
              Try another search term or choose a different difficulty.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setDifficultyFilter("All");
              }}
              className="mt-5 text-sm font-semibold text-brand-300 hover:text-brand-200"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default ExploreQuizzes;
