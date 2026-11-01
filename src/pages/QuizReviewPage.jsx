import { Link, useLocation, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock3,
  SkipForward,
  Trophy,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import { getQuizHistory } from "../utils/quizStorage";
import { QUESTION_BANK } from "../data/questions";

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

  const correctCount = answers.filter(
    (answer) =>
      answer?.isCorrect === true &&
      !answer?.skipped &&
      answer?.selectedAnswerIndex != null,
  ).length;

  const skippedCount = answers.filter(
    (answer) => answer?.skipped || answer?.selectedAnswerIndex == null,
  ).length;

  const incorrectCount = answers.filter(
    (answer) =>
      answer?.isCorrect === false &&
      !answer?.skipped &&
      answer?.selectedAnswerIndex != null,
  ).length;

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

      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-white">Question review</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Review your answers and learn from each question.
          </p>
        </div>

        <div
          className="flex flex-wrap gap-3"
          aria-label="Navigate to a question"
        >
          {questions.map((question, index) => {
            const answer = answers[index];
            const selectedIndex = answer?.selectedAnswerIndex;
            const skipped = answer?.skipped || selectedIndex == null;
            const isCorrect = !skipped && answer?.isCorrect === true;

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
                onClick={() =>
                  document
                    .getElementById(`question-${index + 1}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info ${statusStyle}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {questions.map((question, index) => {
          const answer = answers[index];

          if (!question) {
            return (
              <article
                key={answer?.questionId ?? index}
                className="surface-card rounded-2xl p-5"
              >
                <p className="text-sm text-text-secondary">
                  Question {index + 1} is no longer available.
                </p>
              </article>
            );
          }

          const selectedIndex = answer?.selectedAnswerIndex;
          const correctIndex =
            question.correctAnswerIndex ?? answer?.correctAnswerIndex;

          const skipped = answer?.skipped || selectedIndex == null;
          const timedOut = answer?.timedOut;
          const isCorrect = !skipped && answer?.isCorrect === true;

          return (
            <article
              id={`question-${index + 1}`}
              key={question.id ?? index}
              className="surface-card scroll-mt-6 space-y-5 rounded-2xl p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-text-secondary">
                  QUESTION {index + 1} OF {questions.length}
                </span>

                {isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                    <CheckCircle2 size={15} />
                    Correct
                  </span>
                ) : skipped ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warning">
                    <SkipForward size={15} />
                    {timedOut ? "Timed out" : "Skipped"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger">
                    <XCircle size={15} />
                    Incorrect
                  </span>
                )}
              </div>

              <h3 className="text-base font-semibold leading-7 text-white">
                {question.question}
              </h3>

              <div className="space-y-3">
                {question.options.map((option, optionIndex) => {
                  const isSelected = optionIndex === selectedIndex;
                  const isAnswer = optionIndex === correctIndex;

                  let optionStyle =
                    "border-border-subtle bg-surface-raised text-text-secondary";

                  if (isAnswer) {
                    optionStyle =
                      "border-success/40 bg-success/10 text-success";
                  } else if (isSelected) {
                    optionStyle = "border-danger/40 bg-danger/10 text-danger";
                  }

                  return (
                    <div
                      key={`${question.id}-${optionIndex}`}
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

              {question.explanation && (
                <div className="rounded-xl border border-info/20 bg-info/5 p-4">
                  <p className="text-xs font-semibold text-info">Explanation</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {question.explanation}
                  </p>
                </div>
              )}
            </article>
          );
        })}
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
