import { resolveRuntimeAssetUrl } from './assetPaths';

/**
 * Utility to trigger immediate in-browser download of the production zip package
 */
export async function downloadDistZip(): Promise<boolean> {
  const zipUrl = resolveRuntimeAssetUrl('/fakkerfeha-dist.zip');
  try {
    const res = await fetch(zipUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load zip');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fakkerfeha-dist.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    return true;
  } catch (err) {
    console.error('Direct blob download error:', err);
    // Fallback: direct window download trigger
    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = 'fakkerfeha-dist.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return false;
  }
}
