import React, { useEffect, useRef } from 'react';
import { Scale, X, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface LegalDisclaimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Fallback for browsers without native closedby="any" support per modern-web-guidance
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
      {/* Persistent Sober Educational Banner */}
      <aside
        aria-label="Aviso de conformidade ética e caráter informativo"
        className="bg-blue-950/5 border border-blue-900/20 rounded-xl px-4 py-3 mb-6 text-xs sm:text-sm text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-start sm:items-center gap-2.5">
          <Scale className="w-4 h-4 text-blue-900 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <p>
            <strong>Conteúdo Exclusivamente Educativo (Provimento nº 205/2021 CFOAB):</strong>{' '}
            Material informativo de conscientização cidadã sobre a CLT. Não constitui aconselhamento jurídico para casos concretos.
          </p>
        </div>
      </aside>

      {/* Native Modal Dialog for Detailed Ethical Notice */}
      <dialog
        ref={dialogRef}
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-labelledby="legal-disclaimer-title"
        onClose={onClose}
        className="m-auto w-full max-w-2xl rounded-2xl bg-white p-0 text-slate-900 shadow-2xl border border-slate-200"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <Scale className="w-6 h-6 text-blue-900" aria-hidden="true" />
              <h2 id="legal-disclaimer-title" className="text-lg font-bold text-slate-900">
                Nota de Conformidade Ética e Caráter Educativo (OAB)
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar nota ética"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              Esta aplicação web foi desenvolvida no âmbito do <strong>Projeto de Extensão Universitária (CST em Análise e Desenvolvimento de Sistemas)</strong> em parceria técnica com o escritório de advocacia identificado no cabeçalho e rodapé.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0 mt-1" aria-hidden="true" />
                <span>
                  <strong>Finalidade Informativa (Art. 4º do Provimento 205/2021 do CFOAB):</strong> As 50 questões e suas respectivas fundamentações na CLT têm propósito estritamente pedagógico e de utilidade pública, visando ao letramento jurídico da comunidade.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0 mt-1" aria-hidden="true" />
                <span>
                  <strong>Ausência de Captação ou Estímulo ao Litígio:</strong> Este quiz não coleta dados pessoais, não realiza triagem de clientes, não promete resultados e não substitui a consulta formal a um(a) advogado(a) ou à Defensoria Pública / Sindicato.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0 mt-1" aria-hidden="true" />
                <span>
                  <strong>Identificação Obrigatória (Art. 3º, § 1º):</strong> Responsável pela supervisão jurídica das informações: <strong>Valdi Dionísio de Medeiros Júnior — Valdi Júnio Sociedade Individual de advocacia (OAB-PB 18.684)</strong> (Atuação: Direito Trabalhista, Previdenciário e Empresarial).
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
            <Button variant="primary" onClick={onClose}>
              Compreendi e Fechar
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
};
