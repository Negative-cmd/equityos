'use client';

import { useEffect, useRef } from 'react';

// A quiet, drifting mesh of light behind the terminal, plus a soft glow that
// follows the cursor. Pure CSS/DOM — no canvas or WebGL, so it stays cheap
// and never risks a build/runtime dependency failure.
export function AmbientField() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const el = spotRef.current;
      if (!el) return;
      el.style.setProperty('--spot-x', `${e.clientX}px`);
      el.style.setProperty('--spot-y', `${e.clientY}px`);
    }
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ambient-blob ambient-blob-a" />
      <div className="ambient-blob ambient-blob-b" />
      <div className="ambient-grid" />
      <div ref={spotRef} className="ambient-spot" />
    </div>
  );
}
