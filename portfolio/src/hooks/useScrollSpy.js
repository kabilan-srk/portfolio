// src/hooks/useScrollSpy.js
import { useState, useEffect } from 'react';
import { SECTIONS } from '../lib/sections';

const SECTION_IDS = SECTIONS.map(s => s.id);

export function useScrollSpy() {
  const [activeSection, setActiveSection] = useState(SECTION_IDS[0]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset

      for (const section of SECTION_IDS) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return activeSection;
}