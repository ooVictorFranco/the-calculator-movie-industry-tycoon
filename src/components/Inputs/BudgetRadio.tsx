// src/components/Buttons/BudgetRadio.tsx
"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { BudgetOption, BUDGET_VALUES } from "@/constants/budget";
import { toTranslationRecord } from "@/utils/translationHelpers";

type BudgetRadioProps = {
  label?: string;
  selectedValue: string;
  onChange: (value: string) => void;
};

const getBudgetColorClass = (isSelected: boolean): string =>
  isSelected ? "bg-blue-500 text-white border-blue-500" : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800";

const BudgetRadio: React.FC<BudgetRadioProps> = ({ label, selectedValue, onChange }) => {
  const { translations: t } = useLanguage();
  const tr = toTranslationRecord(t);

  // Define as opções dinamicamente utilizando as chaves de tradução (em inglês)
  const budgetOptions: BudgetOption[] = [
    { value: BUDGET_VALUES.SMALL, label: tr["BUDGET_SMALL"] || BUDGET_VALUES.SMALL },
    { value: BUDGET_VALUES.MODERATE, label: tr["BUDGET_MODERATE"] || BUDGET_VALUES.MODERATE },
    { value: BUDGET_VALUES.LARGE, label: tr["BUDGET_LARGE"] || BUDGET_VALUES.LARGE },
    { value: BUDGET_VALUES.BLOCKBUSTER, label: tr["BUDGET_BLOCKBUSTER"] || BUDGET_VALUES.BLOCKBUSTER }
  ];

  return (
    <div className="budget-radio w-full">
      {label && <p className="text-sm font-medium mb-2">{label}:</p>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
        {budgetOptions.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={`w-full px-4 py-2 rounded-lg font-medium border transition-all duration-200 focus:outline-none focus:ring focus:ring-offset-2 ${getBudgetColorClass(isSelected)}`}
              onClick={() => onChange(option.value)}
              aria-pressed={isSelected}
              aria-label={option.label}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetRadio;
