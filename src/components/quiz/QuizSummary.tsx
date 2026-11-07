import React from 'react';
import {
  Award,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Scale,
} from 'lucide-react';
import type { LearningHistoryStats, Question } from '../../@types/quiz';
import { calculateCategoryStats, calculateScore } from '../../utils/analytics';
import {
  formatLegalReference,
  formatPercentage,
  getPedagogicalFeedback,
} from '../../utils/formatters';
import { Button } from '../common/Button';

interface QuizSummaryProps {
  questions: Question[];
  allQuestions: Question[];
  selectedAnswers: Record<number, string>;
  historyStats: LearningHistoryStats;
  onRestartQuiz: () => void;
  onBackToQuestions: () => void;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  questions,
  allQuestions,
  selectedAnswers,
  historyStats,
  onRestartQuiz,
  onBackToQuestions,
}) => {
  const score = calculateScore(questions, selectedAnswers);
  const total = questions.length;
  const answeredCount = questions.filter((q) => Boolean(selectedAnswers[q.id])).length;
  const percentage = formatPercentage(score, total);
  const feedback = getPedagogicalFeedback(percentage);
  const categoryStats = calculateCategoryStats(allQuestions, selectedAnswers);

  return (
    <section
      aria-labelledby="summary-heading"
      className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8"
    >
      {/* Top Pedagogical Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
            <Award className="w-4 h-4" aria-hidden="true" />
            <span>Resultado Pedagógico e Diagnóstico de Letramento</span>
          </div>
          <h2 id="summary-heading" className="text-2xl sm:text-3xl font-bold text-slate-900">
            {feedback.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-700 max-w-2xl leading-relaxed">
            {feedback.message}
          </p>
        </div>

        <div
          className={`shrink-0 rounded-2xl border p-5 text-center min-w-[180px] ${feedback.badgeColor}`}
        >
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">
            Aproveitamento
          </div>
          <div className="text-4xl font-extrabold my-1">{percentage}%</div>
          <div className="text-xs font-semibold">
            {score} acertos em {total} questões ({answeredCount} respondidas)
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-3">
          Desempenho por Eixo Temático da CLT (50 Questões)
        </h3>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <caption className="visually-hidden">
              Estatísticas de acertos por categoria temática da CLT
            </caption>
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                <th scope="col" className="py-3 px-4 font-semibold">
                  Bloco Temático
                </th>
                <th scope="col" className="py-3 px-4 font-semibold text-center">
                  Respondidas
                </th>
                <th scope="col" className="py-3 px-4 font-semibold text-center">
                  Acertos
                </th>
                <th scope="col" className="py-3 px-4 font-semibold text-right">
                  Aproveitamento
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categoryStats.map((stat) => (
                <tr key={stat.category} className="hover:bg-slate-50">
                  <th scope="row" className="py-3 px-4 font-medium text-slate-900">
                    {stat.label}
                  </th>
                  <td className="py-3 px-4 text-center text-slate-700">
                    {stat.answered} / {stat.total}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-emerald-800">
                    {stat.correct}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-blue-900">
                    {stat.accuracyPercentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Local Anonymous History Summary */}
      {historyStats.totalQuizzesCompleted > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 flex flex-wrap items-center justify-between gap-2">
          <span>
            <strong>Estatísticas Anônimas no Dispositivo (LGPD):</strong> Ciclos concluídos:{' '}
            {historyStats.totalQuizzesCompleted} | Melhor pontuação: {historyStats.bestScorePercentage}%
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button variant="outline" onClick={onBackToQuestions}>
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Voltar às Questões</span>
        </Button>

        <Button variant="primary" onClick={onRestartQuiz}>
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Reiniciar Quiz Completo</span>
        </Button>
      </div>

      {/* Complete Commented Answer Key (Gabarito Educativo Comentado) */}
      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-900" aria-hidden="true" />
          <h3 className="text-lg font-bold text-slate-900">
            Guia Rápido e Gabarito Comentado ({questions.length} Dúvidas)
          </h3>
        </div>

        <ul className="space-y-3" role="list">
          {questions.map((q) => {
            const userAnsId = selectedAnswers[q.id];
            const userOpt = q.options.find((o) => o.id === userAnsId);
            const correctOpt = q.options.find((o) => o.isCorrect);

            return (
              <li
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {q.id}. {q.title}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      q.isMythOrFact === 'FATO'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {q.isMythOrFact}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {q.explanation}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold text-blue-900">
                    <Scale className="w-3.5 h-3.5" aria-hidden="true" />
                    {formatLegalReference(q.legalBasis)}
                  </span>

                  {userOpt ? (
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        userOpt.isCorrect ? 'text-emerald-700' : 'text-amber-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      {userOpt.isCorrect
                        ? 'Você acertou esta questão'
                        : `Gabarito: ${correctOpt?.text}`}
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      Gabarito: {correctOpt?.text}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
