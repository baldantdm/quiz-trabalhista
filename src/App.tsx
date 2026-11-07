import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ProgressBar } from './components/common/ProgressBar';
import { LegalDisclaimer } from './components/legal/LegalDisclaimer';
import { CategorySelector } from './components/quiz/CategorySelector';
import { QuestionCard } from './components/quiz/QuestionCard';
import { QuizSummary } from './components/quiz/QuizSummary';
import { useQuiz } from './hooks/useQuiz';

export const App: React.FC = () => {
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  const {
    allQuestions,
    filteredQuestions,
    selectedCategory,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswers,
    score,
    totalAnswered,
    isCompleted,
    historyStats,
    selectCategory,
    selectAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestionIndex,
    finishQuiz,
    resetQuiz,
  } = useQuiz();

  const totalOverallAnswered = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        onOpenLegalModal={() => setIsLegalModalOpen(true)}
        onResetQuiz={resetQuiz}
        totalQuestions={allQuestions.length}
        answeredCount={totalOverallAnswered}
      />

      <main
        id="content"
        tabIndex={-1}
        className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8"
      >
        <LegalDisclaimer
          isOpen={isLegalModalOpen}
          onClose={() => setIsLegalModalOpen(false)}
        />

        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={selectCategory}
          allQuestions={allQuestions}
          selectedAnswers={selectedAnswers}
        />

        {!isCompleted && currentQuestion ? (
          <>
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={filteredQuestions.length}
              answeredCount={totalAnswered}
              score={score}
            />

            <QuestionCard
              question={currentQuestion}
              currentIndex={currentQuestionIndex}
              totalQuestions={filteredQuestions.length}
              selectedOptionId={selectedAnswers[currentQuestion.id]}
              onSelectOption={selectAnswer}
              onPrevious={goToPreviousQuestion}
              onNext={goToNextQuestion}
              onFinishQuiz={finishQuiz}
              onJumpToQuestion={goToQuestionIndex}
              filteredQuestions={filteredQuestions}
              selectedAnswers={selectedAnswers}
            />
          </>
        ) : (
          <QuizSummary
            questions={filteredQuestions}
            allQuestions={allQuestions}
            selectedAnswers={selectedAnswers}
            historyStats={historyStats}
            onRestartQuiz={resetQuiz}
            onBackToQuestions={() => goToQuestionIndex(0)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
