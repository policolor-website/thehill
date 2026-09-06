"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto card-navy p-5 md:p-6 shadow-2xl border-violet/20">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-foreground mb-1">
              Confidențialitate & Cookies
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              Folosim cookie-uri esențiale pentru funcționarea site-ului și analitică pentru a
              îmbunătăți experiența. Datele despre jucători juniori provin din surse publice FRF /
              HaiLaFotbal.ro. Află mai multe în{" "}
              <Link href="/confidentialitate" className="text-violet hover:text-violet-dark no-underline">
                Politica de confidențialitate
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <button
              onClick={decline}
              className="px-4 py-2.5 rounded-lg border border-white/10 text-muted text-sm font-semibold hover:bg-navy-light transition-colors"
            >
              Doar esențiale
            </button>
            <button
              onClick={accept}
              className="px-5 py-2.5 rounded-lg bg-violet text-white text-sm font-semibold hover:bg-violet-dark transition-colors"
            >
              Accept toate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
