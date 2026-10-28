import { useMemo } from "react";
import { Link, useLocation } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Lightbulb,
  RotateCcw,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import Button from "../components/ui/Button";
import { getQuestionsForCategory } from "../data/questions";
import useQuiz from "../hooks/useQuiz";

function QuizPage() {
  const location = useLocation();

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

  const timerPercentage = (quiz.timeLeft / 20) * 100;

  if (quiz.status === "completed") {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to quizzes
        </Link>

        <div className="surface-card overflow-hidden rounded-3xl">
          <div className="relative overflow-hidden border-b border-border-subtle bg-gradient-to-br from-brand-500/20 via-surface-raised to-surface p-8 text-center sm:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-brand-400/30 bg-brand-500/15 text-brand-300">
              <Trophy size={38} />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-300">
              Quiz completed
            </p>

            <h1 className="display-font mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {accuracy >= 80
                ? "Outstanding work!"
                : accuracy >= 50
                  ? "Nice effort!"
                  : "Keep learning!"}
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary">
              You finished {categoryName}. Review your result and challenge
              yourself again whenever you're ready.
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
          </div>

          <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border-subtle bg-surface-raised p-4">
              <p className="text-xs text-text-muted">Accuracy</p>
              <p className="display-font mt-2 text-2xl font-bold text-white">
                {accuracy}%
              </p>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface-raised p-4">
              <p className="text-xs text-text-muted">Questions</p>
              <p className="display-font mt-2 text-2xl font-bold text-white">
                {quiz.totalQuestions}
              </p>
            </div>

            <div className="col-span-2 rounded-2xl border border-border-subtle bg-surface-raised p-4 sm:col-span-1">
              <p className="text-xs text-text-muted">Incorrect or skipped</p>
              <p className="display-font mt-2 text-2xl font-bold text-white">
                {quiz.totalQuestions - quiz.score}
              </p>
            </div>
          </div>

          <div className="space-y-4 px-6 pb-6">
            <h2 className="text-sm font-bold text-white">Answer review</h2>

            {quiz.questions.map((question, index) => {
              const answer = quiz.answers[index];
              const isCorrect = answer?.isCorrect;

              return (
                <div
                  key={question.id}
                  className="rounded-2xl border border-border-subtle bg-surface-raised p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        isCorrect
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 size={17} />
                      ) : (
                        <XCircle size={17} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-text-muted">
                        Question {index + 1}
                      </p>

                      <h3 className="mt-1 text-sm font-semibold leading-6 text-white">
                        {question.question}
                      </h3>

                      <p className="mt-3 text-xs leading-5 text-text-secondary">
                        Your answer:{" "}
                        <span
                          className={isCorrect ? "text-success" : "text-danger"}
                        >
                          {answer?.selectedAnswerIndex === null
                            ? "Not answered"
                            : question.options[answer?.selectedAnswerIndex]}
                        </span>
                      </p>

                      {!isCorrect && (
                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                          Correct answer:{" "}
                          <span className="text-success">
                            {question.options[question.correctAnswerIndex]}
                          </span>
                        </p>
                      )}

                      <p className="mt-3 text-xs leading-5 text-text-muted">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button onClick={quiz.restartQuiz} className="flex-1">
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
        <h1 className="text-xl font-bold text-white">No questions available</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Choose another difficulty or category.
        </p>
        <Link
          to="/explore"
          className="mt-4 inline-block text-sm text-brand-300 hover:text-brand-200"
        >
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
              className={`flex min-w-24 items-center justify-center gap-2 rounded-xl border px-4 py-3 ${
                quiz.timeLeft <= 5
                  ? "border-danger/30 bg-danger/10 text-danger"
                  : "border-border-subtle bg-surface-raised text-white"
              }`}
            >
              <Clock3 size={17} />
              <span className="font-mono text-lg font-bold">
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
                  quiz.timeLeft <= 5 ? "bg-danger" : "bg-brand-400"
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
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
              const letters = ["A", "B", "C", "D"];

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => quiz.selectAnswer(index)}
                  disabled={quiz.selectedAnswer !== null}
                  aria-pressed={isSelected}
                  className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 sm:p-5 ${
                    isSelected
                      ? "border-brand-400 bg-brand-500/10 ring-1 ring-brand-400/30"
                      : "border-border-subtle bg-surface-raised hover:border-brand-400/40 hover:bg-surface-overlay"
                  } disabled:cursor-default`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition ${
                      isSelected
                        ? "border-brand-400 bg-brand-500 text-white"
                        : "border-border-subtle bg-surface text-text-secondary group-hover:border-brand-400/40 group-hover:text-white"
                    }`}
                  >
                    {isSelected ? <Check size={17} /> : letters[index]}
                  </span>

                  <span className="flex-1 text-sm font-medium leading-6 text-white sm:text-base">
                    {option}
                  </span>

                  {isSelected && (
                    <span className="text-xs font-semibold text-brand-300">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border-subtle pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-text-muted">
              {quiz.selectedAnswer === null
                ? "Select an answer or skip this question."
                : "Answer selected. Continue when you're ready."}
            </p>

            <Button onClick={quiz.nextQuestion} size="lg" className="min-w-40">
              {quiz.currentIndex === quiz.totalQuestions - 1
                ? "Finish quiz"
                : quiz.selectedAnswer === null
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
          <span className="font-semibold text-white">Quick tip:</span> Trust
          what you know, read each option carefully, and keep moving. You can
          review your answers when the quiz ends.
        </p>
      </div>
    </section>
  );
}

export default QuizPage;
