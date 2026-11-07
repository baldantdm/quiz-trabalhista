import type { Category, CategoryInfo, Question } from '../@types/quiz';
import rawQuestions from '../../public/data/questions.json';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'todas',
    label: 'Todas as Categorias (50 Questões)',
    shortLabel: 'Todas (50)',
    description: 'Percorra todas as 50 principais dúvidas sobre direitos trabalhistas na CLT.',
    questionRange: '1 a 50',
  },
  {
    id: 'jornada',
    label: 'Bloco A: Jornada de Trabalho e Horas Extras',
    shortLabel: 'Jornada e Horas Extras',
    description: 'Limites de jornada, adicional de 50% e 100%, tolerância de ponto, banco de horas e intervalos.',
    questionRange: '1 a 10',
  },
  {
    id: 'remuneracao',
    label: 'Bloco B: Salário, Pagamentos e Descontos',
    shortLabel: 'Salário e Pagamentos',
    description: 'Prazo até o 5º dia útil, 13º salário, vale-transporte, comissões, gorjetas e adicional noturno.',
    questionRange: '11 a 20',
  },
  {
    id: 'ferias',
    label: 'Bloco C: Férias e Descansos',
    shortLabel: 'Férias e Descansos',
    description: 'Período aquisitivo e concessivo, fracionamento em até 3 vezes, abono pecuniário e terço constitucional.',
    questionRange: '21 a 28',
  },
  {
    id: 'rescisao',
    label: 'Bloco D: Rescisão Contratual e Demissão',
    shortLabel: 'Rescisão e Demissão',
    description: 'Sem justa causa, pedido de demissão, acordo mútuo (Art. 484-A), prazo de 10 dias, aviso prévio e justa causa.',
    questionRange: '29 a 37',
  },
  {
    id: 'fgts_beneficios',
    label: 'Bloco E: FGTS e Benefícios Sociais',
    shortLabel: 'FGTS e Benefícios',
    description: 'Depósito mensal de 8%, saque-aniversário, seguro-desemprego, PIS/Abono Salarial e benefícios convencionais.',
    questionRange: '38 a 43',
  },
  {
    id: 'saude_estabilidade',
    label: 'Bloco F: Estabilidade, Saúde e Segurança',
    shortLabel: 'Saúde e Estabilidade',
    description: 'Estabilidade da gestante e acidentária, insalubridade, periculosidade, atestados médicos, assédio moral e equiparação.',
    questionRange: '44 a 50',
  },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  jornada: 'Bloco A: Jornada de Trabalho e Horas Extras',
  remuneracao: 'Bloco B: Salário, Pagamentos e Descontos',
  ferias: 'Bloco C: Férias e Descansos',
  rescisao: 'Bloco D: Rescisão Contratual e Demissão',
  fgts_beneficios: 'Bloco E: FGTS e Benefícios Sociais',
  saude_estabilidade: 'Bloco F: Estabilidade, Saúde e Segurança',
};

export const QUESTIONS: Question[] = rawQuestions as Question[];
