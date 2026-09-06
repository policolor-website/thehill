"use client";

import { useEffect, useState, useMemo } from "react";

type Match = {
  matchId: string;
  date: string;
  competitionName: string;
  homeClubName: string;
  awayClubName: string;
  homeGoals: number | null;
  awayGoals: number | null;
  stadiumName: string;
  stadiumTown: string;
};

export default function MeciuriPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [compFilter, setCompFilter] = useState("");

  useEffect(() => {
    fetch("/data/matches.json?v=2")
      .then((r) => r.json())
      .then((data) => {
        // Sortează descrescător după dată
        data.sort((a: Match, b: Match) => b.date.localeCompare(a.date));
        setMatches(data);
        setLoading(false);
      });
  }, []);

  const competitions = useMemo(() => {
    const set = new Set(matches.map((m) => m.competitionName));
    return [...set].sort();
  }, [matches]);

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (compFilter && m.competitionName !== compFilter) return false;
      return true;
    });
  }, [matches, compFilter]);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
            <span className="text-gradient">Meciuri</span>
          </h1>
          <p className="text-muted font-light">
            {loading ? "Se încarcă..." : `${filtered.length} meciuri de juniori`}
          </p>
        </div>

        <div className="card-navy p-5 mb-8">
          <select
            value={compFilter}
            onChange={(e) => setCompFilter(e.target.value)}
            className="px-4 py-2.5 bg-navy border border-white/10 rounded-lg text-foreground text-sm focus:border-violet focus:outline-none w-full md:w-auto"
          >
            <option value="">Toate competițiile</option>
            {competitions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted">Se încarcă...</div>
        ) : (
          <div className="space-y-3">
            {filtered.slice(0, 100).map((m) => (
              <div key={m.matchId} className="card-navy p-4 flex items-center gap-4">
                <div className="text-xs text-muted w-16 flex-shrink-0">
                  {new Date(m.date).toLocaleDateString("ro-RO", { day: "2-digit", month: "short" })}
                </div>
                <div className="text-xs text-violet w-32 flex-shrink-0 truncate">
                  {m.competitionName}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-foreground text-right flex-1 truncate">
                    {m.homeClubName}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-navy-light text-sm font-bold text-foreground mx-3">
                    {m.homeGoals !== null ? `${m.homeGoals} - ${m.awayGoals}` : "VS"}
                  </span>
                  <span className="text-sm text-foreground flex-1 truncate">
                    {m.awayClubName}
                  </span>
                </div>
              </div>
            ))}
            {filtered.length > 100 && (
              <p className="text-center text-muted text-sm py-4">
                Afișăm primele 100 din {filtered.length} meciuri
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
