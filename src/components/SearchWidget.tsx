"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import CustomSelect from "./CustomSelect";

type Player = {
  f: string;
  l: string;
  c: string;
  b: string;
  s: string;
  p: string;
  ps: string[];
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

const AGE_OPTIONS = [
  { value: "", label: "Toate vârstele" },
  { value: "u13", label: "U13 (≤13 ani)" },
  { value: "u15", label: "U14–U15" },
  { value: "u17", label: "U16–U17" },
  { value: "u19", label: "U18–U19" },
];



export default function SearchWidget() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [clubFilter, setClubFilter] = useState("");
  const [clubSearch, setClubSearch] = useState("");
  const [clubDropdownOpen, setClubDropdownOpen] = useState(false);
  const clubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/data/players_list.json")
      .then((r) => r.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const clubs = useMemo(() => {
    const set = new Set(players.map((p) => p.c));
    return [...set].sort();
  }, [players]);

  const filteredClubs = useMemo(() => {
    if (!clubSearch) return clubs;
    const q = clubSearch.toLowerCase();
    return clubs.filter((c) => c.toLowerCase().includes(q));
  }, [clubs, clubSearch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (clubRef.current && !clubRef.current.contains(e.target as Node)) {
        setClubDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const year = parseInt(birthDate.substring(0, 4));
    return 2026 - year;
  };

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

  const hasFilters = search || positionFilter || ageFilter || clubFilter;
  const previewResults = hasFilters ? filtered.slice(0, 4) : [];

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="card-navy-glow p-6 md:p-8" style={{ overflow: "visible" }}>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-2">
            <span className="text-gradient">Caută jucători</span>
          </h2>
          <p className="text-muted text-center text-sm mb-6 font-light">
            Filtrează după nume, poziție, vârstă sau club
          </p>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Caută după nume..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-3 bg-navy border border-white/10 rounded-lg text-foreground text-base md:text-sm focus:border-violet focus:outline-none"
            />
            <CustomSelect
              value={positionFilter}
              placeholder="Toate pozițiile"
              options={[{ value: "", label: "Toate pozițiile" }, ...POSITIONS.map((p) => ({ value: p, label: p }))]}
              onChange={setPositionFilter}
            />
            <CustomSelect
              value={ageFilter}
              placeholder="Toate vârstele"
              options={AGE_OPTIONS}
              onChange={setAgeFilter}
            />
            <div ref={clubRef} className="relative">
              <input
                type="text"
                placeholder={clubFilter || "Toate cluburile"}
                value={clubDropdownOpen ? clubSearch : (clubFilter || "")}
                onChange={(e) => { setClubSearch(e.target.value); setClubDropdownOpen(true); }}
                onFocus={() => { setClubDropdownOpen(true); setClubSearch(""); }}
                className="w-full px-4 py-3 bg-navy border border-white/10 rounded-lg text-foreground text-base md:text-sm focus:border-violet focus:outline-none"
              />
              {clubFilter && !clubDropdownOpen && (
                <button
                  type="button"
                  onClick={() => setClubFilter("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-lg leading-none"
                  aria-label="Curăță filtrul"
                >×</button>
              )}
              {clubDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-navy border border-white/10 rounded-lg shadow-xl">
                  <button
                    type="button"
                    onClick={() => { setClubFilter(""); setClubDropdownOpen(false); setClubSearch(""); }}
                    className="w-full text-left px-4 py-2.5 text-base md:text-sm text-muted hover:bg-white/5"
                  >Toate cluburile</button>
                  {filteredClubs.length === 0 ? (
                    <div className="px-4 py-2.5 text-base md:text-sm text-muted">Niciun club găsit</div>
                  ) : (
                    filteredClubs.slice(0, 100).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => { setClubFilter(c); setClubDropdownOpen(false); setClubSearch(""); }}
                        className={`w-full text-left px-4 py-2.5 text-base md:text-sm hover:bg-white/5 ${clubFilter === c ? "text-violet" : "text-foreground"}`}
                      >{c}</button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Preview results */}
          {hasFilters && (
            <div className="mt-6">
              {loading ? (
                <p className="text-muted text-sm text-center">Se încarcă...</p>
              ) : previewResults.length === 0 ? (
                <p className="text-muted text-sm text-center">Niciun jucător găsit.</p>
              ) : (
                <>
                  <p className="text-muted text-xs mb-3">
                    {filtered.length} rezultate găsite
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {previewResults.map((p, i) => {
                      const age = getAge(p.b);
                      return (
                        <Link
                          key={i}
                          href={`/jucator/${encodeURIComponent(((p.f || "").trim() + "-" + (p.l || "").trim()).replace(/\s+/g, " "))}`}
                          className="card-navy p-3 flex items-center gap-3 no-underline hover:border-violet/25 transition-all"
                        >
                          <div className="w-10 h-10 rounded-full bg-navy-light border border-white/10 flex items-center justify-center text-violet font-display font-bold text-sm flex-shrink-0">
                            {p.f.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-foreground truncate">
                              {p.f} {p.l}
                            </div>
                            <div className="text-xs text-muted truncate">
                              {p.c}
                            </div>
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            <span className="px-2 py-0.5 rounded text-xs bg-green/10 text-green">
                              {age} ani
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  {filtered.length > 4 && (
                    <div className="text-center mt-4">
                      <Link
                        href="/jucatori"
                        className="inline-block px-6 py-2.5 bg-violet text-white text-sm font-bold rounded-full no-underline hover:bg-violet-dark transition-all"
                      >
                        Vezi toate cele {filtered.length} rezultate →
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* No filters — show link to all players */}
          {!hasFilters && (
            <div className="text-center mt-6">
              <Link
                href="/jucatori"
                className="inline-block px-8 py-3 bg-violet text-white text-sm font-bold uppercase tracking-wider no-underline transition-all hover:bg-violet-dark rounded-full"
              >
                Caută jucători
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
