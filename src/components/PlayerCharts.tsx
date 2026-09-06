"use client";

import { useEffect, useState } from "react";

type MatchEntry = [string, string, string, string, number, string, string, string, string];

type PlayerStat = {
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

// Semicircular gauge for W/D/L — gen vitezometru
function GaugeChart({ w, dw, ls }: { w: number; dw: number; ls: number }) {
  const total = w + dw + ls;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  if (total === 0) return null;

  const segments = [
    { value: w, from: "#22c55e", to: "#4ade80", label: "Victorii" },
    { value: dw, from: "#f59e0b", to: "#fbbf24", label: "Egaluri" },
    { value: ls, from: "#ef4444", to: "#f87171", label: "Înfrângeri" },
  ];

  const cx = 140;
  const cy = 125;
  const radius = 105;
  const stroke = 24;
  const circumference = Math.PI * radius; // semicerc
  let offset = 0;

  return (
    <div className="flex flex-col items-center">
      <svg width="280" height="160" viewBox="0 0 280 160" className="flex-shrink-0">
        <defs>
          {segments.map((seg, i) => (
            <linearGradient key={i} id={`gauge-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={seg.from} />
              <stop offset="100%" stopColor={seg.to} />
            </linearGradient>
          ))}
          <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Segments */}
        {segments.map((seg, i) => {
          if (seg.value === 0) return null;
          const len = (seg.value / total) * circumference;
          const path = (
            <path
              key={i}
              d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
              fill="none"
              stroke={`url(#gauge-${i})`}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${animated ? len : 0} ${circumference}`}
              strokeDashoffset={-offset}
              filter="url(#gauge-glow)"
              style={{ transition: `stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.2}s` }}
            />
          );
          offset += len;
          return path;
        })}
        {/* Center text */}
        <text x={cx} y={cy - 15} textAnchor="middle" className="fill-foreground font-display font-bold" fontSize="38" style={{ filter: "drop-shadow(0 0 10px rgba(139,92,246,0.5))" }}>
          {total}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" className="fill-muted" fontSize="11" letterSpacing="2">
          MECIURI
        </text>
      </svg>
      <div className="flex gap-4 mt-2 flex-wrap justify-center">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md" style={{ background: `linear-gradient(135deg, ${seg.from}, ${seg.to})`, boxShadow: `0 0 8px ${seg.to}60` }} />
            <span className="text-xs text-foreground font-medium">{seg.label}</span>
            <span className="text-xs text-muted tabular-nums">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Radial concentric rings — gen Apple Activity
function RadialRings({ data }: { data: { label: string; value: number; total: number; from: string; to: string }[] }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  const cx = 90;
  const cy = 90;
  const stroke = 12;
  const gap = 18;
  const circumference = 2 * Math.PI * 70;

  return (
    <div className="flex items-center gap-6">
      <svg width="180" height="180" viewBox="0 0 180 180" className="flex-shrink-0">
        <defs>
          {data.map((d, i) => (
            <linearGradient key={i} id={`ring-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={d.from} />
              <stop offset="100%" stopColor={d.to} />
            </linearGradient>
          ))}
          <filter id="ring-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {data.map((d, i) => {
          const r = 70 - i * gap;
          const c = 2 * Math.PI * r;
          const pct = d.total > 0 ? d.value / d.total : 0;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={`url(#ring-${i})`}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${animated ? pct * c : 0} ${c}`}
                transform="rotate(-90 90 90)"
                filter="url(#ring-glow)"
                style={{ transition: `stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.15}s` }}
              />
            </g>
          );
        })}
        <text x={cx} y={cy + 4} textAnchor="middle" className="fill-foreground font-display font-bold" fontSize="22">
          {data[0]?.total || 0}
        </text>
        <text x={cx} y={cy + 20} textAnchor="middle" className="fill-muted" fontSize="9" letterSpacing="1">
          TOTAL
        </text>
      </svg>
      <div className="space-y-3 flex-1">
        {data.map((d) => (
          <div key={d.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-foreground font-medium flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: `linear-gradient(135deg, ${d.from}, ${d.to})`, boxShadow: `0 0 6px ${d.to}50` }} />
                {d.label}
              </span>
              <span className="text-muted tabular-nums">{d.value}/{d.total}</span>
            </div>
            <div className="text-xs text-muted">
              {d.total > 0 ? Math.round((d.value / d.total) * 100) : 0}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Radar/spider chart pentru poziții
function RadarChart({ data }: { data: { label: string; value: number }[] }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (data.length < 3) {
    // Pentru mai puțin de 3 puncte, radar nu are sens — folosim radial bars verticale
    return <VerticalBars data={data} from="#8b5cf6" to="#c4b5fd" />;
  }

  const cx = 100;
  const cy = 100;
  const maxR = 75;
  const max = Math.max(...data.map((d) => d.value), 1);
  const n = data.length;

  // Poligon points
  const getPoint = (i: number, r: number) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  };

  const dataPoints = data.map((d, i) => {
    const r = animated ? (d.value / max) * maxR : 0;
    return getPoint(i, r);
  });

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="flex-shrink-0">
        <defs>
          <linearGradient id="radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="radar-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
          <filter id="radar-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Grid */}
        {gridLevels.map((level, li) => {
          const pts = data.map((_, i) => getPoint(i, maxR * level).join(",")).join(" ");
          return <polygon key={li} points={pts} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
        })}
        {/* Axes */}
        {data.map((_, i) => {
          const [x, y] = getPoint(i, maxR);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
        })}
        {/* Data polygon */}
        <polygon
          points={dataPoints.map((p) => p.join(",")).join(" ")}
          fill="url(#radar-fill)"
          stroke="url(#radar-stroke)"
          strokeWidth="2"
          filter="url(#radar-glow)"
          style={{ transition: "all 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#8b5cf6" strokeWidth="2" stroke="#1e293b" style={{ transition: `all 1s cubic-bezier(0.4,0,0.2,1) ${i * 0.05}s` }} />
        ))}
        {/* Labels */}
        {data.map((d, i) => {
          const [x, y] = getPoint(i, maxR + 18);
          const anchor = Math.abs(x - cx) < 10 ? "middle" : x > cx ? "start" : "end";
          return (
            <text key={i} x={x} y={y} textAnchor={anchor} dominantBaseline="middle" className="fill-muted" fontSize="8" style={{ transition: "opacity 0.5s 0.8s", opacity: animated ? 1 : 0 }}>
              {d.label.length > 15 ? d.label.substring(0, 13) + "…" : d.label}
            </text>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-3 mt-2 justify-center max-w-full">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet" style={{ boxShadow: "0 0 6px #8b5cf680" }} />
            <span className="text-xs text-muted">{d.label} ({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Vertical bars (fallback pentru <3 poziții)
function VerticalBars({ data, from, to }: { data: { label: string; value: number }[]; from: string; to: string }) {
  const [animated, setAnimated] = useState(false);
  const max = Math.max(...data.map((d) => d.value), 1);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex items-end justify-center gap-4 h-40">
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-col items-center gap-2 flex-1 max-w-[100px]">
          <div className="text-xs text-foreground font-bold tabular-nums">{d.value}</div>
          <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
            <div
              className="w-full max-w-[40px] rounded-t-lg relative"
              style={{
                height: animated ? `${(d.value / max) * 100}%` : "0%",
                background: `linear-gradient(180deg, ${to}, ${from})`,
                boxShadow: `0 0 16px ${to}40`,
                transition: `height 1s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`,
              }}
            >
              <div className="absolute inset-0 rounded-t-lg opacity-40" style={{ background: `linear-gradient(180deg, transparent, ${from}30)` }} />
            </div>
          </div>
          <div className="text-xs text-muted text-center truncate w-full">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

// Bubble chart pentru competiții
function BubbleChart({ data }: { data: { label: string; value: number }[] }) {
  const [animated, setAnimated] = useState(false);
  const max = Math.max(...data.map((d) => d.value), 1);
  const colors = [
    { from: "#06b6d4", to: "#67e8f9" },
    { from: "#8b5cf6", to: "#c4b5fd" },
    { from: "#f59e0b", to: "#fbbf24" },
    { from: "#ec4899", to: "#f9a8d4" },
    { from: "#22c55e", to: "#4ade80" },
  ];

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Pack bubbles simplu — grid circular
  const positions = data.map((_, i) => {
    const angle = (i / data.length) * 2 * Math.PI;
    const dist = 50 + (i % 2) * 20;
    return [100 + Math.cos(angle) * dist, 100 + Math.sin(angle) * dist];
  });

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="flex-shrink-0">
        <defs>
          {data.map((_, i) => {
            const c = colors[i % colors.length];
            return (
              <radialGradient key={i} id={`bubble-${i}`} cx="35%" cy="35%">
                <stop offset="0%" stopColor={c.to} stopOpacity="0.9" />
                <stop offset="100%" stopColor={c.from} stopOpacity="0.5" />
              </radialGradient>
            );
          })}
          <filter id="bubble-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {data.map((d, i) => {
          const r = animated ? 15 + (d.value / max) * 30 : 0;
          const [x, y] = positions[i];
          const c = colors[i % colors.length];
          return (
            <g key={i} style={{ transition: `all 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s` }}>
              <circle cx={x} cy={y} r={r} fill={`url(#bubble-${i})`} stroke={c.from} strokeWidth="1.5" filter="url(#bubble-glow)" opacity={animated ? 1 : 0} />
              <text x={x} y={y - 2} textAnchor="middle" className="fill-foreground font-display font-bold" fontSize={r > 25 ? "14" : "10"}>
                {d.value}
              </text>
              {r > 20 && (
                <text x={x} y={y + 10} textAnchor="middle" className="fill-muted" fontSize="7">
                  {d.label.length > 12 ? d.label.substring(0, 10) + "…" : d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-2 mt-2 justify-center max-w-full">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: colors[i % colors.length].from }} />
            <span className="text-xs text-muted">{d.label} ({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlayerCharts({ stat }: { stat: PlayerStat }) {
  const posCounts: Record<string, number> = {};
  const compCounts: Record<string, number> = {};
  if (stat.mt) {
    stat.mt.forEach((m) => {
      if (m[3]) posCounts[m[3]] = (posCounts[m[3]] || 0) + 1;
      if (m[1]) compCounts[m[1]] = (compCounts[m[1]] || 0) + 1;
    });
  }

  const posData = Object.entries(posCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const compData = Object.entries(compCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const hasResults = stat.w + stat.dw + stat.ls > 0;
  const hasRoles = stat.ti > 0 || stat.re > 0;
  const hasPositions = posData.length > 0;
  const hasCompetitions = compData.length > 0;

  if (!hasResults && !hasRoles && !hasPositions && !hasCompetitions) return null;

  return (
    <div className="mb-8">
      <h2 className="font-display text-2xl font-bold text-foreground mb-4">
        Statistici
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hasResults && (
          <div className="card-navy-glow p-6">
            <h3 className="font-display text-sm font-semibold text-muted uppercase tracking-[0.2em] mb-4">
              Rezultate
            </h3>
            <GaugeChart w={stat.w} dw={stat.dw} ls={stat.ls} />
          </div>
        )}
        {hasRoles && (
          <div className="card-navy-glow p-6">
            <h3 className="font-display text-sm font-semibold text-muted uppercase tracking-[0.2em] mb-4">
              Titular vs Rezervă
            </h3>
            <RadialRings
              data={[
                { label: "Titular", value: stat.ti, total: stat.tm, from: "#22c55e", to: "#4ade80" },
                { label: "Rezervă", value: stat.re, total: stat.tm, from: "#f59e0b", to: "#fbbf24" },
              ].filter((d) => d.value > 0)}
            />
          </div>
        )}
        {hasPositions && (
          <div className="card-navy-glow p-6">
            <h3 className="font-display text-sm font-semibold text-muted uppercase tracking-[0.2em] mb-4">
              Poziții jucate
            </h3>
            <RadialRings
              data={posData.map((p, i) => {
                const colors = [
                  { from: "#8b5cf6", to: "#c4b5fd" },
                  { from: "#06b6d4", to: "#67e8f9" },
                  { from: "#ec4899", to: "#f9a8d4" },
                  { from: "#f59e0b", to: "#fbbf24" },
                  { from: "#22c55e", to: "#4ade80" },
                ];
                const c = colors[i % colors.length];
                return { label: p.label, value: p.value, total: stat.tm, from: c.from, to: c.to };
              })}
            />
          </div>
        )}
        {hasCompetitions && (
          <div className="card-navy-glow p-6">
            <h3 className="font-display text-sm font-semibold text-muted uppercase tracking-[0.2em] mb-4">
              Competiții
            </h3>
            <RadialRings
              data={compData.map((c, i) => {
                const colors = [
                  { from: "#06b6d4", to: "#67e8f9" },
                  { from: "#8b5cf6", to: "#c4b5fd" },
                  { from: "#ec4899", to: "#f9a8d4" },
                  { from: "#f59e0b", to: "#fbbf24" },
                  { from: "#22c55e", to: "#4ade80" },
                ];
                const col = colors[i % colors.length];
                return { label: c.label, value: c.value, total: stat.tm, from: col.from, to: col.to };
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
