"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NationalPlayer = {
  name: string;
  club: string;
  country: string;
  position: string;
};

type NationalTeam = {
  id: string;
  name: string;
  players: NationalPlayer[];
  date: string;
  sourceUrl: string;
};

const POSITIONS = ["Portar", "Fundaș", "Mijlocaș", "Atacant"];

const POS_COLORS: Record<string, string> = {
  Portar: "text-amber-400",
  Fundaș: "text-sky-400",
  Mijlocaș: "text-violet",
  Atacant: "text-emerald-400",
};

export default function EchipeNationalePage() {
  const [teams, setTeams] = useState<NationalTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  useEffect(() => {
    fetch("/data/national_teams.json")
      .then((r) => r.json())
      .then((data) => {
        setTeams(data);
        if (data.length > 0) setSelectedTeam(data[0].id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const team = teams.find((t) => t.id === selectedTeam);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Echipe Naționale <span className="text-gradient">Juniori</span>
          </h1>
          <p className="text-muted font-light">
            {loading
              ? "Se încarcă..."
              : "Loturile echipelor naționale ale României — U15, U16, U17, U18"}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted">Se încarcă datele...</div>
        ) : (
          <>
            {/* Team selector */}
            <div className="flex flex-wrap gap-3 mb-8">
              {teams.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTeam(t.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all no-underline border ${
                    selectedTeam === t.id
                      ? "bg-violet text-white border-violet"
                      : "bg-navy text-foreground border-white/10 hover:border-violet/50"
                  }`}
                >
                  {t.name}
                  <span className={`ml-2 text-xs ${selectedTeam === t.id ? "text-white/70" : "text-muted"}`}>
                    {t.players.length}
                  </span>
                </button>
              ))}
            </div>

            {team && (
              <>
                {/* Team info */}
                <div className="card-navy-glow p-6 mb-8">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="font-display text-2xl font-bold mb-1">{team.name}</h2>
                      <p className="text-muted text-sm">
                        Lot actualizat: {team.date || "—"}
                        {team.players.length > 0 && ` · ${team.players.length} jucători convocați`}
                      </p>
                    </div>
                    {team.sourceUrl && (
                      <a
                        href={team.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet text-sm hover:underline"
                      >
                        Sursă: frf.ro ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Players by position */}
                {team.players.length === 0 ? (
                  <div className="text-center py-20 text-muted">
                    Nu am găsit lotul pentru această echipă.
                  </div>
                ) : (
                  <div className="space-y-8">
                    {POSITIONS.map((pos) => {
                      const posPlayers = team.players.filter((p) => p.position === pos);
                      if (posPlayers.length === 0) return null;
                      return (
                        <div key={pos}>
                          <h3 className={`font-display text-lg font-bold mb-4 ${POS_COLORS[pos]}`}>
                            {pos === "Portar"
                              ? "Portari"
                              : pos === "Fundaș"
                              ? "Fundași"
                              : pos === "Mijlocaș"
                              ? "Mijlocași"
                              : "Atacanți"}
                            <span className="text-muted text-sm font-normal ml-2">({posPlayers.length})</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {posPlayers.map((p, i) => (
                              <div
                                key={i}
                                className="card-navy p-4 flex items-center gap-3"
                              >
                                <div className="w-10 h-10 rounded-full bg-navy-light border border-white/10 flex items-center justify-center text-violet font-display font-bold text-sm flex-shrink-0">
                                  {p.name.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-sm text-foreground truncate">
                                    {p.name}
                                  </p>
                                  <p className="text-xs text-muted truncate">
                                    {p.club}
                                    {p.country && ` · ${p.country}`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Footer note */}
        <div className="mt-12 card-navy p-5">
          <p className="text-muted text-sm">
            Datele despre loturile echipelor naționale sunt colectate de pe{" "}
            <a href="https://www.frf.ro" target="_blank" rel="noopener noreferrer" className="text-violet hover:underline">
              frf.ro
            </a>
            . Loturile se actualizează periodic, în funcție de comunicatele oficiale ale FRF.
          </p>
        </div>
      </div>
    </div>
  );
}
