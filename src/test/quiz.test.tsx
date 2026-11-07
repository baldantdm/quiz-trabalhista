import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { QUESTIONS, CATEGORIES } from '../data/questions';
import { calculateScore, calculateCategoryStats } from '../utils/analytics';
import { formatPercentage, getPedagogicalFeedback } from '../utils/formatters';

describe('Quiz Educativo de Direitos Trabalhistas (CLT) — Base Estática e Regras', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('contém exatamente as 50 questões estáticas categorizadas nos 6 blocos temáticos', () => {
    expect(QUESTIONS).toHaveLength(50);

    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(50);
    expect(Math.min(...ids)).toBe(1);
    expect(Math.max(...ids)).toBe(50);

    const byCategory = {
      jornada: QUESTIONS.filter((q) => q.category === 'jornada').length,
      remuneracao: QUESTIONS.filter((q) => q.category === 'remuneracao').length,
      ferias: QUESTIONS.filter((q) => q.category === 'ferias').length,
      rescisao: QUESTIONS.filter((q) => q.category === 'rescisao').length,
      fgts_beneficios: QUESTIONS.filter((q) => q.category === 'fgts_beneficios').length,
      saude_estabilidade: QUESTIONS.filter((q) => q.category === 'saude_estabilidade').length,
    };

    expect(byCategory).toEqual({
      jornada: 10,
      remuneracao: 10,
      ferias: 8,
      rescisao: 9,
      fgts_beneficios: 6,
      saude_estabilidade: 7,
    });

    const correctPositions = [0, 0, 0];
    for (const q of QUESTIONS) {
      expect(q.title.length).toBeGreaterThan(5);
      expect(q.statement.length).toBeGreaterThan(10);
      expect(q.explanation.length).toBeGreaterThan(15);
      expect(q.legalBasis.length).toBeGreaterThan(3);
      expect(['MITO', 'FATO']).toContain(q.isMythOrFact);
      const correctOptions = q.options.filter((o) => o.isCorrect);
      expect(correctOptions).toHaveLength(1);
      const correctIdx = q.options.findIndex((o) => o.isCorrect);
      expect(correctIdx).toBeGreaterThanOrEqual(0);
      expect(correctIdx).toBeLessThan(3);
      correctPositions[correctIdx] += 1;
    }

    // Garante que as respostas corretas estão embaralhadas entre A, B e C (e não todas em A)
    expect(correctPositions[0]).toBeGreaterThanOrEqual(15);
    expect(correctPositions[1]).toBeGreaterThanOrEqual(15);
    expect(correctPositions[2]).toBeGreaterThanOrEqual(15);
  });

  it('calcula pontuação e estatísticas por categoria corretamente (incluindo casos limites)', () => {
    expect(calculateScore(QUESTIONS, {})).toBe(0);
    expect(calculateScore([], { 1: '1c' })).toBe(0);
    expect(calculateScore(QUESTIONS, { 999: 'inexistente' })).toBe(0);
    expect(formatPercentage(0, 0)).toBe(0);
    expect(formatPercentage(0, -5)).toBe(0);
    expect(formatPercentage(25, 50)).toBe(50);

    const sampleAnswers: Record<number, string> = {
      1: '1c', // correta (jornada)
      2: '2a', // incorreta (jornada)
      21: '21c', // correta (ferias)
    };

    expect(calculateScore(QUESTIONS, sampleAnswers)).toBe(2);

    const stats = calculateCategoryStats(QUESTIONS, sampleAnswers);
    expect(stats).toHaveLength(6);
    const jornadaStat = stats.find((s) => s.category === 'jornada')!;
    expect(jornadaStat.answered).toBe(2);
    expect(jornadaStat.correct).toBe(1);
    expect(jornadaStat.accuracyPercentage).toBe(10);
  });

  it('retorna feedback pedagógico adequado para diferentes faixas de pontuação', () => {
    expect(getPedagogicalFeedback(90).title).toContain('Excelente');
    expect(getPedagogicalFeedback(85).title).toContain('Excelente');
    expect(getPedagogicalFeedback(70).title).toContain('Bom nível');
    expect(getPedagogicalFeedback(60).title).toContain('Bom nível');
    expect(getPedagogicalFeedback(40).title).toContain('Importante oportunidade');
    expect(getPedagogicalFeedback(0).title).toContain('Importante oportunidade');
  });

  it('renderiza a SPA com conformidade ética da OAB, seleção de resposta, explicação imediata e filtro de categorias', () => {
    render(<App />);

    // Verifica título, dados do advogado/escritório/OAB e avisos éticos do Provimento 205/2021 da OAB
    expect(
      screen.getByRole('heading', {
        name: /Quiz Educativo de Direitos Trabalhistas \(CLT\)/i,
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Provimento nº 205\/2021/i).length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText(/Valdi Dionísio de Medeiros Júnior/i).length
    ).toBeGreaterThanOrEqual(2);
    expect(
      screen.getAllByText(/Valdi Júnio Sociedade Individual de advocacia/i).length
    ).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/OAB-PB 18\.684/i).length).toBeGreaterThanOrEqual(2);

    // Verifica a primeira questão (#1)
    expect(
      screen.getByRole('heading', { name: /1\. O que conta como hora extra\?/i })
    ).toBeInTheDocument();

    // Botão Anterior deve estar desabilitado na questão 1
    expect(screen.getByRole('button', { name: /Anterior/i })).toBeDisabled();

    // Seleciona a alternativa correta da questão 1
    const firstOptionBtn = screen.getByRole('button', {
      name: /FATO — O trabalho que ultrapassa a jornada normal diária/i,
    });
    fireEvent.click(firstOptionBtn);

    // Verifica exibição imediata da explicação pedagógica e base legal
    expect(screen.getByText(/Resposta Correta!/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/Fundamentação Legal: CF\/88, Art\. 7º, XIII e CLT, Art\. 58/i)
        .length
    ).toBeGreaterThanOrEqual(1);

    // Navega para a próxima questão (#2)
    const nextBtn = screen.getByRole('button', { name: /Próxima Questão/i });
    fireEvent.click(nextBtn);
    expect(
      screen.getByRole('heading', {
        name: /2\. Qual é o adicional mínimo da hora extra\?/i,
      })
    ).toBeInTheDocument();

    // Filtra pelo Bloco C (Férias e Descansos)
    const feriasFilterBtn = screen.getByRole('button', {
      name: /Férias e Descansos/i,
    });
    fireEvent.click(feriasFilterBtn);
    expect(
      screen.getByRole('heading', {
        name: /21\. Quando o trabalhador ganha direito às férias\?/i,
      })
    ).toBeInTheDocument();

    // Abre o relatório de desempenho final
    const summaryBtn = screen.getByRole('button', {
      name: /Ver Relatório de Desempenho/i,
    });
    fireEvent.click(summaryBtn);

    expect(
      screen.getByRole('heading', {
        name: /Desempenho por Eixo Temático da CLT/i,
      })
    ).toBeInTheDocument();
    expect(CATEGORIES).toHaveLength(7);
  });

  it('persiste progresso no LocalStorage, ignora estado legado v1 pré-embaralhamento, suporta salto para a última questão (50) e reinicialização completa', () => {
    // Estado legado v1 (onde '1a' era correta antes do embaralhamento) deve ser ignorado na chave v2
    window.localStorage.setItem(
      'quiz_trabalhista_progress_v1',
      JSON.stringify({ currentQuestionIndex: 0, selectedAnswers: { 1: '1a' }, score: 1, isCompleted: false })
    );
    // Injeta JSON malformado na chave v2 para garantir resiliência de leitura no hook
    window.localStorage.setItem('quiz_trabalhista_progress_v2', '{invalid-json');
    const { unmount } = render(<App />);

    // Deve recuperar com estado inicial limpo na questão 1 sem resposta pré-selecionada do v1
    expect(
      screen.getByRole('heading', { name: /1\. O que conta como hora extra\?/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/Atenção à regra legal/i)).not.toBeInTheDocument();

    // Pula para a última questão (#50) pelo navegador rápido
    const jump50Btn = screen.getByRole('button', {
      name: /Ir para a questão 50:/i,
    });
    fireEvent.click(jump50Btn);

    expect(
      screen.getByRole('heading', { name: /50\. O que é equiparação salarial\?/i })
    ).toBeInTheDocument();

    // Seleciona resposta na questão 50
    const opt50a = screen.getByRole('button', {
      name: /FATO — Preenchidos os requisitos legais do Art\. 461 da CLT/i,
    });
    fireEvent.click(opt50a);

    // Desmonta e remonta para testar persistência no LocalStorage
    unmount();
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /50\. O que é equiparação salarial\?/i })
    ).toBeInTheDocument();

    // Conclui o quiz na última questão
    const finishBtn = screen.getByRole('button', {
      name: /Concluir e Ver Resultado/i,
    });
    fireEvent.click(finishBtn);

    expect(
      screen.getByRole('heading', {
        name: /Desempenho por Eixo Temático da CLT/i,
      })
    ).toBeInTheDocument();

    // Reinicia o quiz a partir do sumário
    const restartBtn = screen.getByRole('button', {
      name: /Reiniciar Quiz Completo/i,
    });
    fireEvent.click(restartBtn);

    expect(
      screen.getByRole('heading', { name: /1\. O que conta como hora extra\?/i })
    ).toBeInTheDocument();
  });

  it('resiste a payloads JSON válidos porém parciais/nulos no LocalStorage, corrige índices fora do limite na navegação e incrementa ciclos apenas 1 vez em StrictMode', async () => {
    const React = await import('react');
    window.localStorage.setItem('quiz_trabalhista_progress_v2', 'null');
    window.localStorage.setItem('quiz_trabalhista_category_v1', '"categoria_inexistente"');
    window.localStorage.setItem('quiz_trabalhista_history_v1', '{"totalQuizzesCompleted": "invalido"}');

    const { unmount } = render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Deve cair no fallback seguro 'todas' na questão 1 sem lançar TypeError
    expect(
      screen.getByRole('heading', { name: /1\. O que conta como hora extra\?/i })
    ).toBeInTheDocument();

    unmount();

    // Agora testa objeto parcial sem selectedAnswers e com currentQuestionIndex acima do limite (999)
    window.localStorage.setItem(
      'quiz_trabalhista_progress_v2',
      JSON.stringify({ currentQuestionIndex: 999, selectedAnswers: null })
    );

    render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Clamped na questão 50
    expect(
      screen.getByRole('heading', { name: /50\. O que é equiparação salarial\?/i })
    ).toBeInTheDocument();

    // Clicar em Anterior a partir de índice clamped (999 -> 49) deve ir para a questão 49 imediatamente
    fireEvent.click(screen.getByRole('button', { name: /Anterior/i }));
    expect(
      screen.getByRole('heading', {
        name: /49\. O que configura assédio moral no ambiente de trabalho\?/i,
      })
    ).toBeInTheDocument();

    // Concluir em StrictMode deve incrementar Ciclos concluídos exatamente para 1 (e não 2)
    fireEvent.click(screen.getByRole('button', { name: /Ver Relatório de Desempenho/i }));
    expect(screen.getByText(/Ciclos concluídos:\s*1\b/i)).toBeInTheDocument();
  });
});
