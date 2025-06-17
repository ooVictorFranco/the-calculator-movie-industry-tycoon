//src/app/pages.tsx
"use client";

import { useLanguage } from "@/context/LanguageContext";
import AffinityCalculator from "@/components/Calculator/AffinityCalculator";
import Script from "next/script";

export default function Home() {
  const { translations: t } = useLanguage();

  return (
    <main className="flex flex-col items-center justify-center p-2 w-full overflow-x-hidden md:m-16">
      <h1 className="text-3xl font-bold mb-6 text-center">{t.title}</h1>
      <AffinityCalculator />
      <div className="mt-8 p-4 text-center text-sm text-gray-600 dark:text-gray-300 w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <p>{t.nextFeatureMessage}</p>
        <p className="font-semibold mt-2 text-blue-700 dark:text-blue-500 py-1 px-2 rounded border border-blue-300 bg-blue-100 dark:border-blue-300/10 dark:bg-blue-400/10 md:w-4/5 mx-auto">
          {t.nextFeature}
        </p>
      </div>
      <p className="text-xs mt-5 text-center">
        {t.messageUpdate1}{" "}
        <a
          href="https://store.steampowered.com/news/app/2315430/view/625550902077428132?l=english"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors"
          aria-label={`${t.gameVersion}, ${t.newTab}`}
        >
          {t.gameVersion} [1.3.0]
        </a>{" "}
        {t.messageUpdate2}
      </p>

      {/* Botão de Doação do PayPal */}


      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "The Calculator - Movie Industry Tycoon",
            "description":
              "Calculate movie affinities for The Executive: Movie Industry Tycoon",
            "url": "https://www.calcmovietycoon.com/",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web",
            "author": {
              "@type": "Person",
              "name": "Victor Franco",
            },
          }),
        }}
      />
    </main>
  );
}
