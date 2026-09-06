import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream/80 px-6">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-6">🐝</div>
        <h1 className="font-display text-6xl font-bold text-green-dark mb-4">
          404
        </h1>
        <h2 className="font-display text-2xl font-bold text-green-dark mb-4">
          Ups! Pagina nu a fost găsită
        </h2>
        <p className="text-foreground/60 text-lg mb-8">
          Pare că ai rătăcit pe la noi. Hai să te ducem înapoi acasă!
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-green-light text-white text-sm font-bold uppercase tracking-wider no-underline transition-all hover:bg-green-dark rounded-full shadow-soft"
        >
          Înapoi la pagina principală →
        </Link>
      </div>
    </div>
  );
}
