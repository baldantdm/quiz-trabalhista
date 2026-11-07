import type { Category } from '../@types/quiz';
import { CATEGORY_LABELS } from '../data/questions';

export function formatCategoryName(category: Category): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function formatPercentage(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

export function formatLegalReference(legalBasis: string): string {
  return `Fundamentação Legal: ${legalBasis.trim()}`;
}

export function getPedagogicalFeedback(percentage: number): {
  title: string;
  message: string;
  badgeColor: string;
} {
  if (percentage >= 85) {
    return {
      title: 'Excelente domínio informativo dos direitos trabalhistas!',
      message:
        'Você demonstrou elevado conhecimento sobre as normas da CLT e da Constituição Federal, distinguindo com clareza os fatos legais dos mitos recorrentes no cotidiano de trabalho.',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    };
  }
  if (percentage >= 60) {
    return {
      title: 'Bom nível de conhecimento em cidadania trabalhista!',
      message:
        'Você conhece grande parte das regras fundamentais da legislação trabalhista. Revise os comentários das questões em que teve dúvida para consolidar seu aprendizado preventivo.',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    };
  }
  return {
    title: 'Importante oportunidade de letramento jurídico!',
    message:
      'Muitas dúvidas comuns do dia a dia são cercadas de mitos populares. Utilize o gabarito comentado com os artigos da CLT abaixo para conhecer melhor os direitos e deveres na relação de trabalho.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  };
}
