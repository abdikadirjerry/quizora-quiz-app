import { NavLink } from "react-router";
import {
  BrainCircuit,
  ChartNoAxesCombined,
  Compass,
  History,
  House,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

const navigationItems = [
  {
    label: "Overview",
    path: "/",
    icon: House,
    end: true,
  },
  {
    label: "Explore Quizzes",
    path: "/explore",
    icon: Compass,
  },
  {
    label: "Leaderboard",
    path: "/leaderboard",
    icon: Trophy,
  },
  {
    label: "Quiz History",
    path: "/history",
    icon: History,
  },
];

function AppSidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        id="app-sidebar"
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col",
          "border-r border-border-subtle bg-surface",
          "transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Main navigation"
      >
        <div className="flex h-[76px] items-center justify-between border-b border-border-subtle px-6">
          <NavLink
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl"
            aria-label="Quizora home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-glow">
              <BrainCircuit size={23} strokeWidth={2.2} />
            </span>

            <span className="display-font text-xl font-bold tracking-tight text-white">
              quizora<span className="text-brand-400">.</span>
            </span>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-overlay hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
            Workspace
          </p>

          <nav aria-label="Workspace navigation" className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "group flex min-h-11 items-center gap-3 rounded-xl px-3.5",
                      "text-sm font-medium transition duration-200",
                      isActive
                        ? "border border-brand-400/15 bg-brand-500/10 text-brand-200"
                        : "border border-transparent text-text-secondary hover:bg-surface-overlay hover:text-white",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        className={
                          isActive
                            ? "text-brand-300"
                            : "text-text-muted group-hover:text-white"
                        }
                      />

                      <span className="flex-1">{item.label}</span>

                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="mb-4 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
            Your learning
          </div>

          <div className="rounded-2xl border border-brand-400/15 bg-gradient-to-br from-brand-500/10 to-transparent p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300">
              <Sparkles size={20} />
            </span>

            <h3 className="mt-4 text-sm font-semibold text-white">
              Keep your mind active
            </h3>

            <p className="mt-2 text-xs leading-5 text-text-secondary">
              Every quiz is an opportunity to discover something new.
            </p>

            <NavLink
              to="/explore"
              onClick={onClose}
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-300 hover:text-brand-200"
            >
              Find a challenge
              <Compass size={14} />
            </NavLink>
          </div>
        </div>

        <div className="border-t border-border-subtle p-4">
          <div className="flex items-center gap-3 rounded-xl px-2 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-400/20 bg-brand-500/10 text-sm font-bold text-brand-200">
              Q
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                Quizora Explorer
              </p>

              <p className="mt-1 text-xs text-text-muted">Guest experience</p>
            </div>

            <ChartNoAxesCombined size={18} className="text-text-muted" />
          </div>
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;
