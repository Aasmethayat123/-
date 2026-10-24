import React, { useState, useEffect } from 'react';
import { resolveRuntimeAssetUrl, getEmbeddedFallbackForAsset } from '../../utils/assetPaths';

interface SafeCipherImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
}

/**
 * Renders game artwork using forced absolute static URLs (/images/...) in Web & Capacitor,
 * with automatic instant fallback to embedded sRGB data URIs if static loading fails.
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const fallback = getEmbeddedFallbackForAsset(src);
    if (fallback && activeSrc !== fallback) {
      setActiveSrc(fallback);
      return;
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
      decoding="async"
      onError={handleImageError}
    />
  );
};
