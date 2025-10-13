// src/components/Calculator/AffinityCalculator.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import SelectInput from "@/components/Inputs/SelectInput";
import AffinityResult from "./AffinityResult";
import AgeRatingRadio from "@/components/Inputs/AgeRatingRadio";
import GenresInput from "@/components/Inputs/GenresInput";
import ClearButton from "@/components/Buttons/ClearButton";
import BudgetRadio from "@/components/Inputs/BudgetRadio";
import useFormTracking from "@/hooks/useFormTracking";
import { useGtag } from "@/hooks/useGtag";
import { useCalculateAffinity } from "@/hooks/useCalculateAffinity";
import { useCalculateProduction } from "@/hooks/useCalculateProduction";
import { useCalculateExtraResources } from "@/hooks/useCalculateExtraResources";
import affinities from "@/data";
import { getThemeScores, getAffinityLabel, calculateGenreScores } from "@/utils/affinityCalculations";
import { toTranslationRecord, getTranslation } from "@/utils/translationHelpers";

const AffinityCalculator: React.FC = () => {
  const { translations: t, locale } = useLanguage();
  const { safeGtag } = useGtag();
  const tr = toTranslationRecord(t);

  // 🔹 Função auxiliar para obter traduções de forma segura
  const getTr = (key: string): string => getTranslation(t, key, key);

  const [genres] = useState<string[]>(affinities.genreRelations.header);
  const [genre1, setGenre1] = useState("");
  const [genre2, setGenre2] = useState("");
  const [theme, setTheme] = useState("");
  const [rating, setRating] = useState("");
  const [budget, setBudget] = useState("");
  const [formStartTime, setFormStartTime] = useState(0);
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());

  // 🔹 Opções de classificação etária com tradução acessível
  const ratingsOptions = Object.keys(affinities.ratingImpact.items).map((ratingKey) => ({
    value: ratingKey,
    label: getTr(`RATING_${ratingKey.replace("-", "_").toUpperCase()}`) || ratingKey,
  }));

  const [genresOptions1, setGenresOptions1] = useState<{ genre: string; score: number; label: string }[]>([]);
  const [genresOptions2, setGenresOptions2] = useState<{ genre: string; score: number; label: string }[]>([]);

  useFormTracking({ filledFields, formName: "affinity_calculator", delay: 15000 });

  const { result, seasonResults, loading } = useCalculateAffinity({
    genre1,
    genre2,
    theme,
    rating,
    budget,
    genres,
    translations: t as unknown as Record<string, string>,
    locale,
    formStartTime,
    filledFields,
    safeGtag,
  });

  const { production, postProduction } = useCalculateProduction(genre1, genre2);
  const extraResources = useCalculateExtraResources(production, postProduction, budget, theme);

  useEffect(() => {
    if (theme) {
      const themeScores = getThemeScores(
        theme,
        affinities,
        genres,
        (score: number) => getAffinityLabel(score, t as unknown as Record<string, string>)
      );

      if (!genre2) {
        setGenresOptions1([...themeScores].sort((a, b) => b.score - a.score));
      } else {
        setGenresOptions1(
          themeScores.filter((item) => item.genre !== genre2).sort((a, b) => b.score - a.score)
        );
      }

      if (genre1) {
        const combinedScores = calculateGenreScores(
          genre1,
          themeScores,
          affinities,
          genres,
          (score: number) => getAffinityLabel(score, t as unknown as Record<string, string>)
        );
        setGenresOptions2(
          combinedScores.filter((item) => item.genre !== genre1).sort((a, b) => b.score - a.score)
        );
      } else {
        setGenresOptions2([...themeScores].sort((a, b) => b.score - a.score));
      }
    } else {
      setGenresOptions1(affinities.genreRelations.header.map((genre) => ({ genre, score: 0, label: "" })));
      setGenresOptions2(affinities.genreRelations.header.map((genre) => ({ genre, score: 0, label: "" })));
    }
  }, [theme, genre1, genre2, genres, t]);

  // 🔹 Limpa todos os campos e reinicia o formulário
  const handleClearAll = () => {
    setGenre1("");
    setGenre2("");
    setTheme("");
    setRating("");
    setBudget("");
    setFilledFields(new Set());
    setFormStartTime(0);
    safeGtag("form_reset", {
      form_name: "affinity_calculator",
      filled_fields_before_reset: Array.from(filledFields).join(","),
    });
  };

  return (
    <div className="affinity-form-container flex flex-col gap-6 w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
      <h2 className="text-l font-bold text-center text-gray-800 dark:text-gray-100">{tr.subtitle}</h2>

      <div className="flex flex-col gap-4">
        {/* Seletor de orçamento */}
        <BudgetRadio label={tr.budget || "Orçamento"} selectedValue={budget} onChange={(value) => setBudget(value)} />

        <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>

        {/* Seletor de tema acessível */}
        <SelectInput
          name="theme"
          label={tr.theme}
          options={Object.keys(affinities.thematicRelations.items).sort((a, b) => {
            const getThemeLabel = (key: string): string =>
              (getTr(`THEME_${key.toLowerCase()}`) || key).toLowerCase();
            return getThemeLabel(a).localeCompare(getThemeLabel(b));
          })}
          value={theme}
          onChange={(value) => setTheme(value)}
          required
        />

        {/* Seletor de gêneros */}
        <div className="grid md:grid-cols-2 gap-4">
          <GenresInput name="genre1" label={tr.genre1} options={genresOptions1} value={genre1} onChange={(value) => setGenre1(value)} />
          <GenresInput name="genre2" label={tr.genre2} options={genresOptions2} value={genre2} onChange={(value) => setGenre2(value)} isOptional />
        </div>

        <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>

        {/* Seletor de classificação etária */}
        <AgeRatingRadio label={tr.rating} options={ratingsOptions} selectedValue={rating} onChange={(value) => setRating(value)} />

        {/* Botão de limpeza */}
        {result !== null && (
          <div className="result-actions pt-4">
            <ClearButton onClear={handleClearAll} label={tr.clearAll} testId="clear-all-button" />
            <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
          </div>
        )}

        {/* Exibição dos resultados */}
        <AffinityResult
          result={result}
          loading={loading}
          genre1={genre1}
          genre2={genre2}
          theme={theme}
          rating={rating}
          seasonResults={seasonResults}
          production={production}
          postProduction={postProduction}
          extraResources={extraResources}
        />
      </div>
    </div>
  );
};

export default AffinityCalculator;
