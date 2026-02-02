/**
 * Base URL for public assets (empty in dev, /pilot-battery-shop on GitHub Pages).
 * Use this so images work both locally and when deployed to a subpath.
 */
export const publicUrl = process.env.PUBLIC_URL || "";

export const img = (path) => {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${publicUrl}${p}`;
};
