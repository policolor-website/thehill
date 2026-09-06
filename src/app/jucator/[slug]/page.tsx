"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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

type MatchEntry = [string, string, string, string, number, string, string, string];
// [data, competiție, rol, poziție, căpitan(0/1), opponent, scor, rezultat(W/D/L)]

type PlayerStat = {
  f: string;
  l: string;
  ph: string | null;
  tm: number;
  ti: number;
  re: number;
  cp: number;
  ps: string[];
  co: string[];
  cl: string[];
  w: number;
  dw: number;
  ls: number;
  mt?: MatchEntry[];
};

function getAge(birthDate: string): number {
  if (!birthDate) return 0;
  const year = parseInt(birthDate.substring(0, 4));
  return 2026 - year;
}

function getBirthYear(birthDate: string): string {
  if (!birthDate) return "—";
  return birthDate.substring(0, 4);
}

export default function JucatorPage() {
  const params = useParams();
  const slug = decodeURIComponent(params.slug as string);
  const nameParts = slug.split("-");

  const [players, setPlayers] = useState<Player[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/players_list.json").then((r) => r.json()),
      fetch("/data/player_stats.json").then((r) => r.json()),
    ]).then(([p, ps]) => {
      setPlayers(p);
      setPlayerStats(ps);
      setLoading(false);
    });
  }, []);

  // Găsește jucătorul după nume (slug-ul e "firstName-lastName")
  const playerRecords = useMemo(() => {
    if (!players.length) return [];
    const firstName = (nameParts[0] || "").trim();
    const lastName = (nameParts.slice(1).join("-") || "").trim();
    const fullName = slug.replace(/-/g, " ").toLowerCase().replace(/\s+/g, " ").trim();

    // 1. Match exact pe f + l (cu trim)
    let found = players.filter(
      (p) =>
        p.f.trim().toLowerCase() === firstName.toLowerCase() &&
        p.l.trim().toLowerCase() === lastName.toLowerCase()
    );
    // 2. Match pe numele complet exact
    if (found.length === 0) {
      found = players.filter(
        (p) => (p.f.trim() + " " + p.l.trim()).toLowerCase() === fullName
      );
    }
    // 3. Match parțial (includes)
    if (found.length === 0) {
      found = players.filter((p) =>
        (p.f.trim() + " " + p.l.trim()).toLowerCase().includes(fullName)
      );
    }
    return found;
  }, [players, slug, nameParts]);

  // Date de bază ale jucătorului (din prima înregistrare)
  const player = playerRecords[0];

  // Stats din player_stats.json (pre-agregate)
  const stat = useMemo(() => {
    if (!playerStats.length || !player) return null;
    return playerStats.find(
      (s) =>
        s.f.trim().toLowerCase() === player.f.trim().toLowerCase() &&
        s.l.trim().toLowerCase() === player.l.trim().toLowerCase()
    ) || null;
  }, [playerStats, player]);

  if (loading) {
    return (
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-muted">Se încarcă datele jucătorului...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Jucător negăsit</h1>
          <p className="text-muted mb-6">Nu am găsit jucătorul: {slug}</p>
          <Link href="/jucatori" className="text-violet hover:underline">
            ← Înapoi la lista de jucători
          </Link>
        </div>
      </div>
    );
  }

  const age = getAge(player.b);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/jucatori" className="text-muted hover:text-violet text-sm transition-colors">
            ← Înapoi la jucători
          </Link>
        </div>

        {/* Header card */}
        <div className="card-navy-glow p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border border-white/10 bg-navy-light">
                {stat?.ph ? (
                  <Image
                    src={stat.ph}
                    alt={`${player.f} ${player.l}`}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-violet">
                    {player.f.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                {player.f} {player.l}
              </h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet/10 text-violet">
                  {player.ps?.[0] || player.p}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green/10 text-green">
                  {age} ani
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber/10 text-amber">
                  #{player.s}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted block">Club</span>
                  <span className="text-foreground font-medium">{player.c}</span>
                </div>
                <div>
                  <span className="text-muted block">An naștere</span>
                  <span className="text-foreground font-medium">{getBirthYear(player.b)}</span>
                </div>
                <div>
                  <span className="text-muted block">Competiție</span>
                  <span className="text-foreground font-medium">{player.co}</span>
                </div>
                <div>
                  <span className="text-muted block">Poziții</span>
                  <span className="text-foreground font-medium">{player.ps?.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        {stat && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-navy p-5 text-center">
              <div className="text-3xl font-display font-bold text-foreground">{stat.tm}</div>
              <div className="text-xs text-muted uppercase tracking-wider mt-1">Meciuri</div>
            </div>
            <div className="card-navy p-5 text-center">
              <div className="text-3xl font-display font-bold text-green">{stat.ti}</div>
              <div className="text-xs text-muted uppercase tracking-wider mt-1">Titular</div>
            </div>
            <div className="card-navy p-5 text-center">
              <div className="text-3xl font-display font-bold text-amber">{stat.re}</div>
              <div className="text-xs text-muted uppercase tracking-wider mt-1">Rezervă</div>
            </div>
            <div className="card-navy p-5 text-center">
              <div className="text-3xl font-display font-bold text-violet">{stat.cp}</div>
              <div className="text-xs text-muted uppercase tracking-wider mt-1">Căpitan</div>
            </div>
          </div>
        )}

        {/* Results W/D/L */}
        {stat && stat.w + stat.dw + stat.ls > 0 && (
          <div className="card-navy p-6 mb-8">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Rezultate meciuri
            </h3>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-green">{stat.w}</div>
                <div className="text-xs text-muted">Victorii</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-amber">{stat.dw}</div>
                <div className="text-xs text-muted">Egaluri</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-red">{stat.ls}</div>
                <div className="text-xs text-muted">Înfrângeri</div>
              </div>
            </div>
          </div>
        )}

        {/* Positions played */}
        {stat && stat.ps.length > 0 && (
          <div className="card-navy p-6 mb-8">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Poziții jucate
            </h3>
            <div className="flex flex-wrap gap-2">
              {stat.ps.map((pos) => (
                <span
                  key={pos}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-white/8 bg-navy-light text-foreground"
                >
                  {pos}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Competitions */}
        {stat && stat.co.length > 0 && (
          <div className="card-navy p-6 mb-8">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Competiții
            </h3>
            <div className="flex flex-wrap gap-2">
              {stat.co.map((comp) => (
                <span
                  key={comp}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-violet/20 bg-violet/5 text-violet"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Match history */}
        {stat && stat.mt && stat.mt.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Meciuri 2026 ({stat.mt.length})
            </h2>
            <div className="space-y-2">
              {stat.mt.map((m, i) => {
                const [date, comp, role, pos, captain, opp, score, result] = m;
                const resultColor =
                  result === "W" ? "text-green" :
                  result === "L" ? "text-red" :
                  result === "D" ? "text-amber" : "text-muted";
                return (
                  <div key={i} className="card-navy p-4 flex items-center gap-4">
                    {/* Result badge */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      result === "W" ? "bg-green/10 text-green" :
                      result === "L" ? "bg-red/10 text-red" :
                      result === "D" ? "bg-amber/10 text-amber" : "bg-navy-light text-muted"
                    }`}>
                      {result || "—"}
                    </div>

                    {/* Date */}
                    <div className="text-xs text-muted w-16 flex-shrink-0">
                      {new Date(date).toLocaleDateString("ro-RO", { day: "2-digit", month: "short" })}
                    </div>

                    {/* Role */}
                    <div className="w-20 flex-shrink-0">
                      <span className={`text-xs font-semibold ${
                        role === "titular" ? "text-green" :
                        role === "rezervă" ? "text-amber" : "text-muted"
                      }`}>
                        {role === "titular" ? "Titular" : role === "rezervă" ? "Rezervă" : "Rez. extra"}
                      </span>
                      {captain === 1 && (
                        <span className="block text-xs text-violet">C</span>
                      )}
                    </div>

                    {/* Position */}
                    <div className="w-32 flex-shrink-0 text-xs text-foreground truncate hidden md:block">
                      {pos}
                    </div>

                    {/* Opponent */}
                    <div className="flex-1 text-sm text-foreground truncate">
                      vs {opp || "—"}
                    </div>

                    {/* Score */}
                    <div className={`text-sm font-bold ${resultColor} flex-shrink-0`}>
                      {score || "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No match data */}
        {!stat && (
          <div className="card-navy p-8 text-center">
            <p className="text-muted">
              Acest jucător nu apare în foile de meci. Doar datele de bază din lot
              sunt disponibile.
            </p>
          </div>
        )}

        {/* Multiple clubs note */}
        {playerRecords.length > 1 && (
          <div className="card-navy p-6 mt-8">
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">
              Înscris la {playerRecords.length} competiții
            </h3>
            <div className="space-y-2">
              {playerRecords.map((r, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-foreground">{r.co}</span>
                  <span className="text-muted">{r.c} · #{r.s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
