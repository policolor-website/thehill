"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  { value: "24.983", label: "Profiluri juniori", color: "text-violet" },
  { value: "209", label: "Cluburi cu loturi", color: "text-green" },
  { value: "1.693", label: "Meciuri juniori", color: "text-amber" },
  { value: "17.230", label: "Jucători în meciuri", color: "text-pink" },
];

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Title + text */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex gap-3 justify-center lg:justify-start mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-violet/20 bg-navy-light/60 text-violet backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-green animate-ping" />
                Date din FRF
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-green/20 bg-navy-light/60 text-green backdrop-blur-sm">
                Platformă România
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-bold leading-[0.98] mb-6 text-foreground"
            >
              <span className="block text-4xl md:text-6xl">
                Scouting fotbal
              </span>
              <span className="block text-5xl md:text-7xl text-gradient">
                juniori România
              </span>
              <span className="block text-2xl md:text-3xl text-muted mt-3 font-medium">
                theHILL.ro
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-muted max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed font-light"
            >
              Caută jucători juniori din toate cluburile și academiile de fotbal
              din România. Filtrează după <strong className="text-foreground font-medium">vârstă</strong>,{" "}
              <strong className="text-foreground font-medium">poziție</strong>,{" "}
              <strong className="text-foreground font-medium">județ</strong> și{" "}
              <strong className="text-foreground font-medium">club</strong>. Vezi
              meciurile jucate, titular sau rezervă, și poziția reală pe teren.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/jucatori"
                className="px-8 py-4 bg-violet text-white text-sm font-bold uppercase tracking-wider no-underline transition-all hover:bg-violet-dark rounded-full"
              >
                Caută jucători
              </Link>
              <Link
                href="/cluburi"
                className="px-8 py-4 border border-green/30 text-green text-sm font-bold uppercase tracking-wider no-underline transition-all hover:bg-green/10 rounded-full"
              >
                Vezi cluburile
              </Link>
            </motion.div>
          </div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="card-navy-glow p-6 text-center"
              >
                <div className={`text-3xl md:text-4xl font-display font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted uppercase tracking-wider mt-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
