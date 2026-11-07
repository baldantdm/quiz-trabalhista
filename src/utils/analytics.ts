import type { Category, CategoryStats, Question } from '../@types/quiz';
import { CATEGORY_LABELS } from '../data/questions';
import { formatPercentage } from './formatters';

const ALL_CATEGORIES: Category[] = [
  'jornada',
  'remuneracao',
  'ferias',
  'rescisao',
  'fgts_beneficios',
  'saude_estabilidade',
];

export function calculateScore(
  questions: Question[],
  selectedAnswers: Record<number, string>
): number {
  let score = 0;
  for (const question of questions) {
    const selectedOptionId = selectedAnswers[question.id];
    if (!selectedOptionId) continue;
    const chosenOption = question.options.find((opt) => opt.id === selectedOptionId);
    if (chosenOption?.isCorrect) {
      score += 1;
    }
  }
  return score;
}

export function calculateCategoryStats(
  questions: Question[],
  selectedAnswers: Record<number, string>
): CategoryStats[] {
  return ALL_CATEGORIES.map((category) => {
    const categoryQuestions = questions.filter((q) => q.category === category);
    const total = categoryQuestions.length;
    let answered = 0;
    let correct = 0;

    for (const q of categoryQuestions) {
      const selectedId = selectedAnswers[q.id];
      if (selectedId) {
        answered += 1;
        const opt = q.options.find((o) => o.id === selectedId);
        if (opt?.isCorrect) {
          correct += 1;
        }
      }
    }

    return {
      category,
      label: CATEGORY_LABELS[category],
      total,
      answered,
      correct,
      accuracyPercentage: formatPercentage(correct, total),
    };
  }).filter((stat) => stat.total > 0);
}
