import React, { useState, useEffect } from 'react';
import { resolveRuntimeAssetUrl, loadEmbeddedFallbackForAsset } from '../../utils/assetPaths';

interface SafeCipherImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
}

/**
 * Renders game artwork using resolved static URLs (./images/...) in Web & Capacitor,
 * with automatic on-demand fallback to embedded sRGB data URIs if static loading ever fails.
 */
export const SafeCipherImage: React.FC<SafeCipherImageProps> = ({
  src,
  alt = '',
  onError,
  ...rest
}) => {
  const resolvedPrimary = resolveRuntimeAssetUrl(src);
  const [activeSrc, setActiveSrc] = useState<string>(resolvedPrimary);

  useEffect(() => {
    setActiveSrc(resolveRuntimeAssetUrl(src));
  }, [src]);

  const handleImageError = async (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!activeSrc.startsWith('data:')) {
      const fallback = await loadEmbeddedFallbackForAsset(src);
      if (fallback && activeSrc !== fallback) {
        setActiveSrc(fallback);
        return;
      }
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      {...rest}
      src={activeSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={handleImageError}
    />
  );
};
