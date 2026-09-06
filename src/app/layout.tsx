import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theHILL.ro"),
  title: {
    default: "theHILL.ro — Platformă Scouting Fotbal Juniori România",
    template: "%s | theHILL.ro",
  },
  description:
    "theHILL.ro — platformă scouting fotbal pentru juniori din România. Caută jucători după vârstă, poziție, județ, club sau academie. Date din FRF și HaiLaFotbal.",
  keywords: [
    "scouting fotbal România",
    "juniori fotbal România",
    "academii fotbal",
    "jucători juniori",
    "FRF",
    "HaiLaFotbal",
    "theHILL",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "theHILL.ro",
    title: "theHILL.ro — Platformă Scouting Fotbal Juniori România",
    description:
      "Caută jucători juniori din România după vârstă, poziție, județ, club sau academie.",
    url: "https://theHILL.ro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <div className="relative z-10">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
