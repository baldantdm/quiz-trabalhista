import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-white font-semibold mb-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" aria-hidden="true" />
              <h2>Conformidade Ética — Provimento nº 205/2021 do CFOAB</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Este portal interativo possui caráter estritamente <strong>educativo, informativo e pedagógico</strong> sobre a legislação trabalhista brasileira (CLT e Constituição Federal). O conteúdo não configura consultoria jurídica, não substitui a análise técnica individualizada de um(a) advogado(a) e veda qualquer forma de mercantilização, captação de clientela ou estímulo ao litígio.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-white font-semibold mb-2">
              <Info className="w-5 h-5 text-blue-400" aria-hidden="true" />
              <h2>Identificação Institucional e Privacidade (LGPD)</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Responsável Técnico pelo Conteúdo Jurídico: <strong>Valdi Dionísio de Medeiros Júnior — Valdi Júnio Sociedade Individual de advocacia (Inscrição OAB-PB 18.684)</strong> (Direito Trabalhista, Previdenciário e Empresarial). Este aplicativo armazena apenas o progresso anônimo no próprio navegador (LocalStorage), sem coletar dados pessoais (Lei nº 13.709/2018 — LGPD).
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>
            Projeto de Extensão I — CST em Análise e Desenvolvimento de Sistemas (Programa de Contexto à Comunidade).
          </p>
          <p>
            Alinhado às Metas 8.8 e 16.10 dos Objetivos de Desenvolvimento Sustentável (ODS/ONU).
          </p>
        </div>
      </div>
    </footer>
  );
};
