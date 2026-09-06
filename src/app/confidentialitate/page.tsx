import Link from "next/link";

export const metadata = {
  title: "Politica de confidențialitate",
  description:
    "Politica de confidențialitate theHILL.ro — cookies, date personale, GDPR, surse date FRF/HaiLaFotbal.",
};

export default function ConfidentialitatePage() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/"
          className="text-muted hover:text-violet no-underline text-sm transition-colors"
        >
          ← Înapoi acasă
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-8">
          <span className="text-gradient">Politica de confidențialitate</span>
        </h1>

        <div className="space-y-8 text-muted leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              1. Despre theHILL.ro
            </h2>
            <p>
              theHILL.ro este o platformă de scouting dedicată fotbalului de juniori din România,
              cu scop necomercial. Platforma afișează date publice despre jucători juniori, cluburi,
              academii, meciuri și rezultate.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              2. Sursele datelor
            </h2>
            <p className="mb-3">
              Datele afișate pe theHILL.ro provin din surse publice:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>FRF — Federația Română de Fotbal</li>
              <li>HaiLaFotbal.ro — platforma oficială FRF</li>
              <li>frf-ajf.ro</li>
            </ul>
            <p className="mt-3">
              theHILL.ro nu deține și nu colectează direct date personale de la utilizatori prin
              înregistrare. Toate informațiile despre jucători sunt preluate din sursele publice
              menționate.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              3. Date cu caracter personal (GDPR)
            </h2>
            <p className="mb-3">
              Conform Regulamentului General privind Protecția Datelor (GDPR — Regulamentul UE
              679/2016) și Legii nr. 190/2018, vă informăm că:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                Datele afișate despre jucători juniori (nume, vârstă, poziție, club, competiție)
                sunt date de interes public din surse oficiale FRF.
              </li>
              <li>
                Nu afișăm poze sau date sensibile despre minori fără acord suplimentar.
              </li>
              <li>
                Nu colectăm date personale de la vizitatori prin formulare de înregistrare.
              </li>
              <li>
                Formularul de contact de pe pagina /contact colectează doar numele, emailul și
                mesajul — exclusiv pentru răspunsul la solicitări, fără stocare în baze de date.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              4. Drepturile jucătorilor și părinților
            </h2>
            <p className="mb-3">
              Dacă sunteți jucător, părinte sau tutore legal și doriți:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Modificarea sau eliminarea datelor afișate pe theHILL.ro</li>
              <li>Retragerea consimțământului pentru afișarea datelor</li>
              <li>Acces la datele personale stocate</li>
            </ul>
            <p className="mt-3">
              Vă rugăm să ne contactați la <a href="mailto:contact@forsite.ro" className="text-violet hover:text-violet-dark no-underline">contact@forsite.ro</a> sau la telefon{" "}
              <a href="tel:0785598779" className="text-violet hover:text-violet-dark no-underline">0785 598 779</a>.
              Vom răspunde solicitării în termen de 30 de zile conform GDPR.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              5. Cookie-uri
            </h2>
            <p className="mb-3">
              theHILL.ro folosește două categorii de cookie-uri:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-foreground">Esențiale</strong> — necesare pentru
                funcționarea site-ului (navigare, preferințe). Nu necesită consimțământ.
              </li>
              <li>
                <strong className="text-foreground">Analitice</strong> — pentru a înțelege cum
                folosiți site-ul și a-l îmbunătăți. Sunt activate doar cu consimțământul
                dumneavoastră.
              </li>
            </ul>
            <p className="mt-3">
              Puteți modifica oricând preferința din setările browserului sau ștergând cookie-urile
              stocate. Consimțământul este salvat local în browser-ul dumneavoastră.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              6. Securitate
            </h2>
            <p>
              theHILL.ro nu stochează date personale în baze de date proprii. Site-ul este static —
              conținutul este generat din fișiere JSON publice. Nu există conturi de utilizator
              și nu se procesează plăți.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              7. Contact
            </h2>
            <p>
              Pentru orice întrebare legată de confidențialitate, GDPR sau date afișate:
            </p>
            <ul className="list-none space-y-1 mt-2">
              <li>Email: <a href="mailto:contact@forsite.ro" className="text-violet hover:text-violet-dark no-underline">contact@forsite.ro</a></li>
              <li>Telefon: <a href="tel:0785598779" className="text-violet hover:text-violet-dark no-underline">0785 598 779</a></li>
              <li>Formular: <Link href="/contact" className="text-violet hover:text-violet-dark no-underline">/contact</Link></li>
            </ul>
          </section>

          <section className="text-xs text-muted pt-4 border-t border-white/5">
            <p>Ultima actualizare: septembrie 2025</p>
          </section>
        </div>
      </div>
    </div>
  );
}
