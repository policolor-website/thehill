"use client";

import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import SearchWidget from "@/components/SearchWidget";
import Link from "next/link";

const features = [
  {
    num: "01",
    title: "Profil complet jucător",
    desc: "Poză, vârstă, poziție, tricou, club, competiție. Toate datele de bază pentru a evalua un junior.",
    color: "text-violet",
    img: "/features/profil-complet.png",
    slug: "profil-complet-jucator",
  },
  {
    num: "02",
    title: "Meciuri jucate",
    desc: "Vezi în câte meciuri a fost jucătorul — titular sau rezervă — și în ce poziție a jucat pe teren.",
    color: "text-green",
    img: "/features/meciuri-jucate.png",
    slug: "meciuri-jucate",
  },
  {
    num: "03",
    title: "14 poziții reale",
    desc: "Nu doar 4 poziții generice. Din foile de meci: fundaș dreapta, extremă stânga, mijlocaș ofensiv și mai multe.",
    color: "text-amber",
    img: "/features/pozitii-reale.png",
    slug: "pozitii-reale",
  },
  {
    num: "04",
    title: "Caută după criterii",
    desc: "Filtrează după vârstă, județ, club, competiție sau poziție. Găsește exact jucătorul pe care îl cauți.",
    color: "text-pink",
    img: "/features/cauta-criterii.png",
    slug: "cauta-dupa-criterii",
  },
  {
    num: "05",
    title: "209 cluburi cu loturi",
    desc: "Toate cluburile și academiile din România care au loturi de juniori înscrise la FRF.",
    color: "text-violet",
    img: "/features/cluburi-loturi.png",
    slug: "cluburi-cu-loturi",
  },
  {
    num: "06",
    title: "Date oficiale FRF",
    desc: "Toate datele provin din API-ul oficial FRF/HaiLaFotbal. Nu inventăm — doar afișăm ce există.",
    color: "text-green",
    img: "/features/date-frf.png",
    slug: "date-oficiale-frf",
  },
];

const competitions = [
  "Liga Elitelor U13",
  "Liga Elitelor U14",
  "Liga Elitelor U15",
  "Liga Elitelor U16",
  "Liga Elitelor U17",
  "Campionatul Național U15",
  "Campionatul Național U16",
  "Campionatul Național U17",
  "Campionatul Național U19",
  "Liga de Tineret",
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Search widget */}
      <SearchWidget />

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-violet text-xs font-semibold uppercase tracking-[0.25em]">
              Platformă scouting
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 mb-4">
              Tot ce ai nevoie pentru{" "}
              <span className="text-gradient">scouting juniori</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto text-base font-light">
              Date complete despre jucătorii juniori din România — direct din
              înregistrările oficiale FRF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="card-navy p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-violet/25"
              >
                <div className="flex items-center gap-4 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {f.title}
                  </h3>
                </div>
                <p className="text-sm text-muted leading-relaxed font-light mb-4">
                  {f.desc}
                </p>
                <Link
                  href={`/feature/${f.slug}`}
                  className="text-sm font-semibold text-white hover:text-violet no-underline inline-flex items-center gap-1 transition-colors"
                >
                  Vezi detalii
                  <span>→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-green text-xs font-semibold uppercase tracking-[0.25em]">
              Competiții acoperite
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-4">
              <span className="text-gradient">17 competiții</span> de juniori
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {competitions.map((c, i) => (
              <motion.span
                key={c}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="px-5 py-2.5 rounded-full text-sm font-medium border border-white/8 bg-navy-light text-foreground"
              >
                {c}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="card-navy-glow p-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Începe căutarea{" "}
              <span className="text-gradient">acum</span>
            </h2>
            <p className="text-muted mb-8 font-light max-w-xl mx-auto">
              24.983 profiluri complete de jucători juniori din România. Caută
              după vârstă, poziție, județ sau club.
            </p>
            <Link
              href="/jucatori"
              className="inline-block px-10 py-4 bg-violet text-white text-sm font-bold uppercase tracking-wider no-underline transition-all hover:bg-violet-dark rounded-full"
            >
              Caută jucători
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
