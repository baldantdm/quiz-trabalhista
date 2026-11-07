import { useMemo, useCallback } from 'react';
import type { Category, LearningHistoryStats, Question, QuizProgress } from '../@types/quiz';
import { QUESTIONS, CATEGORY_LABELS } from '../data/questions';
import { calculateScore } from '../utils/analytics';
import { formatPercentage } from '../utils/formatters';
import { useLocalStorage } from './useLocalStorage';

const PROGRESS_STORAGE_KEY = 'quiz_trabalhista_progress_v2';
const CATEGORY_STORAGE_KEY = 'quiz_trabalhista_category_v1';
const HISTORY_STORAGE_KEY = 'quiz_trabalhista_history_v1';

const INITIAL_PROGRESS: QuizProgress = {
  currentQuestionIndex: 0,
  selectedAnswers: {},
  score: 0,
  isCompleted: false,
};

const INITIAL_HISTORY: LearningHistoryStats = {
  totalQuizzesCompleted: 0,
  bestScorePercentage: 0,
  lastUpdated: '',
  questionsReviewedCount: 0,
};

function isValidCategory(cat: unknown): cat is Category | 'todas' {
  return (
    cat === 'todas' ||
    (typeof cat === 'string' && Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, cat))
  );
}

export function useQuiz(allQuestions: Question[] = QUESTIONS) {
  const [rawSelectedCategory, setSelectedCategory] = useLocalStorage<Category | 'todas'>(
    CATEGORY_STORAGE_KEY,
    'todas'
  );
  const [progress, setProgress, clearProgress] = useLocalStorage<QuizProgress>(
    PROGRESS_STORAGE_KEY,
    INITIAL_PROGRESS
  );
  const [historyStats, setHistoryStats, clearHistoryStats] =
    useLocalStorage<LearningHistoryStats>(HISTORY_STORAGE_KEY, INITIAL_HISTORY);

  const selectedCategory: Category | 'todas' = isValidCategory(rawSelectedCategory)
    ? rawSelectedCategory
    : 'todas';

  const safeSelectedAnswers: Record<number, string> = useMemo(() => {
    const raw = progress?.selectedAnswers;
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return {};
    }
    return raw;
  }, [progress?.selectedAnswers]);

  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'todas') {
      return allQuestions;
    }
    return allQuestions.filter((q) => q.category === selectedCategory);
  }, [allQuestions, selectedCategory]);

  const rawIndex =
    typeof progress?.currentQuestionIndex === 'number' &&
    Number.isFinite(progress.currentQuestionIndex)
      ? progress.currentQuestionIndex
      : 0;

  const safeIndex = Math.min(
    Math.max(0, rawIndex),
    Math.max(0, filteredQuestions.length - 1)
  );

  const currentQuestion: Question | undefined = filteredQuestions[safeIndex];

  const activeScore = useMemo(
    () => calculateScore(filteredQuestions, safeSelectedAnswers),
    [filteredQuestions, safeSelectedAnswers]
  );

  const answeredInCurrentFilter = useMemo(
    () =>
      filteredQuestions.filter((q) => Boolean(safeSelectedAnswers[q.id])).length,
    [filteredQuestions, safeSelectedAnswers]
  );

  const selectCategory = useCallback(
    (category: Category | 'todas') => {
      const validCat = isValidCategory(category) ? category : 'todas';
      setSelectedCategory(validCat);
      setProgress((prev) => ({
        ...prev,
        selectedAnswers:
          prev?.selectedAnswers && typeof prev.selectedAnswers === 'object'
            ? prev.selectedAnswers
            : {},
        currentQuestionIndex: 0,
        isCompleted: false,
      }));
    },
    [setSelectedCategory, setProgress]
  );

  const selectAnswer = useCallback(
    (questionId: number, optionId: string) => {
      const updatedAnswers = {
        ...safeSelectedAnswers,
        [questionId]: optionId,
      };
      const updatedScore = calculateScore(allQuestions, updatedAnswers);
      const answeredTotal = Object.keys(updatedAnswers).length;

      setProgress((prev) => ({
        ...prev,
        currentQuestionIndex: safeIndex,
        selectedAnswers: updatedAnswers,
        score: updatedScore,
      }));

      setHistoryStats((prev) => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
        questionsReviewedCount: Math.max(
          typeof prev?.questionsReviewedCount === 'number' ? prev.questionsReviewedCount : 0,
          answeredTotal
        ),
      }));
    },
    [allQuestions, safeIndex, safeSelectedAnswers, setProgress, setHistoryStats]
  );

  const completeQuizCycle = useCallback(() => {
    const finalScore = calculateScore(filteredQuestions, safeSelectedAnswers);
    const pct = formatPercentage(finalScore, filteredQuestions.length);
    const answeredTotal = Object.keys(safeSelectedAnswers).length;

    setProgress((prev) => ({
      ...prev,
      currentQuestionIndex: safeIndex,
      selectedAnswers: safeSelectedAnswers,
      isCompleted: true,
    }));

    setHistoryStats((hist) => ({
      totalQuizzesCompleted:
        (typeof hist?.totalQuizzesCompleted === 'number' ? hist.totalQuizzesCompleted : 0) + 1,
      bestScorePercentage: Math.max(
        typeof hist?.bestScorePercentage === 'number' ? hist.bestScorePercentage : 0,
        pct
      ),
      lastUpdated: new Date().toISOString(),
      questionsReviewedCount: Math.max(
        typeof hist?.questionsReviewedCount === 'number' ? hist.questionsReviewedCount : 0,
        answeredTotal
      ),
    }));
  }, [filteredQuestions, safeIndex, safeSelectedAnswers, setProgress, setHistoryStats]);

  const goToNextQuestion = useCallback(() => {
    if (safeIndex + 1 < filteredQuestions.length) {
      setProgress((prev) => ({
        ...prev,
        selectedAnswers: safeSelectedAnswers,
        currentQuestionIndex: safeIndex + 1,
      }));
      return;
    }
    completeQuizCycle();
  }, [completeQuizCycle, filteredQuestions.length, safeIndex, safeSelectedAnswers, setProgress]);

  const goToPreviousQuestion = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      selectedAnswers: safeSelectedAnswers,
      currentQuestionIndex: Math.max(0, safeIndex - 1),
      isCompleted: false,
    }));
  }, [safeIndex, safeSelectedAnswers, setProgress]);

  const goToQuestionIndex = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(0, index), Math.max(0, filteredQuestions.length - 1));
      setProgress((prev) => ({
        ...prev,
        selectedAnswers: safeSelectedAnswers,
        currentQuestionIndex: clamped,
        isCompleted: false,
      }));
    },
    [filteredQuestions.length, safeSelectedAnswers, setProgress]
  );

  const finishQuiz = useCallback(() => {
    completeQuizCycle();
  }, [completeQuizCycle]);

  const resetQuiz = useCallback(() => {
    clearProgress();
  }, [clearProgress]);

  const clearAllData = useCallback(() => {
    clearProgress();
    clearHistoryStats();
  }, [clearProgress, clearHistoryStats]);

  return {
    allQuestions,
    filteredQuestions,
    selectedCategory,
    currentQuestion,
    currentQuestionIndex: safeIndex,
    selectedAnswers: safeSelectedAnswers,
    score: activeScore,
    totalAnswered: answeredInCurrentFilter,
    isCompleted: Boolean(progress?.isCompleted),
    historyStats: {
      totalQuizzesCompleted:
        typeof historyStats?.totalQuizzesCompleted === 'number'
          ? historyStats.totalQuizzesCompleted
          : 0,
      bestScorePercentage:
        typeof historyStats?.bestScorePercentage === 'number'
          ? historyStats.bestScorePercentage
          : 0,
      lastUpdated: typeof historyStats?.lastUpdated === 'string' ? historyStats.lastUpdated : '',
      questionsReviewedCount:
        typeof historyStats?.questionsReviewedCount === 'number'
          ? historyStats.questionsReviewedCount
          : 0,
    },
    selectCategory,
    selectAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestionIndex,
    finishQuiz,
    resetQuiz,
    clearAllData,
  };
}
