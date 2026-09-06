import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "/", lastModified: new Date(), priority: 1 },
    { url: "/jucatori", lastModified: new Date(), priority: 0.9 },
    { url: "/cluburi", lastModified: new Date(), priority: 0.8 },
    { url: "/meciuri", lastModified: new Date(), priority: 0.7 },
    { url: "/despre", lastModified: new Date(), priority: 0.5 },
  ];
}
