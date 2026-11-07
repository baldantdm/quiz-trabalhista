import React from 'react';
import { Scale, BookOpen, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  onOpenLegalModal: () => void;
  onResetQuiz: () => void;
  totalQuestions: number;
  answeredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLegalModal,
  onResetQuiz,
  totalQuestions,
  answeredCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800">
      <a href="#content" className="skip-link visually-hidden">
        Pular para o conteúdo principal
      </a>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-blue-900/80 border border-blue-700/60 text-blue-200 shrink-0 mt-0.5">
              <Scale className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300 mb-1">
                <span>Projeto de Extensão Universitária</span>
                <span aria-hidden="true">•</span>
                <span>Educação Jurídica Cidadã (ODS 8 &amp; ODS 16)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Quiz Educativo de Direitos Trabalhistas (CLT)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Parceria Educativa: <strong>Valdi Dionísio de Medeiros Júnior — Valdi Júnio Sociedade Individual de advocacia (OAB-PB 18.684)</strong> (Áreas de Atuação: Trabalhista, Previdenciário e Empresarial)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenLegalModal}
              className="bg-slate-800/90 border-slate-700 text-slate-100 hover:bg-slate-700"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Nota Ética (OAB)</span>
            </Button>

            {answeredCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onResetQuiz}
                className="bg-slate-800/90 border-slate-700 text-slate-100 hover:bg-slate-700"
                aria-label={`Reiniciar progresso do quiz (${answeredCount} de ${totalQuestions} respondidas)`}
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Reiniciar</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
