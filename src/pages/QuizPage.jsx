import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Clock3,
  Lightbulb,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import Button from "../components/ui/Button";
import { getQuestionsForCategory } from "../data/questions";
import useQuiz from "../hooks/useQuiz";

const SECONDS_PER_QUESTION = 20;

function QuizPage() {
  const location = useLocation();
  const [reviewFilter, setReviewFilter] = useState("all");

  const {
    categoryId = "general-knowledge",
    categoryName = "General Knowledge",
    difficulty = "all",
    questionCount = 4,
  } = location.state ?? {};

  const questions = useMemo(() => {
    const categoryQuestions = getQuestionsForCategory(categoryId, categoryName);

    const filteredQuestions =
      difficulty === "all"
        ? categoryQuestions
        : categoryQuestions.filter(
            (question) => question.difficulty === difficulty,
          );

    return filteredQuestions.slice(0, questionCount);
  }, [categoryId, categoryName, difficulty, questionCount]);

  const quiz = useQuiz(questions);
  const currentQuestion = quiz.questions[quiz.currentIndex];

  const accuracy =
    quiz.totalQuestions > 0
      ? Math.round((quiz.score / quiz.totalQuestions) * 100)
      : 0;

  const timerPercentage = (quiz.timeLeft / SECONDS_PER_QUESTION) * 100;
  const isTimerUrgent = quiz.timeLeft <= 5;
  const isAnswerSelected = quiz.selectedAnswer !== null;

  const isSelectedCorrect =
    isAnswerSelected &&
    quiz.selectedAnswer === currentQuestion?.correctAnswerIndex;

  if (quiz.status === "completed") {
    const unansweredCount = quiz.answers.filter(
      (answer) => answer.selectedAnswerIndex === null,
    ).length;

    const incorrectCount = quiz.totalQuestions - quiz.score - unansweredCount;

    const reviewQuestions = quiz.questions
      .map((question, index) => ({
        question,
        answer: quiz.answers[index],
        index,
      }))
      .filter(({ answer }) => {
        if (reviewFilter === "incorrect") {
          return answer && !answer.isCorrect && !answer.timedOut;
        }

        if (reviewFilter === "unanswered") {
          return answer?.selectedAnswerIndex === null;
        }

        if (reviewFilter === "correct") {
          return answer?.isCorrect;
        }

        return true;
      });

    const performanceMessage =
      accuracy >= 90
        ? "Outstanding performance!"
        : accuracy >= 70
          ? "Great work!"
          : accuracy >= 50
            ? "Good effort. Keep improving!"
            : "Every attempt is a chance to learn!";

    return (
      <section className="mx-auto max-w-4xl space-y-6">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to quizzes
        </Link>

        <div className="surface-card overflow-hidden rounded-3xl">
          <div className="relative overflow-hidden border-b border-border-subtle bg-gradient-to-br from-brand-500/20 via-surface-raised to-surface p-8 text-center sm:p-12">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />

            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-brand-400/30 bg-brand-500/15 text-brand-300">
              {accuracy >= 80 ? <Trophy size={38} /> : <Award size={38} />}
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-300">
              Quiz completed
            </p>

            <h1 className="display-font mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {performanceMessage}
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary">
              You finished {categoryName}. Review your answers, understand your
              mistakes, and use what you learned in your next challenge.
            </p>

            <div className="mt-8">
              <p className="display-font text-6xl font-bold text-white">
                {quiz.score}
                <span className="text-3xl text-text-muted">
                  /{quiz.totalQuestions}
                </span>
              </p>

              <p className="mt-2 text-sm text-text-secondary">
                Correct answers
              </p>
            </div>

            <div className="mx-auto mt-6 h-2 max-w-xs overflow-hidden rounded-full bg-surface-overlay">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300 transition-all duration-500"
                style={{ width: `${accuracy}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-text-muted">{accuracy}% accuracy</p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 sm:p-6">
            {[
              {
                label: "Accuracy",
                value: `${accuracy}%`,
                icon: Target,
                color: "text-brand-300",
              },
              {
                label: "Correct",
                value: quiz.score,
                icon: CheckCircle2,
                color: "text-success",
              },
              {
                label: "Incorrect",
                value: incorrectCount,
                icon: XCircle,
                color: "text-danger",
              },
              {
                label: "Unanswered",
                value: unansweredCount,
                icon: Clock3,
                color: "text-warning",
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border-subtle bg-surface-raised p-4"
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={stat.color} />
                    <p className="text-xs text-text-muted">{stat.label}</p>
                  </div>

                  <p className="display-font mt-3 text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="space-y-5 px-5 pb-6 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Answer review</h2>
                <p className="mt-1 text-xs leading-5 text-text-muted">
                  Check your answers and learn why each correct answer is right.
                </p>
              </div>

              <span className="text-xs text-text-secondary">
                {reviewQuestions.length} of {quiz.totalQuestions} questions
              </span>
            </div>

            <div
              className="flex flex-wrap gap-2"
              aria-label="Filter answer review"
            >
              {[
                { id: "all", label: "All questions" },
                { id: "incorrect", label: "Incorrect" },
                { id: "unanswered", label: "Unanswered" },
                { id: "correct", label: "Correct" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setReviewFilter(filter.id)}
                  aria-pressed={reviewFilter === filter.id}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    reviewFilter === filter.id
                      ? "border-brand-400/40 bg-brand-500/15 text-brand-300"
                      : "border-border-subtle bg-surface-raised text-text-secondary hover:border-brand-400/30 hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {reviewQuestions.length === 0 ? (
              <div className="rounded-2xl border border-border-subtle bg-surface-raised/50 px-5 py-10 text-center">
                <CheckCircle2 size={28} className="mx-auto text-success" />

                <h3 className="mt-3 text-sm font-bold text-white">
                  No questions in this category
                </h3>

                <p className="mt-2 text-xs leading-5 text-text-secondary">
                  Try another review filter to see your other answers.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewQuestions.map(({ question, answer, index }) => {
                  const isCorrect = Boolean(answer?.isCorrect);
                  const selectedAnswerIndex = answer?.selectedAnswerIndex;
                  const wasUnanswered = selectedAnswerIndex === null;

                  return (
                    <article
                      key={question.id}
                      className="rounded-2xl border border-border-subtle bg-surface-raised p-4 sm:p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            isCorrect
                              ? "bg-success/10 text-success"
                              : wasUnanswered
                                ? "bg-warning/10 text-warning"
                                : "bg-danger/10 text-danger"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 size={18} />
                          ) : wasUnanswered ? (
                            <Clock3 size={18} />
                          ) : (
                            <XCircle size={18} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs text-text-muted">
                              Question {index + 1}
                            </p>

                            <span
                              className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
                                isCorrect
                                  ? "bg-success/10 text-success"
                                  : wasUnanswered
                                    ? "bg-warning/10 text-warning"
                                    : "bg-danger/10 text-danger"
                              }`}
                            >
                              {isCorrect
                                ? "Correct"
                                : answer?.timedOut
                                  ? "Time expired"
                                  : wasUnanswered
                                    ? "Skipped"
                                    : "Incorrect"}
                            </span>
                          </div>

                          <h3 className="mt-2 text-sm font-semibold leading-6 text-white">
                            {question.question}
                          </h3>

                          <div className="mt-4 space-y-3 text-xs leading-5">
                            <div>
                              <p className="text-text-muted">Your answer</p>
                              <p
                                className={`mt-1 font-medium ${
                                  isCorrect
                                    ? "text-success"
                                    : wasUnanswered
                                      ? "text-warning"
                                      : "text-danger"
                                }`}
                              >
                                {wasUnanswered
                                  ? "Not answered"
                                  : (question.options[selectedAnswerIndex] ??
                                    "Not answered")}
                              </p>
                            </div>

                            <div>
                              <p className="text-text-muted">Correct answer</p>
                              <p className="mt-1 font-medium text-success">
                                {question.options[question.correctAnswerIndex]}
                              </p>
                            </div>
                          </div>

                          {question.explanation && (
                            <div className="mt-4 rounded-xl border border-brand-400/10 bg-brand-500/5 p-3">
                              <div className="flex items-start gap-2">
                                <Lightbulb
                                  size={16}
                                  className="mt-0.5 shrink-0 text-brand-300"
                                />

                                <div>
                                  <p className="text-xs font-semibold text-white">
                                    Explanation
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                                    {question.explanation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-border-subtle pt-5 sm:flex-row">
              <Button
                onClick={() => {
                  setReviewFilter("all");
                  quiz.restartQuiz();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex-1"
              >
                <RotateCcw size={16} />
                Try again
              </Button>

              <Link to="/explore" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Explore quizzes
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!currentQuestion) {
    return (
      <section className="surface-card rounded-3xl p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-raised text-brand-300">
          <Lightbulb size={25} />
        </div>

        <h1 className="mt-5 text-xl font-bold text-white">
          No questions available
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
          This category has no questions matching your selection. Choose another
          category or difficulty.
        </p>

        <Link
          to="/explore"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200"
        >
          <ArrowLeft size={15} />
          Return to Explore
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/explore"
        className="inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-white"
      >
        <ArrowLeft size={16} />
        All quizzes
      </Link>

      <div className="surface-card overflow-hidden rounded-3xl">
        <div className="border-b border-border-subtle p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-300">
                <Zap size={14} />
                QUIZ IN PROGRESS
              </div>

              <h1 className="display-font mt-2 text-2xl font-bold text-white sm:text-3xl">
                {categoryName}
              </h1>

              <p className="mt-1 text-sm text-text-secondary">
                {difficulty === "all"
                  ? "Mixed difficulty"
                  : `${difficulty} difficulty`}
                {" · "}
                {quiz.totalQuestions} questions
              </p>
            </div>

            <div
              role="timer"
              aria-label={`${quiz.timeLeft} seconds remaining`}
              aria-live={isTimerUrgent ? "assertive" : "off"}
              className={`flex min-w-24 items-center justify-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                isTimerUrgent
                  ? "border-danger/30 bg-danger/10 text-danger"
                  : "border-border-subtle bg-surface-raised text-white"
              }`}
            >
              <Clock3 size={17} />

              <span className="font-mono text-lg font-bold tabular-nums">
                00:{String(quiz.timeLeft).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-text-secondary">
                Question {quiz.currentIndex + 1} of {quiz.totalQuestions}
              </span>

              <span className="font-semibold text-brand-300">
                {Math.round(
                  ((quiz.currentIndex + 1) / quiz.totalQuestions) * 100,
                )}
                %
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-surface-overlay"
              role="progressbar"
              aria-label="Quiz progress"
              aria-valuemin={0}
              aria-valuemax={quiz.totalQuestions}
              aria-valuenow={quiz.currentIndex + 1}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300 transition-all duration-300"
                style={{
                  width: `${
                    ((quiz.currentIndex + 1) / quiz.totalQuestions) * 100
                  }%`,
                }}
              />
            </div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-overlay">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  isTimerUrgent ? "bg-danger" : "bg-brand-400"
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>

            {isTimerUrgent && (
              <p className="mt-2 text-right text-xs font-medium text-danger">
                Hurry! Time is running out.
              </p>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-brand-400/20 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold capitalize text-brand-300">
              {currentQuestion.category.replaceAll("-", " ")}
            </span>

            <span className="rounded-lg border border-border-subtle bg-surface-raised px-3 py-1.5 text-xs font-medium text-text-secondary">
              {currentQuestion.difficulty}
            </span>

            <span className="ml-auto text-xs text-text-muted">
              +100 points for a correct answer
            </span>
          </div>

          <h2 className="display-font max-w-3xl text-2xl font-bold leading-relaxed tracking-tight text-white sm:text-3xl">
            {currentQuestion.question}
          </h2>

          <div className="mt-8 grid gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = quiz.selectedAnswer === index;
              const isCorrectOption =
                isAnswerSelected &&
                index === currentQuestion.correctAnswerIndex;
              const isWrongSelected = isSelected && !isSelectedCorrect;
              const letters = ["A", "B", "C", "D"];

              let optionStyle =
                "border-border-subtle bg-surface-raised hover:border-brand-400/40 hover:bg-surface-overlay";

              let letterStyle =
                "border-border-subtle bg-surface text-text-secondary group-hover:border-brand-400/40 group-hover:text-white";

              if (isSelected && isSelectedCorrect) {
                optionStyle =
                  "border-success/50 bg-success/10 ring-1 ring-success/20";
                letterStyle = "border-success bg-success text-white";
              } else if (isWrongSelected) {
                optionStyle =
                  "border-danger/50 bg-danger/10 ring-1 ring-danger/20";
                letterStyle = "border-danger bg-danger text-white";
              } else if (isCorrectOption) {
                optionStyle = "border-success/50 bg-success/10";
                letterStyle = "border-success bg-success text-white";
              }

              return (
                <button
                  key={`${currentQuestion.id}-${index}`}
                  type="button"
                  onClick={() => quiz.selectAnswer(index)}
                  disabled={isAnswerSelected}
                  aria-pressed={isSelected}
                  className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 sm:p-5 ${optionStyle} disabled:cursor-default`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition ${letterStyle}`}
                  >
                    {isSelected && isSelectedCorrect ? (
                      <CheckCircle2 size={17} />
                    ) : isWrongSelected ? (
                      <XCircle size={17} />
                    ) : isCorrectOption ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      letters[index]
                    )}
                  </span>

                  <span className="flex-1 text-sm font-medium leading-6 text-white sm:text-base">
                    {option}
                  </span>

                  {isSelected && (
                    <span
                      className={`text-xs font-semibold ${
                        isSelectedCorrect ? "text-success" : "text-danger"
                      }`}
                    >
                      {isSelectedCorrect ? "Correct" : "Incorrect"}
                    </span>
                  )}

                  {!isSelected && isCorrectOption && (
                    <span className="text-xs font-semibold text-success">
                      Correct answer
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {isAnswerSelected && (
            <div
              role="status"
              className={`mt-5 rounded-2xl border p-4 ${
                isSelectedCorrect
                  ? "border-success/20 bg-success/5"
                  : "border-brand-400/20 bg-brand-500/5"
              }`}
            >
              <div className="flex items-start gap-3">
                {isSelectedCorrect ? (
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-success"
                  />
                ) : (
                  <Lightbulb
                    size={19}
                    className="mt-0.5 shrink-0 text-brand-300"
                  />
                )}

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      isSelectedCorrect ? "text-success" : "text-white"
                    }`}
                  >
                    {isSelectedCorrect
                      ? "Excellent! That's correct."
                      : "Not quite. Here's what to remember."}
                  </p>

                  <p className="mt-2 text-xs leading-6 text-text-secondary">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border-subtle pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-text-muted">
              {isAnswerSelected
                ? "Review the explanation, then continue."
                : "Select an answer or skip this question."}
            </p>

            <Button onClick={quiz.nextQuestion} size="lg" className="min-w-40">
              {quiz.currentIndex === quiz.totalQuestions - 1
                ? "Finish quiz"
                : !isAnswerSelected
                  ? "Skip question"
                  : "Next question"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-surface-raised/60 p-4">
        <Lightbulb size={18} className="mt-0.5 shrink-0 text-brand-300" />

        <p className="text-xs leading-5 text-text-secondary">
          <span className="font-semibold text-white">Quick tip:</span> Read
          every option carefully. Learn from each explanation, and remember that
          skipped questions count as incorrect.
        </p>
      </div>
    </section>
  );
}

export default QuizPage;
