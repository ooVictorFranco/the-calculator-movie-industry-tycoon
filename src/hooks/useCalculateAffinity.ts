// src/hooks/useCalculateAffinity.ts

import { useEffect, useState, useCallback } from "react";
import {
  getAffinityLabel,
  calculateGenreScores,
  getThemeScores,
  GenreScore,
  SeasonResult
} from "@/utils/affinityCalculations";
import affinities from "@/data";
import { BUDGET_FACTORS } from "@/constants/budget";

/**
 * Interface para definir as propriedades do hook useCalculateAffinity.
 */
interface UseCalculateAffinityProps {
  genre1: string;
  genre2: string;
  theme: string;
  rating: string;
  budget: string; // Novo parâmetro obrigatório
  genres: string[];
  translations: Record<string, string>;
  locale: string;
  formStartTime: number;
  filledFields: Set<string>;
  safeGtag: (event: string, params: Record<string, any>) => void;
}

/**
 * Interface para os dados retornados pelo hook.
 */
interface AffinityResultData {
  result: number | null;
  seasonResults: SeasonResult[];
  loading: boolean;
}

/**
 * Hook para calcular a afinidade do filme com base nos gêneros, tema, classificação etária e orçamento.
 */
export const useCalculateAffinity = ({
  genre1,
  genre2,
  theme,
  rating,
  budget,
  genres,
  translations,
  locale,
  formStartTime,
  filledFields,
  safeGtag
}: UseCalculateAffinityProps): AffinityResultData => {
  const [result, setResult] = useState<number | null>(null);
  const [seasonResults, setSeasonResults] = useState<SeasonResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Função auxiliar para obter o rótulo da afinidade com base no score
  const getLabel = useCallback((score: number) => getAffinityLabel(score, translations), [translations]);

  /**
   * Função principal que calcula a afinidade do filme.
   */
  const calculate = useCallback((): number | undefined => {
    if (genre1 && theme && rating && budget) {
      setLoading(true);

      // Índices dos gêneros na matriz de afinidade
      const genre1Index = genres.indexOf(genre1);
      const genre2Index = genre2 ? genres.indexOf(genre2) : -1;

      // Pontuações baseadas no tema
      const themeScoreGenre1 = affinities.thematicRelations.items[theme]?.[genre1Index] || 0;
      const themeScoreGenre2 =
        genre2Index >= 0 ? affinities.thematicRelations.items[theme]?.[genre2Index] || 0 : 0;

      // Pontuações baseadas na classificação etária
      const ratingScoreGenre1 = affinities.ratingImpact.items[rating]?.[genre1Index] || 0;
      const ratingScoreGenre2 =
        genre2Index >= 0 ? affinities.ratingImpact.items[rating]?.[genre2Index] || 0 : 0;

      // Pontuação de afinidade entre os dois gêneros
      const genreScore =
        genre2Index >= 0 ? (affinities.genreRelations.items[genre1]?.[genre2Index] || 0) : 0;

      // Cálculo da pontuação base
      const baseScore =
        themeScoreGenre1 +
        themeScoreGenre2 +
        ratingScoreGenre1 +
        ratingScoreGenre2 +
        genreScore;

      // Fatores de ajuste com base no orçamento
      const budgetFactor = BUDGET_FACTORS[budget] || 1.0;

      // Aplicação do fator de orçamento à pontuação base
      const finalBaseScore =
        (baseScore * affinities.scriptConfig.scriptAffinityModMult +
          affinities.scriptConfig.scriptAffinityModOffset) * budgetFactor;

      // Obtém as pontuações dos temas
      const themeScores = getThemeScores(theme, affinities, genres, getLabel);
      let combinedScores: GenreScore[] = [];
      if (genre2) {
        combinedScores = calculateGenreScores(genre1, themeScores, affinities, genres, getLabel);
      }

      // Cálculo das afinidades sazonais
      const seasonalData = Object.entries(affinities.seasonalWindows.items).map(
        ([season, values]) => {
          const seasonMultiplierGenre1 = values[genre1Index] || 0;
          const seasonMultiplierGenre2 =
            genre2Index >= 0 ? values[genre2Index] || 0 : 0;
          const combinedMultiplier =
            (seasonMultiplierGenre1 + seasonMultiplierGenre2) / (genre2 ? 2 : 1);
          const adjustedScore = Number((finalBaseScore * combinedMultiplier).toFixed(2));
          const label = getLabel(combinedMultiplier);
          return { season, score: adjustedScore, label };
        }
      );

      // Ordena as estações por pontuação (da maior para a menor)
      seasonalData.sort((a, b) => b.score - a.score);

      // Utiliza setTimeout para evitar bloqueios e atualizar o estado de forma assíncrona
      const timerId = window.setTimeout(() => {
        setResult(finalBaseScore);
        setSeasonResults(seasonalData);
        setLoading(false);

        // Envia evento para o Google Analytics quando o cálculo é concluído
        safeGtag("form_completion", {
          form_name: "affinity_calculator",
          genre1,
          genre2: genre2 || "none",
          theme,
          rating,
          budget,
          score: finalBaseScore.toFixed(2),
          completion_time: Date.now() - formStartTime,
          filled_fields: Array.from(filledFields).join(",")
        });
      }, 300);

      return timerId;
    } else {
      // Se algum campo obrigatório não estiver preenchido, limpa os resultados
      setResult(null);
      setSeasonResults([]);
      return undefined;
    }
  }, [
    genre1,
    genre2,
    theme,
    rating,
    budget,
    genres,
    formStartTime,
    filledFields,
    safeGtag,
    getLabel
  ]);

  // Executa o cálculo sempre que os parâmetros mudarem
  useEffect(() => {
    const timerId = calculate();
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [calculate]);

  return { result, seasonResults, loading };
};
