export const metadata = {
  title: "Despre theHILL.ro",
  description: "theHILL.ro — platformă scouting fotbal pentru juniori din România. Date din FRF și HaiLaFotbal.",
};

export default function DesprePage() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <span className="text-violet text-xs font-semibold uppercase tracking-[0.25em]">
          Despre platforma
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-8">
          <span className="text-gradient">theHILL.ro</span>
        </h1>

        <div className="space-y-6 text-muted font-light leading-relaxed text-lg">
          <p>
            theHILL.ro este o platformă de scouting fotbal dedicată
            juniorilor din România. Scopul nostru este să oferim scouterilor,
            antrenorilor și cluburilor un instrument simplu pentru a descoperi
            și evalua jucători juniori din toate colțurile țării.
          </p>

          <p>
            Datele provin exclusiv din surse oficiale:{" "}
            <strong className="text-foreground">FRF (Federația Română de Fotbal)</strong>{" "}
            și platforma{" "}
            <strong className="text-foreground">HaiLaFotbal.ro</strong>. Nu
            inventăm date — afișăm doar ce există în înregistrările oficiale.
          </p>

          <div className="card-navy p-8 mt-10">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
              Ce date avem
            </h2>
            <ul className="space-y-3 text-base">
              <li className="flex items-start gap-3">
                <span className="text-violet">✓</span>
                <span><strong className="text-foreground">24.983 profiluri juniori</strong> — poză, vârstă, poziție, tricou, club, competiție</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green">✓</span>
                <span><strong className="text-foreground">17.230 jucători</strong> identificați în meciuri (titular + rezervă)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber">✓</span>
                <span><strong className="text-foreground">14 poziții reale</strong> din foile de meci (inclusiv flancuri)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink">✓</span>
                <span><strong className="text-foreground">209 cluburi</strong> cu loturi de juniori</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet">✓</span>
                <span><strong className="text-foreground">1.693 meciuri</strong> de juniori cu scor</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green">✓</span>
                <span><strong className="text-foreground">42 județe</strong> acoperite</span>
              </li>
            </ul>
          </div>

          <div className="card-navy p-8 mt-6">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
              Ce NU avem
            </h2>
            <ul className="space-y-3 text-base">
              <li className="flex items-start gap-3">
                <span className="text-red">✗</span>
                <span>Marcatori — API-ul FRF nu expune cine a marcat</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red">✗</span>
                <span>Minute jucate — nu știm cât a jucat din meci</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red">✗</span>
                <span>Istoric transferuri complet — doar 45 recente</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red">✗</span>
                <span>Istoric loturi pe sezoane — doar lotul curent</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
