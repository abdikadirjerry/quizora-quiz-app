import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatChartDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const attempt = payload[0].payload;

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised p-3 shadow-xl">
      <p className="text-xs text-text-secondary">
        {formatChartDate(attempt.completedAt)}
      </p>

      <p className="mt-1 text-lg font-bold text-white">{attempt.accuracy}%</p>

      <p className="text-xs text-text-secondary">
        {attempt.score}/{attempt.totalQuestions} correct answers
      </p>
    </div>
  );
}

function QuizPerformanceChart({ history }) {
  const chartData = [...history]
    .filter((attempt) => !Number.isNaN(new Date(attempt.completedAt).getTime()))
    .sort(
      (a, b) =>
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
    )
    .map((attempt, index) => ({
      ...attempt,
      accuracy: Number(attempt.accuracy) || 0,
      attemptNumber: index + 1,
      dateLabel: formatChartDate(attempt.completedAt),
    }));

  if (chartData.length < 2) {
    return (
      <section className="surface-card rounded-3xl p-6">
        <h2 className="text-base font-bold text-white">
          Performance over time
        </h2>

        <p className="mt-1 text-xs text-text-secondary">
          Your quiz accuracy trend will appear here.
        </p>

        <div className="flex min-h-56 flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold text-white">
            Not enough quiz history yet
          </p>

          <p className="mt-2 max-w-sm text-xs leading-5 text-text-secondary">
            Complete at least two quizzes to see how your accuracy changes over
            time.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="surface-card rounded-3xl p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-base font-bold text-white">
          Performance over time
        </h2>

        <p className="mt-1 text-xs text-text-secondary">
          Track your quiz accuracy across your recent attempts.
        </p>
      </div>

      <div className="h-64 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 12, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              stroke="var(--color-border-subtle)"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="attemptNumber"
              tickFormatter={(value) => `#${value}`}
              tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="var(--color-brand-300)"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "var(--color-brand-300)",
                strokeWidth: 2,
                stroke: "var(--color-surface-card)",
              }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-center text-xs text-text-secondary">
        Quiz attempts, from oldest to newest
      </p>
    </section>
  );
}

export default QuizPerformanceChart;
