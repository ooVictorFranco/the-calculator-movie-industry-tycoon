// src/utils/affinityCalculations.ts

import { AffinityData } from "@/types/affinity";

/**
 * Interface que representa o score e rótulo de afinidade para um determinado gênero.
 */
export interface GenreScore {
  genre: string;
  score: number;
  label: string;
}

/**
 * Interface que representa o resultado de afinidade para uma temporada.
 */
export interface SeasonResult {
  season: string;
  score: number;
  label: string;
}

/**
 * Retorna o rótulo de afinidade (por exemplo, "Ruim", "Neutro", "Bom", "Excelente")
 * com base no valor do score e nas traduções fornecidas.
 *
 * @param score - Valor do score a ser avaliado.
 * @param translations - Objeto contendo as traduções (ex.: { bad, medium, good, great, noResult }).
 * @returns O rótulo correspondente ao score.
 */
export const getAffinityLabel = (
  score: number,
  translations: Record<string, string>
): string => {
  if (score < 0.5) return translations.bad;
  if (score < 1.5) return translations.medium;
  if (score < 2.5) return translations.good;
  return translations.great;
};

/**
 * Combina os scores de afinidade entre gêneros com os scores derivados de um tema.
 * Se um tema estiver definido, realiza a média entre o score obtido a partir do tema
 * e o score obtido a partir da relação de gêneros para o gênero base.
 *
 * @param sourceGenre - Gênero principal (ex.: "action"). Se null, retorna os themeScores.
 * @param themeScores - Lista de scores derivados do tema (obtidos via getThemeScores) ou null.
 * @param affinities - Objeto que contém as relações entre gêneros (genreRelations).
 * @param genres - Lista de gêneros (header) para mapeamento de índices.
 * @param getAffinityLabelFn - Função para converter um score em um rótulo de afinidade.
 * @returns Lista combinada de GenreScore.
 */
export const calculateGenreScores = (
  sourceGenre: string | null,
  themeScores: GenreScore[] | null,
  affinities: AffinityData,
  genres: string[],
  getAffinityLabelFn: (score: number) => string
): GenreScore[] => {
  if (!sourceGenre) return themeScores || [];

  // Calcula os scores baseados na relação de gêneros para o sourceGenre
  const genreScores = affinities.genreRelations.header.map((genre: string) => {
    const idx = genres.indexOf(genre);
    const rawScore = affinities.genreRelations.items[sourceGenre]?.[idx] || 0;
    return {
      genre,
      score: rawScore,
      label: getAffinityLabelFn(rawScore)
    };
  });

  // Se não houver themeScores, retorna os scores calculados apenas pela relação de gêneros.
  if (!themeScores) return genreScores;

  // Se houver themeScores, combina (faz média simples) os scores obtidos via tema e os obtidos via relação de gêneros.
  return themeScores.map((themeScore) => {
    const idx = genres.indexOf(themeScore.genre);
    const combinedScore = (themeScore.score + genreScores[idx].score) / 2;
    return {
      genre: themeScore.genre,
      score: combinedScore,
      label: getAffinityLabelFn(combinedScore)
    };
  });
};

/**
 * Retorna uma lista de GenreScore para um determinado tema.
 * Para cada gênero definido no header de thematicRelations, extrai o score correspondente
 * e gera o rótulo de afinidade utilizando a função fornecida.
 *
 * @param theme - Tema selecionado (ex.: "alien", "timeTravel", etc.).
 * @param affinities - Objeto que contém as relações temáticas (thematicRelations).
 * @param genres - Lista de gêneros (header) para mapeamento.
 * @param getAffinityLabelFn - Função que converte um score em um rótulo de afinidade.
 * @returns Lista de GenreScore para o tema.
 */
export const getThemeScores = (
  theme: string,
  affinities: AffinityData,
  genres: string[],
  getAffinityLabelFn: (score: number) => string
): GenreScore[] => {
  return affinities.thematicRelations.header.map((genre: string) => {
    const idx = genres.indexOf(genre);
    const rawScore = affinities.thematicRelations.items[theme]?.[idx] || 0;
    return {
      genre,
      score: rawScore,
      label: getAffinityLabelFn(rawScore)
    };
  });
};
