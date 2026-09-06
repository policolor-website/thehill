import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "/", lastModified: new Date(), priority: 1 },
    { url: "/jucatori", lastModified: new Date(), priority: 0.9 },
    { url: "/echipe-nationale", lastModified: new Date(), priority: 0.85 },
    { url: "/cluburi", lastModified: new Date(), priority: 0.8 },
    { url: "/club", lastModified: new Date(), priority: 0.75 },
    { url: "/meciuri", lastModified: new Date(), priority: 0.7 },
    { url: "/despre", lastModified: new Date(), priority: 0.5 },
    { url: "/contact", lastModified: new Date(), priority: 0.5 },
    { url: "/confidentialitate", lastModified: new Date(), priority: 0.3 },
  ];
}
