import React, { useState } from 'react';
import { TerminalIcon, Menu, X } from 'lucide-react';

const NAV_SECTIONS = [
  { label: 'HOME',      id: 'home' },
  { label: 'EXP',       id: 'experience' },
  { label: 'PROJECTS',  id: 'projects' },
  { label: 'SKILLS',    id: 'skills' },
  { label: 'TOOLKIT',   id: 'sre-toolkit' },
  { label: 'LEARNING',  id: 'learning' },
  { label: 'CONTACT',   id: 'contact' }
];

export default function Navigation({ activeSection, scrollToSection, name, onToggleTerminal }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (id) => {
    scrollToSection(id);
    setMobileOpen(false);
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(13, 15, 20, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0.75rem 2rem',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Left: brand + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em'
          }}>
            {name.split(' ')[0]}<span style={{ color: 'var(--accent)' }}>.</span>SRK
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="status-dot status-dot--live" />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              ONLINE
            </span>
          </div>
        </div>

        {/* Desktop: section buttons + terminal toggle */}
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
          {NAV_SECTIONS.map(({ label, id }) => (
            <button
              key={id}
              data-nav-item="true"
              onClick={() => scrollToSection(id)}
              style={{
                background: activeSection === id ? 'var(--accent-dim)' : 'none',
                border: 'none',
                borderBottom: activeSection === id ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeSection === id ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.4rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                transition: 'color 0.2s, border-color 0.2s, background 0.2s'
              }}
              onMouseEnter={e => {
                if (activeSection !== id) e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                if (activeSection !== id) e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              [{label}]
            </button>
          ))}

          {/* Terminal toggle */}
          <button
            onClick={onToggleTerminal}
            title="Open terminal (Ctrl+`)"
            style={{
              background: 'var(--accent-dim)',
              border: '1px solid var(--border-accent)',
              color: 'var(--accent)',
              cursor: 'pointer',
              padding: '0.4rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'background 0.2s, box-shadow 0.2s',
              marginLeft: '0.5rem'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,0,0,0.2)';
              e.currentTarget.style.boxShadow = 'var(--accent-glow)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--accent-dim)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <TerminalIcon size={13} />
            &gt;_
          </button>
        </div>

        {/* Mobile: hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(o => !o)}
          style={{
            display: 'none',
            background: 'none',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            padding: '0.4rem',
            cursor: 'pointer'
          }}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: '53px',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(13, 15, 20, 0.98)',
          borderBottom: '1px solid var(--border)',
          zIndex: 999,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {NAV_SECTIONS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              style={{
                background: activeSection === id ? 'var(--accent-dim)' : 'none',
                border: 'none',
                borderLeft: activeSection === id ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeSection === id ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.6rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                textAlign: 'left'
              }}
            >
              [{label}]
            </button>
          ))}
          <button
            onClick={() => { onToggleTerminal(); setMobileOpen(false); }}
            style={{
              background: 'var(--accent-dim)',
              border: '1px solid var(--border-accent)',
              color: 'var(--accent)',
              cursor: 'pointer',
              padding: '0.6rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              textAlign: 'left',
              marginTop: '0.25rem'
            }}
          >
            [&gt;_ TERMINAL]
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
