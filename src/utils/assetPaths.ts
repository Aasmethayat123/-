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

const FALLBACK_KEY_BY_FILENAME: Record<
  string,
  'heroMap' | 'gardenDawn' | 'librarySecrets' | 'caveReflection'
> = {
  'nesma_cipher_hero_map_1792598958892.jpg': 'heroMap',
  'puzzle_garden_dawn_1792598959302.jpg': 'gardenDawn',
  'puzzle_library_secrets_1792598959558.jpg': 'librarySecrets',
  'puzzle_cave_reflection_1792598961556.jpg': 'caveReflection',
};

/**
 * Lazily loads the embedded sRGB data-URI fallback chunk ONLY when a static image fails to load,
 * keeping 869 KB of base64 data completely out of the initial JS bundle.
 */
export async function loadEmbeddedFallbackForAsset(src: string): Promise<string | null> {
  if (!src || src.startsWith('data:')) return null;
  for (const [filename, key] of Object.entries(FALLBACK_KEY_BY_FILENAME)) {
    if (src.includes(filename)) {
      try {
        const mod = await import('../data/cipherEmbeddedImages');
        return mod.EMBEDDED_CIPHER_IMAGES[key] || null;
      } catch {
        return null;
      }
    }
  }
  return null;
}
