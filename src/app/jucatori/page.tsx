"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";

type Player = {
  f: string; // firstName
  l: string; // lastName
  c: string; // clubName
  ci: string; // clubId
  b: string; // birthDate
  s: string; // shirtNumber
  p: string; // position (primary)
  ps: string[]; // positions (all)
  co: string; // competition
};

const POSITIONS = [
  "Portar",
  "Fundaș central",
  "Fundaș dreapta",
  "Fundaș stânga",
  "Mijlocaș central",
  "Mijlocaș defensiv",
  "Mijlocaș dreapta",
  "Mijlocaș ofensiv",
  "Mijlocaș stânga",
  "Atacant central",
  "Extremă dreapta",
  "Extremă stânga",
];

export default function JucatoriPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [clubFilter, setClubFilter] = useState("");
  const [clubSearch, setClubSearch] = useState("");
  const [clubDropdownOpen, setClubDropdownOpen] = useState(false);
  const clubRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const PER_PAGE = 24;

  useEffect(() => {
    fetch("/data/players_list.json")
      .then((r) => r.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Extrage cluburi unice pentru dropdown
  const clubs = useMemo(() => {
    const set = new Set(players.map((p) => p.c));
    return [...set].sort();
  }, [players]);

  // Cluburi filtrate după textul de căutare
  const filteredClubs = useMemo(() => {
    if (!clubSearch) return clubs;
    const q = clubSearch.toLowerCase();
    return clubs.filter((c) => c.toLowerCase().includes(q));
  }, [clubs, clubSearch]);

  // Închide dropdown la click afară
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (clubRef.current && !clubRef.current.contains(e.target as Node)) {
        setClubDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Calculează vârsta
  const getAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const year = parseInt(birthDate.substring(0, 4));
    return 2026 - year;
  };

  // Filtrează
  const filtered = useMemo(() => {
    return players.filter((p) => {
      if (search) {
        const name = (p.f + " " + p.l).toLowerCase();
        if (!name.includes(search.toLowerCase())) return false;
      }
      if (positionFilter && !p.ps?.includes(positionFilter)) return false;
      if (clubFilter && p.c !== clubFilter) return false;
      if (ageFilter) {
        const age = getAge(p.b);
        if (ageFilter === "u13" && age > 13) return false;
        if (ageFilter === "u15" && (age > 15 || age < 14)) return false;
        if (ageFilter === "u17" && (age > 17 || age < 16)) return false;
        if (ageFilter === "u19" && (age > 19 || age < 18)) return false;
      }
      return true;
    });
  }, [players, search, positionFilter, clubFilter, ageFilter]);

  const paged = filtered.slice(0, page * PER_PAGE + PER_PAGE);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
            <span className="text-gradient">Jucători</span>
          </h1>
          <p className="text-muted font-light">
            {loading ? "Se încarcă..." : `${filtered.length} jucători · ${players.length} total`}
          </p>
        </div>

        {/* Filters */}
        <div className="card-navy p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Caută după nume..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="px-4 py-2.5 bg-navy border border-white/10 rounded-lg text-foreground text-sm focus:border-violet focus:outline-none"
            />
            <select
              value={positionFilter}
              onChange={(e) => { setPositionFilter(e.target.value); setPage(0); }}
              className="px-4 py-2.5 bg-navy border border-white/10 rounded-lg text-foreground text-sm focus:border-violet focus:outline-none"
            >
              <option value="">Toate pozițiile</option>
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={ageFilter}
              onChange={(e) => { setAgeFilter(e.target.value); setPage(0); }}
              className="px-4 py-2.5 bg-navy border border-white/10 rounded-lg text-foreground text-sm focus:border-violet focus:outline-none"
            >
              <option value="">Toate vârstele</option>
              <option value="u13">U13 (≤13 ani)</option>
              <option value="u15">U14–U15</option>
              <option value="u17">U16–U17</option>
              <option value="u19">U18–U19</option>
            </select>
            <div ref={clubRef} className="relative">
              <input
                type="text"
                placeholder={clubFilter || "Toate cluburile"}
                value={clubDropdownOpen ? clubSearch : (clubFilter || "")}
                onChange={(e) => { setClubSearch(e.target.value); setClubDropdownOpen(true); }}
                onFocus={() => { setClubDropdownOpen(true); setClubSearch(""); }}
                className="w-full px-4 py-2.5 bg-navy border border-white/10 rounded-lg text-foreground text-sm focus:border-violet focus:outline-none"
              />
              {clubFilter && !clubDropdownOpen && (
                <button
                  type="button"
                  onClick={() => { setClubFilter(""); setPage(0); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-lg leading-none"
                  aria-label="Curăță filtrul"
                >×</button>
              )}
              {clubDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-navy border border-white/10 rounded-lg shadow-xl">
                  <button
                    type="button"
                    onClick={() => { setClubFilter(""); setClubDropdownOpen(false); setClubSearch(""); setPage(0); }}
                    className="w-full text-left px-4 py-2 text-sm text-muted hover:bg-white/5"
                  >Toate cluburile</button>
                  {filteredClubs.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-muted">Niciun club găsit</div>
                  ) : (
                    filteredClubs.slice(0, 100).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => { setClubFilter(c); setClubDropdownOpen(false); setClubSearch(""); setPage(0); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 ${clubFilter === c ? "text-violet" : "text-foreground"}`}
                      >{c}</button>
                    ))
                  )}
                  {filteredClubs.length > 100 && (
                    <div className="px-4 py-2 text-xs text-muted border-t border-white/5">
                      {filteredClubs.length} cluburi — refinează căutarea
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Player grid */}
        {loading ? (
          <div className="text-center py-20 text-muted">Se încarcă datele...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted">Niciun jucător găsit.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paged.map((p, i) => {
                const age = getAge(p.b);
                return (
                  <Link
                    key={i}
                    href={`/jucator/${encodeURIComponent(((p.f || "").trim() + "-" + (p.l || "").trim()).replace(/\s+/g, " "))}`}
                    className="card-navy p-4 transition-all duration-300 hover:-translate-y-1 hover:border-violet/25 no-underline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-navy-light border border-white/10 flex items-center justify-center text-violet font-display font-bold text-lg flex-shrink-0">
                        {p.f.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">
                          {p.f} {p.l}
                        </div>
                        <div className="text-xs text-muted truncate">
                          {p.c}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-xs bg-violet/10 text-violet">
                        {p.ps?.[0] || p.p}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-green/10 text-green">
                        {age} ani
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-amber/10 text-amber">
                        #{p.s}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {paged.length < filtered.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-8 py-3 bg-navy-light border border-white/10 text-foreground text-sm font-semibold rounded-full hover:border-violet/30 transition-all"
                >
                  Încarcă mai multe ({filtered.length - paged.length} rămași)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
