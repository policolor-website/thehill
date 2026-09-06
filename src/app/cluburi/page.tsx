"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

type Club = {
  id: string;
  n: string;
  a: string;
  la: number;
  lo: number;
  co: string;
  ci: string;
};

type Player = {
  ci: string;
  c: string;
};

export default function CluburiPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [countyFilter, setCountyFilter] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/data/clubs_slim.json").then((r) => r.json()),
      fetch("/data/players_list.json").then((r) => r.json()),
    ]).then(([c, p]) => {
      setClubs(c);
      setPlayers(p);
      setLoading(false);
    });
  }, []);

  // Număr jucători per club
  const playerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    players.forEach((p) => {
      counts[p.ci] = (counts[p.ci] || 0) + 1;
    });
    return counts;
  }, [players]);

  const counties = useMemo(() => {
    const set = new Set(clubs.map((c) => c.co).filter(Boolean));
    return [...set].sort();
  }, [clubs]);

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      if (search && !c.n.toLowerCase().includes(search.toLowerCase())) return false;
      if (countyFilter && c.co !== countyFilter) return false;
      return true;
    });
  }, [clubs, search, countyFilter]);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
            <span className="text-gradient">Cluburi</span>
          </h1>
          <p className="text-muted font-light">
            {loading ? "Se încarcă..." : `${filtered.length} cluburi cu loturi de juniori`}
          </p>
        </div>

        <div className="card-navy p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Caută după nume club..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2.5 bg-navy border border-white/10 rounded-lg text-foreground text-sm focus:border-violet focus:outline-none"
            />
            <select
              value={countyFilter}
              onChange={(e) => setCountyFilter(e.target.value)}
              className="px-4 py-2.5 bg-navy border border-white/10 rounded-lg text-foreground text-sm focus:border-violet focus:outline-none"
            >
              <option value="">Toate județele</option>
              {counties.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted">Se încarcă...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <div key={c.id} className="card-navy p-5 transition-all hover:border-violet/25">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {c.a || c.n}
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      {c.co}, {c.ci}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet/10 text-violet">
                    {playerCounts[c.id] || 0} jucători
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
