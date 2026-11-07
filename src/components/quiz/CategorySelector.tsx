import React from 'react';
import type { Category, Question } from '../../@types/quiz';
import { CATEGORIES } from '../../data/questions';

interface CategorySelectorProps {
  selectedCategory: Category | 'todas';
  onSelectCategory: (category: Category | 'todas') => void;
  allQuestions: Question[];
  selectedAnswers: Record<number, string>;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  allQuestions,
  selectedAnswers,
}) => {
  return (
    <nav aria-label="Filtro por eixo temático da CLT" className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Eixos Temáticos da CLT (6 Blocos • 50 Dúvidas)
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const catQuestions =
            cat.id === 'todas'
              ? allQuestions
              : allQuestions.filter((q) => q.category === cat.id);
          const answeredInCat = catQuestions.filter((q) =>
            Boolean(selectedAnswers[q.id])
          ).length;

          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-900 text-white border-blue-950 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-85">
                    Questões {cat.questionRange}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isSelected
                        ? 'bg-blue-800 text-blue-100'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {answeredInCat}/{catQuestions.length}
                  </span>
                </div>
                <div className="font-semibold text-sm mt-1 leading-snug">
                  {cat.shortLabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
