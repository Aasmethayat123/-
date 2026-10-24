import { EMBEDDED_CIPHER_IMAGES } from '../data/cipherEmbeddedImages';

/**
 * Normalizes any static asset reference into a clean path relative to index.html ("./..."),
 * matching Vite's `base: './'` configuration for Capacitor/Android WebView (`https://localhost`,
 * `capacitor://`, `file:///android_asset/...`) as well as web deployments.
 */
export function toAbsoluteAssetPath(rawPath: string): string {
  if (!rawPath) return './';
  const trimmed = rawPath.trim();

  // Preserve inline data/blob URIs and already-qualified external URLs
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }

  // Strip mangled relative or source-tree prefixes
  const cleanSubpath = trimmed
    .replace(/^(\.\/|\.\.\/)+/, '')
    .replace(/^\/?(public\/)+/, '')
    .replace(/^\/?(src\/assets\/)+/, '')
    .replace(/^\/+/, '')
    .replace(/\/{2,}/g, '/');

  return `./${cleanSubpath}`;
}

/**
 * Resolves a relative asset path ("./images/...") against the current document's index.html location
 * so it works identically on Web origins, Capacitor WebViews, and Android file:// asset loaders.
 */
export function resolveRuntimeAssetUrl(rawPath: string): string {
  const relPath = toAbsoluteAssetPath(rawPath);
  if (
    relPath.startsWith('data:') ||
    relPath.startsWith('blob:') ||
    relPath.startsWith('http://') ||
    relPath.startsWith('https://')
  ) {
    return relPath;
  }

  if (typeof window !== 'undefined') {
    const baseHref =
      (typeof document !== 'undefined' && document.baseURI) ||
      (window.location && window.location.href) ||
      '';
    if (baseHref) {
      try {
        return new URL(relPath, baseHref).href;
      } catch {
        return relPath;
      }
    }
  }

  return relPath;
}

const FALLBACK_BY_FILENAME: Record<string, string> = {
  'nesma_cipher_hero_map_1792598958892.jpg': EMBEDDED_CIPHER_IMAGES.heroMap,
  'puzzle_garden_dawn_1792598959302.jpg': EMBEDDED_CIPHER_IMAGES.gardenDawn,
  'puzzle_library_secrets_1792598959558.jpg': EMBEDDED_CIPHER_IMAGES.librarySecrets,
  'puzzle_cave_reflection_1792598961556.jpg': EMBEDDED_CIPHER_IMAGES.caveReflection,
};

/**
 * Returns an embedded sRGB data-URI fallback if a static image fails to load on mobile/offline.
 */
export function getEmbeddedFallbackForAsset(src: string): string | null {
  if (!src || src.startsWith('data:')) return null;
  for (const [filename, dataUri] of Object.entries(FALLBACK_BY_FILENAME)) {
    if (src.includes(filename)) {
      return dataUri;
    }
  }
  return null;
}
