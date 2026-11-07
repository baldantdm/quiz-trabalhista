import React from 'react';
import { formatPercentage } from '../../utils/formatters';

interface ProgressBarProps {
  current: number;
  total: number;
  answeredCount: number;
  score: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  answeredCount,
  score,
}) => {
  const completionPct = formatPercentage(answeredCount, total);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-2">
        <div>
          <span>
            Questão <strong>{current}</strong> de <strong>{total}</strong>
          </span>
          <span className="mx-2 text-slate-400" aria-hidden="true">
            |
          </span>
          <span>
            Respondidas: <strong>{answeredCount}/{total}</strong> ({completionPct}%)
          </span>
        </div>
        <div className="text-blue-900 font-semibold">
          Acertos no bloco atual: {score} de {answeredCount}
        </div>
      </div>

      <div
        className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={completionPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso de respostas: ${completionPct}% concluído`}
      >
        <div
          className="bg-blue-800 h-full transition-all duration-300 rounded-full"
          style={{ width: `${completionPct}%` }}
        />
      </div>
    </div>
  );
};
