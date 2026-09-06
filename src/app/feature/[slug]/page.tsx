"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";

type Section = {
  heading: string;
  body: string;
  icon?: string;
};

type Stat = {
  value: string;
  label: string;
};

type Feature = {
  title: string;
  subtitle: string;
  img: string;
  color: string;
  actionLabel: string;
  actionHref: string;
  intro: string;
  stats: Stat[];
  sections: Section[];
  highlights: string[];
};

const FEATURES: Record<string, Feature> = {
  "profil-complet-jucator": {
    title: "Profil complet jucător",
    subtitle: "Toate datele de bază pentru a evalua un junior",
    img: "/features/profil-complet.png",
    color: "text-violet",
    actionLabel: "Caută jucători",
    actionHref: "/jucatori",
    intro: "Fiecare jucător din baza noastră are un profil complet cu toate informațiile esențiale pentru scouting: identitate, vârstă, club, poziție, număr de tricou și competiția în care evoluează. Toate datele sunt extrase din înregistrările oficiale FRF.",
    stats: [
      { value: "24.983", label: "Profiluri juniori" },
      { value: "209", label: "Cluburi reprezentate" },
      { value: "17", label: "Competiții acoperite" },
    ],
    sections: [
      {
        heading: "Identitate și poză",
        body: "Fiecare profil afișează numele complet al jucătorului, poza oficială (acolo unde există în baza FRF) și numărul de tricou. Aceste informații te ajută să identifici rapid și corect jucătorul pe care îl urmărești, fără confuzii între jucători cu nume similare.",
      },
      {
        heading: "Vârstă și eligibilitate",
        body: "Data nașterii este afișată pentru fiecare jucător, împreună cu vârsta exactă calculată automat. Astfel poți verifica rapid dacă un jucător este eligibil pentru o anumită categorie de vârstă — U13, U14, U15, U16, U17, U19 sau Liga de Tineret.",
      },
      {
        heading: "Club și competiție",
        body: "Vezi la ce club este înregistrat jucătorul și în ce competiție evoluează în sezonul curent. Aceasta include atât competițiile naționale (Liga Elitelor, Campionatul Național), cât și competițiile județene sau interligi. Un jucător poate apărea în mai multe competiții dacă evoluează pentru mai multe loturi.",
      },
      {
        heading: "Poziții pe teren",
        body: "Profilul afișează toate pozițiile pe care jucătorul le-a ocupat în meciurile oficiale, nu doar o singură poziție generică. Dacă un junior a jucat fundaș central într-un meci și mijlocaș defensiv în altul, ambele poziții apar în profilul său.",
      },
    ],
    highlights: [
      "Poză oficială din baza FRF",
      "Vârstă calculată automat",
      "Număr tricou",
      "Club actual",
      "Competiție curentă",
      "Toate pozițiile jucate",
    ],
  },
  "meciuri-jucate": {
    title: "Meciuri jucate",
    subtitle: "Titular sau rezervă — vezi istoricul complet de meciuri",
    img: "/features/meciuri-jucate.png",
    color: "text-green",
    actionLabel: "Caută jucători",
    actionHref: "/jucatori",
    intro: "Pentru fiecare jucător, afișăm istoricul complet de meciuri oficiale: data, competiția, adversarul, scorul, rezultatul și dacă a fost titular sau rezervă. Datele provin din foile de meci oficiale FRF, colectate automat prin API-ul HaiLaFotbal.",
    stats: [
      { value: "192.838", label: "Meciuri înregistrate" },
      { value: "81%", label: "Meciuri cu scor" },
      { value: "16.186", label: "Scoruri colectate" },
    ],
    sections: [
      {
        heading: "Foaie de meci oficială",
        body: "Pentru fiecare meci în care jucătorul a fost înscris pe foaia de meci, afișăm: data exactă, competiția, clubul advers, scorul final și rezultatul (victorie, egal, înfrângere). Nu estimăm și nu interpolăm — doar afișăm ceea ce FRF a înregistrat oficial.",
      },
      {
        heading: "Titular sau rezervă",
        body: "Vezi dacă jucătorul a început meciul ca titular sau a intrat de pe bancă. Această informație este esențială pentru a evalua experiența reală de joc: un junior cu 20 de meciuri ca titular are mai multă experiență decât unul cu 20 de apariții de pe bancă.",
      },
      {
        heading: "Scoruri reale",
        body: "Am colectat 16.186 scoruri din API-ul FRF pentru sezonul 2025-2026, acoperind toate competițiile juvenile. 81% din meciurile din baza noastră au scor afișat. Scorurile provin din endpoint-ul GetFRFMatches, același folosit de site-ul public HaiLaFotbal.ro.",
      },
      {
        heading: "Istoric sezon",
        body: "Meciurile sunt afișate în ordine cronologică inversă, de la cel mai recent la cel mai vechi. Poți vedea un sezon întreg de meciuri pentru un jucător, cu scoruri, adversari și competiții. Astfel poți evalua constanța și progresul jucătorului de-a lungul sezonului.",
      },
    ],
    highlights: [
      "Data și competiția pentru fiecare meci",
      "Titular sau rezervă",
      "Scor final afișat",
      "Rezultat: victorie / egal / înfrângere",
      "Adversar și club",
      "Ordine cronologică",
    ],
  },
  "pozitii-reale": {
    title: "14 poziții reale",
    subtitle: "Poziția exactă din foaia de meci, nu doar 4 generice",
    img: "/features/pozitii-reale.png",
    color: "text-amber",
    actionLabel: "Caută jucători",
    actionHref: "/jucatori",
    intro: "Nu ne limităm la 4 poziții generice. Extragem poziția exactă din foaia de meci oficială FRF: fundaș dreapta, fundaș stânga, fundaș central, mijlocaș ofensiv, extremă dreapta, extremă stânga și multe altele. Astfel vezi exact pe ce poziție a jucat un junior în fiecare meci.",
    stats: [
      { value: "14+", label: "Poziții distincte" },
      { value: "100%", label: "Din foaia de meci" },
      { value: "0", label: "Poziții inventate" },
    ],
    sections: [
      {
        heading: "Poziții din foaia de meci",
        body: "Fiecare poziție afișată provine direct din foaia de meci oficială FRF. Nu atribuim poziții pe baza presupunerilor sau a numelui jucătorului. Dacă FRF a înregistrat că un jucător a evoluat ca fundaș stânga într-un meci, asta afișăm — nu o etichetă generică de „fundaș”.",
      },
      {
        heading: "Poziție per meci",
        body: "Un jucător poate evolua pe poziții diferite în meciuri diferite. Un junior poate fi fundaș central într-un meci și mijlocaș defensiv în altul, în funcție de necesitățile echipei. Noi afișăm poziția exactă pentru fiecare meci în parte, nu o medie sau o poziție „principală”.",
      },
      {
        heading: "Filtrare precisă",
        body: "Cauți un fundaș stânga specific? Sau un mijlocaș ofensiv de 14 ani? Filtrează jucătorii după poziția reală pe care au jucat-o în meciuri oficiale. Astfel găsești exact jucătorii care au experiență pe poziția care te interesează.",
      },
      {
        heading: "Multi-poziționalitate",
        body: "Profilul fiecărui jucător afișează toate pozițiile pe care le-a ocupat. Un jucător multi-pozițional — care poate evolua atât ca fundaș cât și ca mijlocaș — este mai valoros pentru scouting. Noi îți arătăm această versatilitate direct din datele oficiale.",
      },
    ],
    highlights: [
      "Portar",
      "Fundaș central / dreapta / stânga",
      "Mijlocaș central / defensiv / ofensiv",
      "Extremă dreapta / stânga",
      "Atacant central",
      "Poziție per meci, nu generică",
    ],
  },
  "cauta-dupa-criterii": {
    title: "Caută după criterii",
    subtitle: "Filtrează după vârstă, poziție, județ, club și competiție",
    img: "/features/cauta-criterii.png",
    color: "text-pink",
    actionLabel: "Caută jucători",
    actionHref: "/jucatori",
    intro: "Pagina de jucători oferă filtrare avansată: caută după nume, filtrează după club (combobox searchabil cu 209 cluburi), poziție, vârstă și competiție. Combinați filtrele pentru a găsi exact jucătorul pe care îl cauți.",
    stats: [
      { value: "5", label: "Filtre disponibile" },
      { value: "209", label: "Cluburi searchabile" },
      { value: "14+", label: "Poziții filtrabile" },
    ],
    sections: [
      {
        heading: "Căutare după nume",
        body: "Caută un jucător după nume sau prenume. Căutarea funcționează cu diacritice și fără — poți scrie „Mihai” sau „Mihăiță” și vei găsi jucătorii corecți. Căutarea este instantanee, pe măsură ce tastezi.",
      },
      {
        heading: "Filtru club searchabil",
        body: "Cu 209 cluburi în bază, o listă dropdown simplă ar fi imposibil de folosit. De aceea am implementat un combobox searchabil: tastezi numele clubului și primești sugestii. Selectezi clubul și lista de jucători se filtrează instant.",
      },
      {
        heading: "Filtru după poziție",
        body: "Filtrează jucătorii după poziția pe care o joacă: portar, fundaș, mijlocaș, atacant — sau poziții mai specifice extrase din foile de meci. Combinați cu alte filtre pentru rezultate precise.",
      },
      {
        heading: "Filtru după vârstă",
        body: "Selectează o categorie de vârstă pentru a vedea doar jucătorii eligibili: U13, U14, U15, U16, U17, U19 sau Tineret. Util pentru scouting pe categorii specifice — de exemplu, toți jucătorii de 14 ani dintr-un anumit club.",
      },
    ],
    highlights: [
      "Căutare instantă după nume",
      "Combobox club searchabil (209 cluburi)",
      "Filtru după poziție",
      "Filtru după vârstă",
      "Combinație de filtre",
      "Rezultate instantanee",
    ],
  },
  "cluburi-cu-loturi": {
    title: "209 cluburi cu loturi",
    subtitle: "Toate cluburile și academiile cu juniori înscrise la FRF",
    img: "/features/cluburi-loturi.png",
    color: "text-violet",
    actionLabel: "Vezi cluburi",
    actionHref: "/cluburi",
    intro: "Afișăm doar cluburile care au loturi de juniori înscrise oficial la FRF. Fiecare club din lista noastră are cel puțin un jucător junior în baza de date. Vezi județul, orașul și jucătorii de la fiecare club.",
    stats: [
      { value: "209", label: "Cluburi cu juniori" },
      { value: "42", label: "Județe reprezentate" },
      { value: "4", label: "Loturi naționale" },
    ],
    sections: [
      {
        heading: "Doar cluburi cu juniori",
        body: "Nu afișăm toate cluburile din România — doar cele care au loturi de juniori înscrise la FRF și care au cel puțin un jucător în baza noastră de date. Astfel eviți cluburile goale sau fără activitate juvenilă.",
      },
      {
        heading: "Localizare geografică",
        body: "Pentru fiecare club afișăm județul și orașul. Aceasta este util pentru scouting regional — găsește toate cluburile cu juniori dintr-un anumit județ, sau explorează cluburi din zone pe care nu le cunoști.",
      },
      {
        heading: "Loturi naționale",
        body: "Pe lângă cluburi, afișăm și loturile echipelor naționale ale României pentru categoriile de juniori: U15, U16, U17 și U18. Fiecare lot are jucătorii convocați, organizați pe poziții (portari, fundași, mijlocași, atacanți), cu clubul și țara în care evoluează.",
      },
      {
        heading: "Link către jucători",
        body: "Din pagina cluburilor poți accesa direct lista de jucători de la un anumit club. Iar din loturile naționale, jucătorii care există în baza noastră FRF au link direct către profilul complet cu meciuri și statistici.",
      },
    ],
    highlights: [
      "209 cluburi cu loturi juvenile",
      "Județ și oraș pentru fiecare club",
      "Loturi naționale U15-U18",
      "84 jucători naționali",
      "Link direct către jucători",
      "Doar cluburi active cu juniori",
    ],
  },
  "date-oficiale-frf": {
    title: "Date oficiale FRF",
    subtitle: "Toate datele provin din API-ul oficial FRF/HaiLaFotbal",
    img: "/features/date-frf.png",
    color: "text-green",
    actionLabel: "Despre platformă",
    actionHref: "/despre",
    intro: "Toate datele de pe theHILL.ro provin din API-ul oficial FRF (Federația Română de Fotbal) și HaiLaFotbal.ro. Nu inventăm, nu estimăm și nu interpretăm — afișăm exact ceea ce FRF are înregistrat oficial.",
    stats: [
      { value: "100%", label: "Date oficiale FRF" },
      { value: "0", label: "Date inventate" },
      { value: "16.186", label: "Scoruri colectate" },
    ],
    sections: [
      {
        heading: "Sursă oficială",
        body: "Folosim API-ul public FRF/HaiLaFotbal — același API care alimentează site-ul hailafotbal.ro. Toate datele despre jucători, meciuri, scoruri, cluburi și competiții provin din această sursă oficială. Nu cumpărăm date de la terți și nu le colectăm de pe site-uri neoficiale.",
      },
      {
        heading: "Proces de colectare",
        body: "Datele se actualizează periodic prin scraping-ul automat al API-ului FRF. Meciurile și scorurile sunt extrase folosind endpoint-ul GetFRFMatches, care returnează rezultatele oficiale pentru fiecare tur și etapă din sezon. Foile de meci sunt extrase cu GetMatchSheets.",
      },
      {
        heading: "Transparență totală",
        body: "Nu modificăm datele. Dacă un jucător nu apare în baza noastră, înseamnă că nu este înscris oficial la FRF. Dacă un meci nu are scor, înseamnă că FRF nu a înregistrat scorul încă. Afișăm exact ceea ce există — nimic mai mult, nimic mai puțin.",
      },
      {
        heading: "Actualizări sezoniere",
        body: "Datele se actualizează de-a lungul sezonului. Pe măsură ce FRF adaugă meciuri noi, scoruri și foile de meci în baza lor, noi le colectăm automat. Astfel, profilurile jucătorilor devin tot mai complete pe parcursul sezonului.",
      },
    ],
    highlights: [
      "API oficial FRF / HaiLaFotbal",
      "GetFRFMatches pentru scoruri",
      "GetMatchSheets pentru foaie de meci",
      "Fără date inventate",
      "Transparență totală",
      "Actualizare automată",
    ],
  },
};

export default function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const feature = FEATURES[slug];
  if (!feature) notFound();

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back link */}
        <Link href="/" className="text-muted text-sm hover:text-violet no-underline inline-flex items-center gap-1 mb-8">
          <span>←</span> Înapoi
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-5 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={feature.img}
              alt={feature.title}
              className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
            />
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
                {feature.title}
              </h1>
              <p className={`text-sm font-medium ${feature.color}`}>
                {feature.subtitle}
              </p>
            </div>
          </div>

          {/* Intro */}
          <p className="text-white leading-relaxed text-base font-light">
            {feature.intro}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-row gap-4 mb-10"
        >
          {feature.stats.map((s, i) => (
            <div key={i} className="card-navy p-5 text-center flex-1">
              <div className={`text-2xl md:text-3xl font-display font-bold ${feature.color}`}>
                {s.value}
              </div>
              <div className="text-xs text-muted uppercase tracking-wider mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card-navy-glow p-6 mb-10"
        >
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">
            Ce incluzi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {feature.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`text-sm ${feature.color}`}>✓</span>
                <span className="text-sm text-foreground">{h}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {feature.sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="card-navy p-7"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className={`text-sm ${feature.color}`}>●</span>
                {s.heading}
              </h2>
              <p className="text-muted leading-relaxed font-light">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 text-center"
        >
          <Link
            href={feature.actionHref}
            className="inline-block px-10 py-4 bg-violet text-white text-sm font-bold uppercase tracking-wider no-underline transition-all hover:bg-violet-dark rounded-full"
          >
            {feature.actionLabel}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
