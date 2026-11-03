import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeft, CheckCircle2, Clock3, Trophy } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import { getQuizHistory } from "../utils/quizStorage";
import { QUESTION_BANK } from "../data/questions";
import { formatSeconds, getQuizTimeStats } from "../utils/quizTimeStats";
import { getQuizPerformanceInsights } from "../utils/quizPerformanceInsights";
import { getQuizReviewRecommendations } from "../utils/quizReviewRecommendations";

const CATEGORY_LABELS = {
  "general-knowledge": "General Knowledge",
  "science-nature": "Science & Nature",
  technology: "Technology",
  history: "History",
  "arts-culture": "Arts & Culture",
  "curiosity-corner": "Curiosity Corner",
};

function QuizReviewPage() {
  const { attemptId } = useParams();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [reviewedQuestions, setReviewedQuestions] = useState(
    () => new Set([0]),
  );

  const location = useLocation();

  const historyPage = location.state?.fromHistoryPage;

  const navigate = useNavigate();

  const historyUrl =
    Number.isInteger(historyPage) && historyPage > 1
      ? `/history?page=${historyPage}`
      : "/history";

  function handleRetryQuiz() {
    navigate("/quiz/play", {
      state: {
        categoryId: attempt.category,
        categoryName:
          CATEGORY_LABELS[attempt.category] ??
          attempt.category ??
          "General Knowledge",
        difficulty: attempt.difficulty ?? "all",
        questionCount: attempt.totalQuestions ?? 4,
        shuffleQuestions: false,
      },
    });
  }

  const attempt = getQuizHistory().find((item) => item.id === attemptId);

  if (!attempt) {
    return (
      <section className="space-y-6">
        <PageHeader
          eyebrow="QUIZ REVIEW"
          title="Attempt not found"
          description="This quiz attempt may have been deleted."
        />

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleRetryQuiz}>Retry quiz</Button>

          <Link to={historyUrl}>
            <Button variant="secondary">
              <ArrowLeft size={15} />
              Back to history
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const savedQuestions = attempt.questions;

  const questions =
    Array.isArray(savedQuestions) && savedQuestions.length > 0
      ? savedQuestions
      : (attempt.answers ?? []).map((answer) =>
          QUESTION_BANK.find((question) => question.id === answer?.questionId),
        );

  const answers = attempt.answers ?? [];
  const score = Number(attempt.score) || 0;
  const totalQuestions = Number(attempt.totalQuestions) || questions.length;
  const accuracy = Number(attempt.accuracy) || 0;
  const timeStats = getQuizTimeStats(answers);

  const correctCount = answers.filter(
    (answer) =>
      answer?.isCorrect === true &&
      !answer?.skipped &&
      answer?.selectedAnswerIndex != null,
  ).length;

  const difficultyStats = ["Easy", "Medium", "Hard"].map((difficulty) => {
    const difficultyQuestions = questions
      .map((question, index) => ({
        question,
        answer: answers[index],
      }))
      .filter((item) => item.question?.difficulty === difficulty);

    const correct = difficultyQuestions.filter(
      ({ answer }) =>
        answer?.isCorrect === true &&
        !answer?.skipped &&
        answer?.selectedAnswerIndex != null,
    ).length;

    return {
      difficulty,
      correct,
      total: difficultyQuestions.length,
    };
  });

  const performanceInsights = getQuizPerformanceInsights(difficultyStats);

  const skippedCount = answers.filter(
    (answer) => answer?.skipped || answer?.selectedAnswerIndex == null,
  ).length;

  const incorrectCount = answers.filter(
    (answer) =>
      answer?.isCorrect === false &&
      !answer?.skipped &&
      answer?.selectedAnswerIndex != null,
  ).length;

  const reviewRecommendations = getQuizReviewRecommendations({
    accuracy,
    skippedCount,
    totalQuestions,
  });

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  function handlePreviousQuestion() {
    setCurrentQuestionIndex((currentIndex) => Math.max(0, currentIndex - 1));
  }

  function handleNextQuestion() {
    setCurrentQuestionIndex((currentIndex) => {
      const nextIndex = Math.min(questions.length - 1, currentIndex + 1);

      setReviewedQuestions((previous) => {
        const updated = new Set(previous);
        updated.add(nextIndex);
        return updated;
      });

      return nextIndex;
    });
  }

  function handleSelectQuestion(index) {
    setCurrentQuestionIndex(index);

    setReviewedQuestions((previous) => {
      const updated = new Set(previous);
      updated.add(index);
      return updated;
    });
  }

  const reviewedCount = reviewedQuestions.size;

  const reviewProgress =
    questions.length > 0
      ? Math.round((reviewedCount / questions.length) * 100)
      : 0;

  const isReviewComplete =
    questions.length > 0 && reviewedCount === questions.length;

  return (
    <section className="space-y-8">
      <Link
        to={historyUrl}
        className="inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to history
      </Link>

      <PageHeader
        eyebrow="QUIZ REVIEW"
        title={CATEGORY_LABELS[attempt.category] ?? attempt.category ?? "Quiz"}
        description={`Review your ${attempt.difficulty ?? "Mixed"} difficulty attempt.`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="surface-card rounded-2xl p-5">
          <Trophy className="text-warning" size={20} />
          <p className="mt-4 text-2xl font-bold text-white">
            {score}/{totalQuestions}
          </p>
          <p className="mt-1 text-xs text-text-secondary">Final score</p>
        </article>

        <article className="surface-card rounded-2xl p-5">
          <CheckCircle2 className="text-success" size={20} />
          <p className="mt-4 text-2xl font-bold text-white">{accuracy}%</p>
          <p className="mt-1 text-xs text-text-secondary">Accuracy</p>
        </article>

        <article className="surface-card rounded-2xl p-5">
          <Clock3 className="text-info" size={20} />
          <p className="mt-4 text-2xl font-bold text-white">
            {answers.filter((answer) => answer?.timedOut).length}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            Timed-out questions
          </p>
        </article>
      </div>

      <article className="surface-card space-y-4 rounded-2xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white">Your performance</h2>
          <p className="mt-1 text-sm text-text-secondary">
            See how you performed across the quiz.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-success/20 bg-success/5 p-3">
            <p className="text-2xl font-bold text-success">{correctCount}</p>
            <p className="mt-1 text-xs text-text-secondary">Correct</p>
          </div>

          <div className="rounded-xl border border-danger/20 bg-danger/5 p-3">
            <p className="text-2xl font-bold text-danger">{incorrectCount}</p>
            <p className="mt-1 text-xs text-text-secondary">Incorrect</p>
          </div>

          <div className="rounded-xl border border-warning/20 bg-warning/5 p-3">
            <p className="text-2xl font-bold text-warning">{skippedCount}</p>
            <p className="mt-1 text-xs text-text-secondary">Skipped</p>
          </div>
        </div>
      </article>

      <article className="surface-card space-y-4 rounded-2xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white">
            Performance by difficulty
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            See how well you performed at each difficulty level.
          </p>
        </div>

        <div className="space-y-4">
          {difficultyStats
            .filter((item) => item.total > 0)
            .map(({ difficulty, correct, total }) => {
              const percentage = Math.round((correct / total) * 100);

              const barColor =
                difficulty === "Easy"
                  ? "bg-success"
                  : difficulty === "Medium"
                    ? "bg-warning"
                    : "bg-danger";

              return (
                <div key={difficulty} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-white">
                      {difficulty}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {correct}/{total} correct
                    </span>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded-full bg-surface-raised"
                    role="progressbar"
                    aria-label={`${difficulty} accuracy`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percentage}
                  >
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}

          {difficultyStats.every((item) => item.total === 0) && (
            <p className="text-sm text-text-secondary">
              Difficulty statistics are unavailable for this attempt.
            </p>
          )}
        </div>
      </article>

      <article className="surface-card space-y-5 rounded-2xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white">Performance insights</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Understand your strengths and discover where to focus your practice.
          </p>
        </div>

        {performanceInsights.strongest ? (
          <>
            {performanceInsights.strongest.difficulty ===
            performanceInsights.needsPractice.difficulty ? (
              <div className="rounded-xl border border-info/20 bg-info/5 p-4">
                <p className="font-semibold text-white">
                  Consistent performance
                </p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {performanceInsights.message}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-success/20 bg-success/5 p-4">
                  <p className="text-sm font-medium text-success">
                    Your strongest area
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {performanceInsights.strongest.difficulty}
                  </p>

                  <p className="mt-1 text-sm text-text-secondary">
                    {performanceInsights.strongest.accuracy}% accuracy
                  </p>

                  <p className="mt-1 text-xs text-text-secondary">
                    {performanceInsights.strongest.correct}/
                    {performanceInsights.strongest.total} correct
                  </p>
                </div>

                <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
                  <p className="text-sm font-medium text-warning">
                    Area to practise
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {performanceInsights.needsPractice.difficulty}
                  </p>

                  <p className="mt-1 text-sm text-text-secondary">
                    {performanceInsights.needsPractice.accuracy}% accuracy
                  </p>

                  <p className="mt-1 text-xs text-text-secondary">
                    {performanceInsights.needsPractice.correct}/
                    {performanceInsights.needsPractice.total} correct
                  </p>
                </div>
              </div>
            )}

            <p className="text-sm leading-6 text-text-secondary">
              {performanceInsights.message}
            </p>
          </>
        ) : (
          <p className="rounded-xl border border-border-subtle bg-surface-raised p-4 text-sm text-text-secondary">
            {performanceInsights.message}
          </p>
        )}
      </article>

      <article className="surface-card space-y-5 rounded-2xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white">Your next steps</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Personalized recommendations to help you improve your quiz
            performance.
          </p>
        </div>

        <div className="space-y-3">
          {reviewRecommendations.map((recommendation) => {
            const priorityStyles = {
              high: "border-danger/20 bg-danger/5",
              medium: "border-warning/20 bg-warning/5",
              low: "border-info/20 bg-info/5",
              success: "border-success/20 bg-success/5",
              info: "border-border-subtle bg-surface-raised",
            };

            const priorityLabels = {
              high: "High priority",
              medium: "Recommended",
              low: "Next challenge",
              success: "Excellent",
              info: "Getting started",
            };

            return (
              <div
                key={recommendation.id}
                className={`rounded-xl border p-4 ${
                  priorityStyles[recommendation.priority] ?? priorityStyles.info
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-white">
                    {recommendation.title}
                  </h3>

                  <span className="rounded-full border border-current/20 px-2.5 py-1 text-xs font-medium text-text-secondary">
                    {priorityLabels[recommendation.priority] ?? "Suggestion"}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {recommendation.message}
                </p>

                <p className="mt-3 text-sm font-semibold text-white">
                  Next step: {recommendation.action}
                </p>
              </div>
            );
          })}
        </div>
      </article>

      <article className="surface-card space-y-5 rounded-2xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white">Time analysis</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Understand how you spent your time during this quiz.
          </p>
        </div>

        {timeStats.timedQuestionCount > 0 ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-info/20 bg-info/5 p-4">
                <Clock3 size={18} className="text-info" />
                <p className="mt-3 text-2xl font-bold text-white">
                  {formatSeconds(timeStats.totalSeconds)}
                </p>
                <p className="mt-1 text-xs text-text-secondary">Total time</p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-raised p-4">
                <Clock3 size={18} className="text-text-secondary" />
                <p className="mt-3 text-2xl font-bold text-white">
                  {formatSeconds(timeStats.averageSeconds)}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Average per question
                </p>
              </div>

              <div className="rounded-xl border border-success/20 bg-success/5 p-4">
                <CheckCircle2 size={18} className="text-success" />
                <p className="mt-3 text-2xl font-bold text-white">
                  {formatSeconds(timeStats.fastest.timeSpent)}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Fastest · Question {timeStats.fastest.questionNumber}
                </p>
              </div>

              <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
                <Clock3 size={18} className="text-warning" />
                <p className="mt-3 text-2xl font-bold text-white">
                  {formatSeconds(timeStats.slowest.timeSpent)}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Slowest · Question {timeStats.slowest.questionNumber}
                </p>
              </div>
            </div>

            <p className="text-xs text-text-secondary">
              Timing is available for {timeStats.timedQuestionCount} of{" "}
              {questions.length} questions.
            </p>
          </>
        ) : (
          <p className="rounded-xl border border-border-subtle bg-surface-raised p-4 text-sm text-text-secondary">
            Time analysis is unavailable for this attempt because no question
            timing data was saved.
          </p>
        )}
      </article>

      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-white">Question review</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Review your answers one question at a time.
          </p>
        </div>

        {questions.length > 0 ? (
          <>
            {/* Question progress */}
            <div className="surface-card space-y-3 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">
                  {reviewedCount} of {questions.length} questions reviewed
                </span>
                <span className="text-sm text-text-secondary">
                  {reviewProgress}%
                </span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-surface-raised"
                role="progressbar"
                aria-label="Review progress"
                aria-valuemin={0}
                aria-valuemax={questions.length}
                aria-valuenow={reviewedCount}
              >
                <div
                  className="h-full rounded-full bg-info transition-all duration-300"
                  style={{ width: `${reviewProgress}%` }}
                />
              </div>
            </div>

            {/* Question navigator */}
            <div
              className="flex flex-wrap gap-3"
              aria-label="Navigate to a question"
            >
              {questions.map((question, index) => {
                const answer = answers[index];
                const selectedIndex = answer?.selectedAnswerIndex;
                const skipped = answer?.skipped || selectedIndex == null;
                const isCorrect = !skipped && answer?.isCorrect === true;
                const isActive = index === currentQuestionIndex;

                let statusStyle =
                  "border-danger/40 bg-danger/10 text-danger hover:bg-danger/20";

                if (isCorrect) {
                  statusStyle =
                    "border-success/40 bg-success/10 text-success hover:bg-success/20";
                } else if (skipped) {
                  statusStyle =
                    "border-warning/40 bg-warning/10 text-warning hover:bg-warning/20";
                }

                return (
                  <button
                    key={question?.id ?? index}
                    type="button"
                    aria-label={`Go to question ${index + 1}: ${
                      isCorrect ? "correct" : skipped ? "skipped" : "incorrect"
                    }`}
                    aria-current={isActive ? "step" : undefined}
                    onClick={() => handleSelectQuestion(index)}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info ${
                      isActive
                        ? "ring-2 ring-info ring-offset-2 ring-offset-background"
                        : ""
                    } ${statusStyle}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            {/* Current question */}
            <article className="surface-card scroll-mt-6 space-y-5 rounded-2xl p-5 sm:p-6">
              {currentQuestion ? (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold text-text-secondary">
                      QUESTION {currentQuestionIndex + 1} OF {questions.length}
                    </span>

                    {currentQuestion.difficulty && (
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          currentQuestion.difficulty === "Easy"
                            ? "border-success/30 bg-success/10 text-success"
                            : currentQuestion.difficulty === "Medium"
                              ? "border-warning/30 bg-warning/10 text-warning"
                              : "border-danger/30 bg-danger/10 text-danger"
                        }`}
                      >
                        {currentQuestion.difficulty}
                      </span>
                    )}

                    {typeof currentAnswer?.timeSpent === "number" &&
                      Number.isFinite(currentAnswer.timeSpent) &&
                      currentAnswer.timeSpent >= 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-info/20 bg-info/5 px-2.5 py-1 text-xs font-medium text-info">
                          <Clock3 size={13} />
                          {formatSeconds(currentAnswer.timeSpent)}
                        </span>
                      )}
                  </div>

                  <h3 className="text-base font-semibold leading-7 text-white">
                    {currentQuestion.question}
                  </h3>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, optionIndex) => {
                      const isSelected =
                        optionIndex === currentAnswer?.selectedAnswerIndex;

                      const correctIndex =
                        currentQuestion.correctAnswerIndex ??
                        currentAnswer?.correctAnswerIndex;

                      const isAnswer = optionIndex === correctIndex;

                      let optionStyle =
                        "border-border-subtle bg-surface-raised text-text-secondary";

                      if (isAnswer) {
                        optionStyle =
                          "border-success/40 bg-success/10 text-success";
                      } else if (isSelected) {
                        optionStyle =
                          "border-danger/40 bg-danger/10 text-danger";
                      }

                      return (
                        <div
                          key={`${currentQuestion.id}-${optionIndex}`}
                          className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-sm ${optionStyle}`}
                        >
                          <span>
                            {String.fromCharCode(65 + optionIndex)}. {option}
                          </span>

                          <span className="flex shrink-0 items-center gap-2 text-xs font-semibold">
                            {isSelected && "Your answer"}
                            {isAnswer && "Correct answer"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {currentQuestion.explanation && (
                    <div className="rounded-xl border border-info/20 bg-info/5 p-4">
                      <p className="text-xs font-semibold text-info">
                        Explanation
                      </p>
                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-text-secondary">
                  This question is no longer available.
                </p>
              )}
            </article>

            {/* Previous and Next */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                onClick={handlePreviousQuestion}
                disabled={isFirstQuestion}
              >
                <ArrowLeft size={15} />
                Previous
              </Button>

              <Button onClick={handleNextQuestion} disabled={isLastQuestion}>
                Next
                <span aria-hidden="true">→</span>
              </Button>
            </div>
            {isReviewComplete && (
              <section className="surface-card space-y-5 rounded-2xl border border-success/30 p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={28} className="shrink-0 text-success" />

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Review completed!
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      You've reviewed all {questions.length} questions.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-surface-raised p-3">
                    <p className="text-xs text-text-secondary">Score</p>
                    <p className="mt-1 text-xl font-bold text-white">
                      {score}/{totalQuestions}
                    </p>
                  </div>

                  <div className="rounded-xl bg-surface-raised p-3">
                    <p className="text-xs text-text-secondary">Accuracy</p>
                    <p className="mt-1 text-xl font-bold text-white">
                      {accuracy}%
                    </p>
                  </div>

                  <div className="rounded-xl bg-surface-raised p-3">
                    <p className="text-xs text-text-secondary">Reviewed</p>
                    <p className="mt-1 text-xl font-bold text-white">
                      {reviewedCount}/{questions.length}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-6 text-text-secondary">
                  Great work! Use what you've learned to improve your next
                  attempt.
                </p>
              </section>
            )}
          </>
        ) : (
          <p className="surface-card rounded-2xl p-5 text-sm text-text-secondary">
            No questions are available for this attempt.
          </p>
        )}
      </div>

      <Link to={historyUrl}>
        <Button variant="secondary">
          <ArrowLeft size={15} />
          Back to history
        </Button>
      </Link>

      <Button
        variant="secondary"
        onClick={() =>
          navigate("/quiz", {
            state: {
              categoryId: attempt.category,
              categoryName:
                CATEGORY_LABELS[attempt.category] ??
                attempt.category ??
                "General Knowledge",
            },
          })
        }
      >
        Try another challenge
      </Button>
    </section>
  );
}

export default QuizReviewPage;
