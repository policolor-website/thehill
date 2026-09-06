import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-light border-t border-white/5 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo + description */}
          <div>
            <Link href="/" className="no-underline mb-4 block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="theHILL.ro"
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Platformă scouting fotbal pentru juniori din România. Date din FRF
              și HaiLaFotbal. Caută jucători după vârstă, poziție, județ și club.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-violet text-sm font-bold uppercase tracking-wider mb-4">
              Link-uri
            </h3>
            <ul className="flex flex-col gap-2 list-none">
              <li><Link href="/" className="text-muted hover:text-violet no-underline transition-colors text-sm">Acasă</Link></li>
              <li><Link href="/jucatori" className="text-muted hover:text-violet no-underline transition-colors text-sm">Jucători</Link></li>
              <li><Link href="/cluburi" className="text-muted hover:text-violet no-underline transition-colors text-sm">Cluburi</Link></li>
              <li><Link href="/meciuri" className="text-muted hover:text-violet no-underline transition-colors text-sm">Meciuri</Link></li>
              <li><Link href="/despre" className="text-muted hover:text-violet no-underline transition-colors text-sm">Despre</Link></li>
            </ul>
          </div>

          {/* Competiții */}
          <div>
            <h3 className="text-green text-sm font-bold uppercase tracking-wider mb-4">
              Competiții
            </h3>
            <ul className="flex flex-col gap-2 list-none">
              <li className="text-muted text-sm">Liga Elitelor U13–U17</li>
              <li className="text-muted text-sm">Campionatul Național U15–U19</li>
              <li className="text-muted text-sm">Liga de Tineret</li>
              <li className="text-muted text-sm">Cupa Națională</li>
            </ul>
          </div>

          {/* Data source */}
          <div>
            <h3 className="text-amber text-sm font-bold uppercase tracking-wider mb-4">
              Sursă date
            </h3>
            <ul className="flex flex-col gap-2 list-none">
              <li className="text-muted text-sm">FRF — Federația Română de Fotbal</li>
              <li className="text-muted text-sm">HaiLaFotbal.ro</li>
              <li className="text-muted text-sm">frf-ajf.ro</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-xs">
            © 2026 theHILL.ro. Date pentru scopuri de scouting.
          </p>
          <p className="text-muted text-xs">
            {`24.983 profiluri · 209 cluburi · 1.693 meciuri`}
          </p>
        </div>
      </div>
    </footer>
  );
}
