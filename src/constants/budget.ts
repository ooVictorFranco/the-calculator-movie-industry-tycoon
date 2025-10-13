// src/constants/budget.ts

/**
 * Budget values used across the application
 */
export const BUDGET_VALUES = {
  SMALL: "Small",
  MODERATE: "Moderate",
  LARGE: "Large",
  BLOCKBUSTER: "Blockbuster",
} as const;

/**
 * Budget multiplier factors for affinity calculations
 */
export const BUDGET_FACTORS: Record<string, number> = {
  [BUDGET_VALUES.SMALL]: 0.9,
  [BUDGET_VALUES.MODERATE]: 1.0,
  [BUDGET_VALUES.LARGE]: 1.1,
  [BUDGET_VALUES.BLOCKBUSTER]: 1.2,
};

/**
 * Budget option type for UI components
 */
export type BudgetOption = {
  value: string;
  label: string;
};

/**
 * Budget values type
 */
export type BudgetValue = (typeof BUDGET_VALUES)[keyof typeof BUDGET_VALUES];
