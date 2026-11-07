import React, { useEffect, useRef } from 'react';
import { BookOpenCheck, CheckCircle2, AlertCircle, X, Scale } from 'lucide-react';
import type { Question } from '../../@types/quiz';
import { formatCategoryName, formatLegalReference } from '../../utils/formatters';
import { Button } from '../common/Button';

interface ExplanationModalProps {
  question: Question;
  selectedOptionId: string;
  isModalOpen: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  question,
  selectedOptionId,
  isModalOpen,
  onCloseModal,
  onOpenModal,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const selectedOption = question.options.find((o) => o.id === selectedOptionId);
  const isCorrect = Boolean(selectedOption?.isCorrect);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isModalOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isModalOpen && dialog.open) {
      dialog.close();
    }
  }, [isModalOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handleBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isDialogContent) {
          dialog.close();
        }
      };
      dialog.addEventListener('click', handleBackdropClick);
      return () => dialog.removeEventListener('click', handleBackdropClick);
    }
  }, []);

  return (
    <>
      {/* Instant inline pedagogical card after answering */}
      <div
        role="status"
        aria-live="polite"
        className={`mt-6 rounded-xl border p-5 ${
          isCorrect
            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
            : 'bg-amber-50/90 border-amber-300 text-amber-950'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-current/15">
          <div className="flex items-center gap-2 font-bold text-base">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" aria-hidden="true" />
            )}
            <span>
              {isCorrect
                ? 'Resposta Correta!'
                : 'Atenção à regra legal — Veja a explicação correta:'}{' '}
              ({question.isMythOrFact === 'FATO' ? 'A afirmação é um FATO' : 'A afirmação é um MITO'})
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/80 border border-current/20">
            <Scale className="w-3.5 h-3.5" aria-hidden="true" />
            {formatLegalReference(question.legalBasis)}
          </span>
        </div>

        <p className="mt-3 text-sm sm:text-base leading-relaxed">{question.explanation}</p>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={onOpenModal}>
            <BookOpenCheck className="w-4 h-4" aria-hidden="true" />
            <span>Ver Ficha Legal Detalhada</span>
          </Button>
        </div>
      </div>

      {/* Native Accessible Dialog for Full Legal Card */}
      <dialog
        ref={dialogRef}
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-labelledby={`explanation-dialog-title-${question.id}`}
        onClose={onCloseModal}
        className="m-auto w-full max-w-xl rounded-2xl bg-white p-0 text-slate-900 shadow-2xl border border-slate-200"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                {formatCategoryName(question.category)} • Questão #{question.id}
              </span>
              <h3
                id={`explanation-dialog-title-${question.id}`}
                className="text-lg font-bold text-slate-900 mt-1"
              >
                {question.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onCloseModal}
              aria-label="Fechar ficha legal detalhada"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 space-y-4 text-sm text-slate-700 leading-relaxed">
            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200">
              <div className="font-semibold text-slate-900 mb-1">
                Classificação da Afirmação: {question.isMythOrFact}
              </div>
              <p className="italic text-slate-700">{question.statement}</p>
            </div>

            <div>
              <div className="font-semibold text-slate-900 mb-1">
                Fundamentação para o Cidadão:
              </div>
              <p>{question.explanation}</p>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 font-medium">
              {formatLegalReference(question.legalBasis)}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
            <Button variant="primary" onClick={onCloseModal}>
              Fechar Ficha Legal
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
};
