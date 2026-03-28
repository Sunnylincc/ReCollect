import React, { useState } from 'react';

interface ItemImageProps {
  name: string;
  /** Bundled local asset URL from ITEM_IMAGES, or null to force placeholder */
  imageUrl: string | null | undefined;
}

/**
 * Renders a grocery item image with a graceful fallback.
 * - Valid imageUrl → shows the image with white background and object-contain
 * - null/undefined or load error → light gray placeholder with item name centered
 * Never shows a broken-image icon.
 */
export function ItemImage({ name, imageUrl }: ItemImageProps) {
  const [errored, setErrored] = useState(false);

  if (!imageUrl || errored) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#dce8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          color: '#0d2260',
          fontSize: '13px',
          fontWeight: 600,
          textAlign: 'center',
          padding: '6px',
          lineHeight: 1.3,
        }}>
          {name}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      onError={() => setErrored(true)}
      style={{
        width: '100%',
        height: '100%',
        background: 'white',
        objectFit: 'contain',
        padding: '8px',
        display: 'block',
      }}
    />
  );
}
