'use client';

import { useEffect, useRef, useState } from 'react';
import type { Template } from '@/data/templates';

/**
 * Live thumbnail tile.
 *
 * Strategy:
 *  1. If `template.thumb` is set (a static PNG screenshot), use that — fast,
 *     accessible, perfect fidelity.
 *  2. Otherwise lazy-mount an <iframe> rendering the template's index.html
 *     scaled down with CSS transform, with `pointer-events:none` so the card
 *     remains clickable. Iframe is mounted only once it scrolls into view to
 *     avoid loading dozens of full pages on /templates.
 *  3. Behind it all sits the gradient as a loading placeholder + fallback.
 *
 * The aspect ratio is fixed by the parent (`aspect-[16/10]`).
 */
export default function TemplateThumb({
  template,
  className = '',
  /** Width of the simulated full-resolution viewport before scaling. */
  baseWidth = 1280,
  /** Height of the simulated full-resolution viewport before scaling. */
  baseHeight = 800,
}: {
  template: Template;
  className?: string;
  baseWidth?: number;
  baseHeight?: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);

  // IntersectionObserver: only mount the iframe when the tile is near the
  // viewport. Without this, /templates would spawn 10+ full-page iframes on
  // mount and burn the user's CPU.
  useEffect(() => {
    if (template.thumb) return; // static thumb — no iframe needed
    const el = wrapperRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldLoad(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [template.thumb]);

  // Static screenshot path
  if (template.thumb) {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{ background: template.gradient }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={template.thumb}
          alt={`${template.name} preview`}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Live iframe preview
  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden ${className}`}
      style={{ background: template.gradient }}
    >
      {/* Gradient placeholder until the iframe loads (or if it fails) */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: template.gradient,
          opacity: iframeLoaded && !iframeFailed ? 0 : 1,
        }}
      />

      {shouldLoad && !iframeFailed && (
        <div
          className="absolute inset-0 pointer-events-none"
          // The inner box is fixed at baseWidth x baseHeight and then scaled
          // down to fit the parent. transform-origin top-left so the page
          // starts at the corner, not the center.
          style={{
            width: baseWidth,
            height: baseHeight,
            transform: `scale(${Math.min(1, 1)})`,
            transformOrigin: 'top left',
          }}
          ref={(node) => {
            if (!node) return;
            const parent = node.parentElement;
            if (!parent) return;
            const fit = () => {
              const { width, height } = parent.getBoundingClientRect();
              const scale = Math.max(width / baseWidth, height / baseHeight);
              node.style.transform = `scale(${scale})`;
            };
            fit();
            // Re-fit on parent resize
            const ro = new ResizeObserver(fit);
            ro.observe(parent);
            // Cleanup on unmount via WeakMap-ish hack: store observer
            (node as unknown as { __ro?: ResizeObserver }).__ro = ro;
          }}
        >
          <iframe
            src={template.file}
            title={`${template.name} live preview`}
            className="border-0 bg-white"
            style={{ width: baseWidth, height: baseHeight }}
            loading="lazy"
            scrolling="no"
            onLoad={() => setIframeLoaded(true)}
            onError={() => setIframeFailed(true)}
            // Sandbox: allow scripts so the template renders, but no
            // top-level navigation, popups, or storage access.
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}
    </div>
  );
}
