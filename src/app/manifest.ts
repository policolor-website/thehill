import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mica and Kids — Grădiniță, Creșă & Afterschool Popești Leordeni",
    short_name: "Mica and Kids",
    description:
      "Grădiniță, creșă și afterschool în Popești Leordeni, Ilfov. Învățare prin joacă, natură și creativitate.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8E7",
    theme_color: "#4A7C59",
    lang: "ro-RO",
    icons: [
      {
        src: "/favicon.webp",
        sizes: "any",
        type: "image/webp",
      },
    ],
  };
}
