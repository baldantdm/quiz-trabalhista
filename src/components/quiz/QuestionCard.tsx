import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Award,
  HelpCircle,
} from 'lucide-react';
import type { Question } from '../../@types/quiz';
import { formatCategoryName } from '../../utils/formatters';
import { Button } from '../common/Button';
import { ExplanationModal } from './ExplanationModal';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelectOption: (questionId: number, optionId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinishQuiz: () => void;
  onJumpToQuestion: (index: number) => void;
  filteredQuestions: Question[];
  selectedAnswers: Record<number, string>;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  onPrevious,
  onNext,
  onFinishQuiz,
  onJumpToQuestion,
  filteredQuestions,
  selectedAnswers,
}) => {
  const [openModalQuestionId, setOpenModalQuestionId] = useState<number | null>(null);
  const isDetailModalOpen = openModalQuestionId === question.id;
  const hasAnswered = Boolean(selectedOptionId);
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <article
      aria-labelledby={`question-heading-${question.id}`}
      className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-8"
    >
      {/* Question Header Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-900">
          {formatCategoryName(question.category)}
        </span>
        <span className="text-xs font-semibold text-slate-500">
          Dúvida #{question.id} de 50 (Posição {currentIndex + 1}/{totalQuestions})
        </span>
      </div>

      {/* Question Title & Contextual Statement */}
      <div className="mt-5">
        <h2
          id={`question-heading-${question.id}`}
          className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug"
        >
          {question.id}. {question.title}
        </h2>

        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm sm:text-base leading-relaxed flex items-start gap-3">
          <HelpCircle
            className="w-5 h-5 text-blue-800 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p>{question.statement}</p>
        </div>
      </div>

      {/* Options Fieldset */}
      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-slate-700 mb-3">
          Selecione a alternativa correta conforme a CLT:
        </legend>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            const letter = String.fromCharCode(65 + idx);

            let optionStyle =
              'bg-white border-slate-300 text-slate-800 hover:border-blue-600 hover:bg-blue-50/40';
            if (hasAnswered) {
              if (option.isCorrect) {
                optionStyle =
                  'bg-emerald-50 border-emerald-600 text-emerald-950 font-medium';
              } else if (isSelected && !option.isCorrect) {
                optionStyle = 'bg-rose-50 border-rose-500 text-rose-950';
              } else {
                optionStyle = 'bg-slate-50 border-slate-200 text-slate-500 opacity-80';
              }
            } else if (isSelected) {
              optionStyle = 'bg-blue-50 border-blue-800 text-blue-950 font-medium';
            }

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectOption(question.id, option.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start justify-between gap-3 cursor-pointer ${optionStyle}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 mt-0.5 ${
                      hasAnswered && option.isCorrect
                        ? 'bg-emerald-700 text-white'
                        : hasAnswered && isSelected && !option.isCorrect
                        ? 'bg-rose-700 text-white'
                        : isSelected
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed">
                    {option.text}
                  </span>
                </div>

                {hasAnswered && option.isCorrect && (
                  <CheckCircle2
                    className="w-5 h-5 text-emerald-700 shrink-0 mt-1"
                    aria-hidden="true"
                  />
                )}
                {hasAnswered && isSelected && !option.isCorrect && (
                  <XCircle
                    className="w-5 h-5 text-rose-600 shrink-0 mt-1"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Instant Pedagogical Explanation + Optional Modal */}
      {selectedOptionId && (
        <ExplanationModal
          key={question.id}
          question={question}
          selectedOptionId={selectedOptionId}
          isModalOpen={isDetailModalOpen}
          onCloseModal={() => setOpenModalQuestionId(null)}
          onOpenModal={() => setOpenModalQuestionId(question.id)}
        />
      )}

      {/* Navigation Controls */}
      <div className="mt-8 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span>Anterior</span>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={onFinishQuiz}>
            <Award className="w-4 h-4" aria-hidden="true" />
            <span>Ver Relatório de Desempenho</span>
          </Button>

          <Button variant="primary" onClick={onNext}>
            <span>{isLastQuestion ? 'Concluir e Ver Resultado' : 'Próxima Questão'}</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Quick Question Navigator */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="text-xs font-semibold text-slate-600 mb-2.5">
          Navegação rápida pelas questões deste bloco ({filteredQuestions.length}):
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filteredQuestions.map((q, idx) => {
            const ansId = selectedAnswers[q.id];
            const isCurr = idx === currentIndex;
            const chosen = q.options.find((o) => o.id === ansId);

            let pillStyle =
              'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200';
            if (isCurr) {
              pillStyle = 'bg-blue-900 text-white border-blue-950 font-bold ring-2 ring-blue-400';
            } else if (ansId && chosen?.isCorrect) {
              pillStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-semibold';
            } else if (ansId && !chosen?.isCorrect) {
              pillStyle = 'bg-amber-100 text-amber-900 border-amber-400 font-semibold';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onJumpToQuestion(idx)}
                aria-label={`Ir para a questão ${q.id}: ${q.title}`}
                aria-current={isCurr ? 'step' : undefined}
                className={`w-8 h-8 rounded-lg text-xs border transition-colors cursor-pointer flex items-center justify-center ${pillStyle}`}
              >
                {q.id}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
};
