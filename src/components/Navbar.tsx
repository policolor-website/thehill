"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Acasă" },
  { href: "/jucatori", label: "Jucători" },
  { href: "/cluburi", label: "Cluburi" },
  { href: "/meciuri", label: "Meciuri" },
  { href: "/despre", label: "Despre" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const linkClass = (active: boolean) =>
    `text-sm font-semibold tracking-wide no-underline transition-colors ${
      active ? "text-violet" : "text-foreground hover:text-violet"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-2 bg-navy/80 backdrop-blur-md border-b border-white/5"
          : "py-4 bg-navy/50 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" onClick={closeMobile} className="no-underline flex items-center gap-1">
          <span className="text-xl font-display font-bold text-gradient">the</span>
          <span className="text-xl font-display font-bold text-foreground">HILL</span>
          <span className="text-xl font-display font-bold text-foreground">.ro</span>
        </Link>

        <ul className="hidden md:flex gap-8 list-none items-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={linkClass(pathname === link.href)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/jucatori"
          className="hidden md:inline-block px-6 py-2.5 bg-violet text-white text-sm font-bold tracking-wide no-underline transition-all hover:bg-violet-dark rounded-full"
        >
          Caută jucători
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-0 cursor-pointer"
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-navy border-t border-white/5">
          <div className="px-6 py-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={`py-3 text-base font-semibold no-underline ${
                  pathname === link.href ? "text-violet" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/jucatori"
              onClick={closeMobile}
              className="mt-4 px-6 py-3 bg-violet text-white text-sm font-bold tracking-wide no-underline text-center rounded-full"
            >
              Caută jucători
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
