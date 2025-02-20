"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import SelectInput from "@/components/SelectInput";
import AffinityResult from "@/components/AffinityResult";
import AgeRatingRadio from "@/components/AgeRatingRadio";
import GenresInput from "@/components/GenresInput";
import ClearButton from "@/components/ClearButton";
import useFormTracking from '@/hooks/useFormTracking';
import { useGtag } from "@/hooks/useGtag";
import { useCalculateAffinity } from "@/hooks/useCalculateAffinity";
import affinities from "@/data";

const AffinityCalculator: React.FC = () => {
  const { translations: t, locale } = useLanguage();
  const { safeGtag } = useGtag();

  const [genres, setGenres] = useState<string[]>(affinities.genreRelations.header);
  const [genre1, setGenre1] = useState("");
  const [genre2, setGenre2] = useState("");
  const [theme, setTheme] = useState("");
  const [rating, setRating] = useState("");
  const [formStartTime, setFormStartTime] = useState(0);
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());

  // Exemplo: lógica para gerar as opções dos inputs pode ser calculada aqui
  // ou encapsulada em um hook, mas o resultado visual fica na renderização.
  const ratingsOptions = Object.keys(affinities.ratingImpact.items).map(ratingKey => ({
    value: ratingKey,
    label: t[`RATING_${ratingKey.toUpperCase()}`] || ratingKey
  }));

  useFormTracking({ filledFields, formName: 'affinity_calculator', delay: 15000 });

  const { result, seasonResults, loading } = useCalculateAffinity({
    genre1,
    genre2,
    theme,
    rating,
    genres,
    translations: t,
    locale,
    formStartTime,
    filledFields,
    safeGtag
  });

  const handleClearAll = () => {
    setGenre1("");
    setGenre2("");
    setTheme("");
    setRating("");
    setFilledFields(new Set());
    setFormStartTime(0);
    safeGtag("form_reset", {
      form_name: "affinity_calculator",
      filled_fields_before_reset: Array.from(filledFields).join(',')
    });
  };

  return (
    <div className="affinity-form-container flex flex-col gap-6 w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
      <h2 className="text-l font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
        {t.subtitle}
      </h2>

      <div className="flex flex-col gap-4">
        <SelectInput
          name="theme"
          label={t.theme}
          options={/* Opções calculadas para o tema, se aplicável */}
          value={theme}
          onChange={(value) => {
            setTheme(value);
            // Registro de tracking, se necessário
          }}
          required
        />

        <div className="grid md:grid-cols-2 gap-4">
          <GenresInput
            name="genre1"
            label={t.genre1}
            options={/* Opções calculadas para gênero 1 */}
            value={genre1}
            onChange={(value) => {
              setGenre1(value);
              // Registro de tracking, se necessário
            }}
          />

          <GenresInput
            name="genre2"
            label={t.genre2}
            options={/* Opções calculadas para gênero 2 */}
            value={genre2}
            onChange={(value) => {
              setGenre2(value);
              // Registro de tracking, se necessário
            }}
            isOptional
          />
        </div>

        <AgeRatingRadio
          label={t.rating}
          options={ratingsOptions}
          selectedValue={rating}
          onChange={(value) => setRating(value)}
        />

        {result !== null && (
          <div className="result-actions pt-4">
            <ClearButton
              onClear={handleClearAll}
              label={t.clearAll}
              testId="clear-all-button"
            />
            <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
          </div>
        )}

        <AffinityResult
          result={result}
          loading={loading}
          genre1={genre1}
          genre2={genre2}
          theme={theme}
          rating={rating}
          seasonResults={seasonResults}
        />
      </div>
    </div>
  );
};

export default AffinityCalculator;