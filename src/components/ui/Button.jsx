import { LoaderCircle } from "lucide-react";

const variants = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/10",

  secondary:
    "border border-border-subtle bg-surface-raised text-text-primary hover:border-brand-400/40 hover:bg-surface-overlay",

  ghost: "text-text-secondary hover:bg-surface-overlay hover:text-white",

  danger: "bg-danger/10 text-danger hover:bg-danger/20",
};

const sizes = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-4 py-2.5 text-sm",
  lg: "min-h-12 px-5 py-3 text-sm",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
        "transition duration-200 focus-visible:outline-2",
        "focus-visible:outline-brand-400 focus-visible:outline-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      ].join(" ")}
      {...props}
    >
      {loading && <LoaderCircle size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export default Button;
