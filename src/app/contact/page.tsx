"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputClass =
    "w-full bg-navy-light border border-white/10 rounded-lg px-4 py-3 text-foreground text-base placeholder:text-muted/60 focus:outline-none focus:border-violet transition-colors";

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <span className="text-violet text-xs font-semibold uppercase tracking-[0.25em]">
          Contact
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-8">
          <span className="text-gradient">Ia legătura cu noi</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Date contact */}
          <div className="space-y-6">
            <p className="text-muted font-light leading-relaxed text-lg">
              Ai o întrebare, o sugestie sau vrei să colaborăm? Scrie-ne sau
              sună-ne direct. Răspundem cât mai repede posibil.
            </p>

            <a
              href="tel:0785598779"
              className="card-navy p-6 flex items-center gap-4 no-underline hover:border-violet/40 transition-colors group"
            >
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-muted text-xs uppercase tracking-wider mb-1">
                  Telefon
                </p>
                <p className="text-foreground text-lg font-semibold group-hover:text-violet transition-colors">
                  0785 598 779
                </p>
              </div>
            </a>

            <a
              href="mailto:contact@thehill.ro"
              className="card-navy p-6 flex items-center gap-4 no-underline hover:border-violet/40 transition-colors group"
            >
              <span className="text-2xl">✉️</span>
              <div>
                <p className="text-muted text-xs uppercase tracking-wider mb-1">
                  Email
                </p>
                <p className="text-foreground text-lg font-semibold group-hover:text-violet transition-colors">
                  contact@thehill.ro
                </p>
              </div>
            </a>
          </div>

          {/* Formular */}
          <div className="card-navy p-6 md:p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <span className="text-4xl mb-4">✅</span>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                  Mesaj trimis!
                </h2>
                <p className="text-muted">
                  Mulțumim pentru mesaj. Te vom contacta în cel mai scurt timp.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-6 px-6 py-2.5 bg-violet text-white text-sm font-bold tracking-wide rounded-full hover:bg-violet-dark transition-colors"
                >
                  Trimite alt mesaj
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-muted text-sm mb-2"
                  >
                    Nume
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Numele tău"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-muted text-sm mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@exemplu.ro"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-muted text-sm mb-2"
                  >
                    Subiect
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Subiectul mesajului"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-muted text-sm mb-2"
                  >
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Scrie mesajul tău aici..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3.5 bg-violet text-white text-sm font-bold tracking-wide rounded-full hover:bg-violet-dark transition-colors"
                >
                  Trimite mesajul
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
