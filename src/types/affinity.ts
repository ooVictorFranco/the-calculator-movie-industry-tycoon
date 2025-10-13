// src/types/affinity.ts

/**
 * Affinity data structure interfaces
 */

export interface GenreRelations {
  header: string[];
  items: Record<string, number[]>;
}

export interface ThematicRelations {
  header: string[];
  items: Record<string, number[]>;
}

export interface RatingImpact {
  header: string[];
  items: Record<string, number[]>;
}

export interface SeasonalWindows {
  header: string[];
  items: Record<string, number[]>;
}

export interface ScriptConfig {
  scriptAffinityModMult: number;
  scriptAffinityModOffset: number;
}

export interface AffinityData {
  genreRelations: GenreRelations;
  thematicRelations: ThematicRelations;
  ratingImpact: RatingImpact;
  seasonalWindows: SeasonalWindows;
  scriptConfig: ScriptConfig;
}

/**
 * Component props interfaces
 */

export interface GenreScoreOption {
  genre: string;
  score: number;
  label: string;
}

export interface RatingOption {
  value: string;
  label: string;
}
