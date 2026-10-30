import { Link, useParams } from "react-router";
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

  const attempt = getQuizHistory().find((item) => item.id === attemptId);

  if (!attempt) {
    return (
      <section className="space-y-6">
        <PageHeader
          eyebrow="QUIZ REVIEW"
          title="Attempt not found"
          description="This quiz attempt may have been deleted."
        />

        <Link to="/history">
          <Button variant="secondary">
            <ArrowLeft size={15} />
            Back to history
          </Button>
        </Link>
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

  return (
    <section className="space-y-8">
      <Link
        to="/history"
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

      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-white">Question review</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Review your answers and learn from each question.
          </p>
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
              key={question.id ?? index}
              className="surface-card space-y-5 rounded-2xl p-5 sm:p-6"
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

      <Link to="/history">
        <Button variant="secondary">
          <ArrowLeft size={15} />
          Back to history
        </Button>
      </Link>
    </section>
  );
}

export default QuizReviewPage;
