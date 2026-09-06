"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
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
  f: string;
  l: string;
  c: string;
  ci: string;
  b: string;
  s: string;
  p: string;
  ps: string[];
  co: string;
};

type Match = {
  matchId: string;
  date: string;
  competitionName: string;
  homeClubId: string;
  homeClubName: string;
  awayClubId: string;
  awayClubName: string;
  homeGoals: number | null;
  awayGoals: number | null;
  stadiumName: string;
  stadiumTown: string;
};

function getAge(birthDate: string): number {
  if (!birthDate) return 0;
  const year = parseInt(birthDate.substring(0, 4));
  return 2026 - year;
}

function playerSlug(p: Player): string {
  return `${p.f.trim()}-${p.l.trim()}`.replace(/\s+/g, "-");
}

export default function ClubPage() {
  const params = useParams();
  const clubId = decodeURIComponent(params.id as string);

  const [clubs, setClubs] = useState<Club[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [posFilter, setPosFilter] = useState("");
  const [compFilter, setCompFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/data/clubs_slim.json").then((r) => r.json()),
      fetch("/data/players_list.json").then((r) => r.json()),
      fetch("/data/matches.json?v=3").then((r) => r.json()),
    ]).then(([c, p, m]) => {
      setClubs(c);
      setPlayers(p);
      m.sort((a: Match, b: Match) => b.date.localeCompare(a.date));
      setMatches(m);
      setLoading(false);
    });
  }, []);

  const club = useMemo(() => clubs.find((c) => c.id === clubId), [clubs, clubId]);

  const clubPlayers = useMemo(() => {
    return players.filter((p) => p.ci === clubId);
  }, [players, clubId]);

  const positions = useMemo(() => {
    const set = new Set(clubPlayers.map((p) => p.p).filter(Boolean));
    return [...set].sort();
  }, [clubPlayers]);

  const competitions = useMemo(() => {
    const set = new Set(clubPlayers.map((p) => p.co).filter(Boolean));
    return [...set].sort();
  }, [clubPlayers]);

  const filteredPlayers = useMemo(() => {
    const q = nameFilter.trim().toLowerCase();
    return clubPlayers
      .filter((p) => {
        if (posFilter && p.p !== posFilter) return false;
        if (compFilter && p.co !== compFilter) return false;
        if (q && !`${p.f} ${p.l}`.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => getAge(a.b) - getAge(b.b));
  }, [clubPlayers, posFilter, compFilter, nameFilter]);

  const clubMatches = useMemo(() => {
    return matches.filter(
      (m) => m.homeClubId === clubId || m.awayClubId === clubId
    );
  }, [matches, clubId]);

  const matchesWithScore = clubMatches.filter(
    (m) => m.homeGoals !== null
  ).length;

  if (loading) {
    return (
      <div className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center py-20 text-muted">Se încarcă...</div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Club negăsit
          </h1>
          <p className="text-muted mb-6">
            Nu am găsit clubul cu ID-ul: {clubId}
          </p>
          <Link
            href="/cluburi"
            className="text-violet hover:text-violet-dark no-underline"
          >
            ← Înapoi la cluburi
          </Link>
        </div>
      </div>
    );
  }

  const displayName = club.a || club.n;

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumb */}
        <Link
          href="/cluburi"
          className="text-muted hover:text-violet no-underline text-sm transition-colors"
        >
          ← Toate cluburile
        </Link>

        {/* Header */}
        <div className="mt-4 mb-10">
          <span className="text-violet text-xs font-semibold uppercase tracking-[0.25em]">
            Club de juniori
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold mt-3 mb-2">
            <span className="text-gradient">{displayName}</span>
          </h1>
          <p className="text-muted">
            {club.co}, {club.ci} · {clubPlayers.length} jucători ·{" "}
            {clubMatches.length} meciuri
          </p>
        </div>

        {/* Lot jucători */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Lot jucători
            </h2>
            <span className="text-muted text-sm">
              {filteredPlayers.length} jucători
            </span>
          </div>

          {/* Filtre */}
          <div className="card-navy p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Caută după nume..."
                className="px-4 py-2.5 bg-navy border border-white/10 rounded-lg text-foreground text-sm focus:border-violet focus:outline-none placeholder:text-muted"
              />
              {positions.length > 1 && (
                <select
                  value={posFilter}
                  onChange={(e) => setPosFilter(e.target.value)}
                  className="px-4 py-2.5 bg-navy border border-white/10 rounded-lg text-foreground text-sm focus:border-violet focus:outline-none"
                >
                  <option value="">Toate pozițiile</option>
                  {positions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              )}
              {competitions.length > 1 && (
                <select
                  value={compFilter}
                  onChange={(e) => setCompFilter(e.target.value)}
                  className="px-4 py-2.5 bg-navy border border-white/10 rounded-lg text-foreground text-sm focus:border-violet focus:outline-none"
                >
                  <option value="">Toate competițiile</option>
                  {competitions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Lista jucători */}
          {filteredPlayers.length === 0 ? (
            <p className="text-muted text-center py-10">
              Niciun jucător cu filtrele selectate.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPlayers.map((p, i) => (
                <Link
                  key={`${p.f}-${p.l}-${i}`}
                  href={`/jucator/${playerSlug(p)}`}
                  className="card-navy p-4 no-underline hover:border-violet/30 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground font-semibold text-sm group-hover:text-violet transition-colors">
                      {p.f} {p.l}
                    </span>
                    {p.s && (
                      <span className="text-xs text-muted">#{p.s}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span>{getAge(p.b)} ani</span>
                    <span className="text-violet">{p.p}</span>
                  </div>
                  {p.co && <p className="text-xs text-muted mt-1">{p.co}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Meciuri */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Meciuri
            </h2>
            <span className="text-muted text-sm">
              {clubMatches.length} meciuri · {matchesWithScore} cu scor
            </span>
          </div>

          {clubMatches.length === 0 ? (
            <p className="text-muted text-center py-10">
              Nu am găsit meciuri pentru acest club.
            </p>
          ) : (
            <div className="space-y-3">
              {clubMatches.slice(0, 50).map((m) => {
                const isHome = m.homeClubId === clubId;
                const oppName = isHome ? m.awayClubName : m.homeClubName;
                const oppId = isHome ? m.awayClubId : m.homeClubId;
                const myGoals = isHome ? m.homeGoals : m.awayGoals;
                const oppGoals = isHome ? m.awayGoals : m.homeGoals;
                const hasScore = m.homeGoals !== null;
                let result = "";
                if (hasScore && myGoals !== null && oppGoals !== null) {
                  if (myGoals > oppGoals) result = "W";
                  else if (myGoals < oppGoals) result = "L";
                  else result = "D";
                }
                const resultColor =
                  result === "W"
                    ? "text-green"
                    : result === "L"
                    ? "text-red"
                    : result === "D"
                    ? "text-amber"
                    : "text-muted";

                return (
                  <div
                    key={m.matchId}
                    className="card-navy p-4 flex items-center gap-3 md:gap-4"
                  >
                    <div className="text-xs text-muted w-14 flex-shrink-0">
                      {new Date(m.date).toLocaleDateString("ro-RO", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                    <div className="text-xs text-violet w-28 md:w-32 flex-shrink-0 truncate hidden sm:block">
                      {m.competitionName}
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-2">
                      <span className="text-xs text-muted flex-shrink-0">
                        {isHome ? "acasă" : "deplasare"}
                      </span>
                      <Link
                        href={`/club/${oppId}`}
                        className="text-sm text-foreground hover:text-violet no-underline transition-colors truncate flex-1 text-right"
                      >
                        {oppName}
                      </Link>
                      <span
                        className={`px-2.5 py-1 rounded-lg bg-navy-light text-sm font-bold flex-shrink-0 ${
                          hasScore ? resultColor : "text-muted"
                        }`}
                      >
                        {hasScore ? `${myGoals} - ${oppGoals}` : "VS"}
                      </span>
                    </div>
                  </div>
                );
              })}
              {clubMatches.length > 50 && (
                <p className="text-center text-muted text-sm py-4">
                  Afișăm primele 50 din {clubMatches.length} meciuri
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
