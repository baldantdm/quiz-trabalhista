export type Category =
  | 'jornada'
  | 'remuneracao'
  | 'ferias'
  | 'rescisao'
  | 'fgts_beneficios'
  | 'saude_estabilidade';

export interface CategoryInfo {
  id: Category | 'todas';
  label: string;
  shortLabel: string;
  description: string;
  questionRange: string;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  category: Category;
  title: string;              // Ex: "Férias podem iniciar em uma sexta-feira?"
  statement: string;          // Contextualização simples do caso
  options: Option[];
  explanation: string;        // Fundamentação amigável para o leigo
  legalBasis: string;         // Referência legal: Ex: "CLT, Art. 134, § 3º"
  isMythOrFact: 'MITO' | 'FATO';
}

export interface QuizProgress {
  currentQuestionIndex: number;
  selectedAnswers: Record<number, string>; // questionId -> optionId
  score: number;
  isCompleted: boolean;
}

export interface CategoryStats {
  category: Category;
  label: string;
  total: number;
  answered: number;
  correct: number;
  accuracyPercentage: number;
}

export interface LearningHistoryStats {
  totalQuizzesCompleted: number;
  bestScorePercentage: number;
  lastUpdated: string;
  questionsReviewedCount: number;
}
