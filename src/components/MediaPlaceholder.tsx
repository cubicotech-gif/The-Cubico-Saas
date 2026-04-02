'use client';

import { ImageIcon, Film } from 'lucide-react';

interface MediaPlaceholderProps {
  url?: string;
  type: 'image' | 'video';
  alt: string;
  hint: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function MediaPlaceholder({
  url,
  type,
  alt,
  hint,
  width,
  height,
  className = '',
}: MediaPlaceholderProps) {
  if (url && type === 'video') {
    return (
      <video
        src={url}
        autoPlay
        loop
        muted
        playsInline
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  if (url && type === 'image') {
    return (
      <img
        src={url}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  // Placeholder state
  const Icon = type === 'video' ? Film : ImageIcon;
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center bg-surface-800/50 border border-dashed border-surface-700 ${className}`}
    >
      <Icon size={28} className="text-surface-600 mb-2" />
      <p className="text-xs text-surface-500 font-body text-center px-4 max-w-[200px]">
        {hint}
      </p>
      {width && height && (
        <p className="text-[10px] text-surface-600 font-body mt-1">
          {width} x {height}px
        </p>
      )}
    </div>
  );
}
