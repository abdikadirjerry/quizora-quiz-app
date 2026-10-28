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
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router";

import PageHeader from "../components/ui/PageHeader";

const categories = [
  {
    id: "general",
    name: "General Knowledge",
    description: "A mix of fascinating questions from around the world.",
    questions: 25,
    difficulty: "Mixed",
    icon: Globe2,
    style: "bg-brand-400/10 text-brand-300",
  },
  {
    id: "science",
    name: "Science & Nature",
    description: "Explore biology, space, physics, and the natural world.",
    questions: 20,
    difficulty: "Mixed",
    icon: Microscope,
    style: "bg-emerald-400/10 text-emerald-300",
  },
  {
    id: "technology",
    name: "Technology",
    description: "Discover programming, computers, and digital innovation.",
    questions: 15,
    difficulty: "Mixed",
    icon: Code2,
    style: "bg-sky-400/10 text-sky-300",
  },
  {
    id: "history",
    name: "History",
    description: "Travel through important events and past civilizations.",
    questions: 20,
    difficulty: "Mixed",
    icon: Landmark,
    style: "bg-amber-400/10 text-amber-300",
  },
  {
    id: "arts",
    name: "Arts & Culture",
    description: "Explore creativity, literature, music, and traditions.",
    questions: 15,
    difficulty: "Mixed",
    icon: Palette,
    style: "bg-pink-400/10 text-pink-300",
  },
  {
    id: "discovery",
    name: "Curiosity Corner",
    description: "Unexpected facts and interesting everyday discoveries.",
    questions: 25,
    difficulty: "Mixed",
    icon: Sparkles,
    style: "bg-violet-400/10 text-violet-300",
  },
];

function ExploreQuizzes() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        eyebrow="THE QUIZ LIBRARY"
        title="Explore your curiosity."
        description="Find a topic you love, explore something unfamiliar, and get ready to challenge your knowledge."
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
              Browse our planned categories and choose what you want to explore
              first.
            </p>
          </div>

          <span className="flex h-16 w-16 shrink-0 items-center justify-center self-start rounded-2xl border border-brand-400/20 bg-brand-500/10 text-brand-300 sm:self-center">
            <BrainCircuit size={31} />
          </span>
        </div>
      </section>

      <section aria-label="Quiz categories">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="display-font text-xl font-bold text-white">
              Browse categories
            </h2>

            <p className="mt-1 text-xs text-text-muted">
              {filteredCategories.length} categories found
            </p>
          </div>

          <label className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-border-subtle bg-surface-raised px-4 transition focus-within:border-brand-400/50 sm:max-w-sm">
            <Search size={18} className="shrink-0 text-text-muted" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search categories..."
              aria-label="Search quiz categories"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-text-muted"
            />
          </label>
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
                      {category.questions} questions planned
                    </span>
                  </div>

                  <h3 className="display-font mt-5 text-lg font-bold text-white">
                    {category.name}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-text-secondary">
                    {category.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-4">
                    <span className="text-xs text-text-muted">
                      {category.difficulty} difficulty
                    </span>

                    <Link
                      to="/quiz"
                      state={{
                        categoryId: category.id,
                        categoryName: category.name,
                      }}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition group-hover:gap-3"
                    >
                      View quiz
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
              No categories found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
              Try another search term to find a category.
            </p>

            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-5 text-sm font-semibold text-brand-300 hover:text-brand-200"
            >
              Clear search
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default ExploreQuizzes;
