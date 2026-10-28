import { Bell, ChevronDown, Menu, Search, Sparkles } from "lucide-react";

import { useLocation } from "react-router";

const pageTitles = {
  "/": {
    title: "Overview",
    description: "Your personal space for learning and discovery.",
  },
  "/explore": {
    title: "Explore Quizzes",
    description: "Find your next challenge and explore new topics.",
  },
  "/leaderboard": {
    title: "Leaderboard",
    description: "Discover how quiz scores and rankings will work.",
  },
  "/history": {
    title: "Quiz History",
    description: "Keep track of your learning journey.",
  },
};

function Topbar({ onMenuClick }) {
  const location = useLocation();

  const currentPage = pageTitles[location.pathname] ?? {
    title: "Quizora",
    description: "Challenge your mind and discover something new.",
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface/90 backdrop-blur-xl">
      <div className="flex min-h-[76px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-controls="app-sidebar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised text-text-secondary transition hover:border-brand-400/40 hover:text-white lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h1 className="display-font truncate text-lg font-bold tracking-tight text-white sm:text-xl">
              {currentPage.title}
            </h1>

            <p className="mt-1 hidden truncate text-xs text-text-muted sm:block">
              {currentPage.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Search quizzes"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised text-text-secondary transition hover:border-brand-400/40 hover:text-white"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised text-text-secondary transition hover:border-brand-400/40 hover:text-white"
          >
            <Bell size={18} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-surface-raised bg-brand-400" />
          </button>

          <div className="mx-1 hidden h-8 w-px bg-border-subtle sm:block" />

          <button
            type="button"
            aria-label="Guest profile"
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-surface-overlay sm:gap-3 sm:pr-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-sky-500 text-white">
              <Sparkles size={17} />
            </span>

            <span className="hidden text-left sm:block">
              <span className="block text-xs font-semibold text-white">
                Guest
              </span>

              <span className="mt-1 block text-[10px] text-text-muted">
                Explorer
              </span>
            </span>

            <ChevronDown
              size={15}
              className="hidden text-text-muted sm:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
