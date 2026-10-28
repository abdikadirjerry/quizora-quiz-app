function PageHeader({ eyebrow, title, description, action, className = "" }) {
  return (
    <div
      className={[
        "mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      ].join(" ")}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-300">
            {eyebrow}
          </p>
        )}

        <h2 className="display-font text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default PageHeader;
