// src/hooks/useScrollSpy.js
import { useState, useEffect } from 'react';
import { SECTIONS } from '../lib/sections';

const SECTION_IDS = SECTIONS.map(s => s.id);

// Active section = the one with the most pixels inside the viewport (works for side-by-side bento panels).
export function useScrollSpy() {
  const [activeSection, setActiveSection] = useState(SECTION_IDS[0]);

  useEffect(() => {
    const handleScroll = () => {
      let best = null;
      let bestVisible = 0;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
        if (visible > bestVisible) { best = id; bestVisible = visible; }
      }
      if (best) setActiveSection(best);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return activeSection;
}
