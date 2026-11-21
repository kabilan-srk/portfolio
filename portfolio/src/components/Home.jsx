import React from 'react';
import { Download, TerminalIcon, ChevronDown } from 'lucide-react';

export default function Home({ personal, onOpenTerminal }) {
  return (
    <>
      <section
        id="home"
        style={{
          minHeight: 'min(100vh, 760px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          paddingTop: '5rem',
          position: 'relative',
        }}
      >
        <div
          className="hero-grid"
          style={{
            maxWidth: '1100px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Left: command-prompt intro */}
          <div style={{ textAlign: 'left' }}>
            {/* Prompt line */}
            <div style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '1.2rem',
              letterSpacing: '0.05em'
            }}>
              <span style={{ color: 'var(--status-live)' }}>kabilan</span>
              <span style={{ color: 'var(--text-muted)' }}>@portfolio</span>
              <span style={{ color: 'var(--text-faint)' }}>:~$</span>
              <span className="hero-cmd"> whoami</span>
            </div>

            {/* Output lines */}
            <div className="hero-output" style={{ marginBottom: '2rem' }}>
              <div className="hero-line hero-line-1" style={{
                fontSize: 'clamp(2rem, 5vw, 3.8rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginBottom: '0.4rem',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}>
                {personal.name}
              </div>

              <div className="hero-line hero-line-2" style={{
                fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
                color: 'var(--accent)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}>
                {personal.title}
              </div>

              <div className="hero-line hero-line-3" style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                maxWidth: '440px',
              }}>
                <span style={{ color: 'var(--text-faint)', marginRight: '0.5rem' }}>&gt;</span>
                {personal.intro}
                <br />
                <span style={{ color: 'var(--text-faint)', marginRight: '0.5rem' }}>&gt;</span>
                {personal.subIntro}
              </div>
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href={personal.resumeUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--accent)',
                  color: '#000',
                  padding: '0.7rem 1.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  textDecoration: 'none',
                  letterSpacing: '0.08em',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = 'var(--accent-glow)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Download size={14} />
                [RESUME]
              </a>

              <button
                onClick={onOpenTerminal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--accent)',
                  padding: '0.7rem 1.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  border: '1px solid var(--border-accent)',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'background 0.2s, box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--accent-dim)';
                  e.currentTarget.style.boxShadow = 'var(--accent-glow)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <TerminalIcon size={14} />
                [&gt;_ TERMINAL]
              </button>
            </div>
          </div>

          {/* Right: photo with overlay effects */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              className="hero-photo-wrapper"
              style={{
                position: 'relative',
                maxWidth: '360px',
                width: '100%',
              }}
            >
              {/* Corner brackets */}
              <div className="corner-tl" style={{
                position: 'absolute', top: '-8px', left: '-8px',
                width: '28px', height: '28px',
                borderTop: '3px solid var(--accent)',
                borderLeft: '3px solid var(--accent)',
                zIndex: 2
              }} />
              <div className="corner-tr" style={{
                position: 'absolute', top: '-8px', right: '-8px',
                width: '28px', height: '28px',
                borderTop: '3px solid var(--accent)',
                borderRight: '3px solid var(--accent)',
                zIndex: 2
              }} />
              <div className="corner-bl" style={{
                position: 'absolute', bottom: '-8px', left: '-8px',
                width: '28px', height: '28px',
                borderBottom: '3px solid var(--accent)',
                borderLeft: '3px solid var(--accent)',
                zIndex: 2
              }} />
              <div className="corner-br" style={{
                position: 'absolute', bottom: '-8px', right: '-8px',
                width: '28px', height: '28px',
                borderBottom: '3px solid var(--accent)',
                borderRight: '3px solid var(--accent)',
                zIndex: 2
              }} />

              {/* Status badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 3,
                backgroundColor: 'rgba(13, 15, 20, 0.85)',
                border: '1px solid var(--border-accent)',
                padding: '0.3rem 0.6rem',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <span className="status-dot status-dot--live" style={{ width: '6px', height: '6px' }} />
                SRE @ KISSFLOW
              </div>

              {/* Photo container */}
              <div style={{
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-secondary)'
              }}>
                <img
                  src={personal.headshot}
                  alt="Kabilan SRK"
                  style={{
                    width: '100%',
                    display: 'block',
                    filter: 'grayscale(80%) contrast(1.2) brightness(0.9)',
                  }}
                />
                {/* Scan-line overlay */}
                <div className="scan-overlay" style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 50%, rgba(255,176,0,0.03) 50%)',
                  backgroundSize: '100% 4px',
                  pointerEvents: 'none',
                  opacity: 0.6
                }} />
                <div className="scan-line" style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,176,0,0.6), transparent)',
                  animation: 'scan-line 3s linear infinite',
                  pointerEvents: 'none'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'hero-bounce 2s infinite',
            color: 'var(--text-faint)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <ChevronDown size={20} color="var(--accent)" />
          <span>SCROLL</span>
        </div>
      </section>

      <style>{`
        @keyframes hero-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }

        .hero-cmd {
          color: var(--text-primary);
          animation: blink 0.8s step-end 3;
        }

        .hero-line-1 {
          animation: fade-up 0.5s ease forwards;
          opacity: 0;
        }
        .hero-line-2 {
          animation: fade-up 0.5s ease 0.15s forwards;
          opacity: 0;
        }
        .hero-line-3 {
          animation: fade-up 0.5s ease 0.3s forwards;
          opacity: 0;
        }

        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            text-align: center;
          }
          .hero-grid > div:first-child {
            order: 2;
          }
          .hero-grid > div:last-child {
            order: 1;
          }
          .hero-grid div[style*="align-items: center"] {
            justify-content: center;
          }
          .hero-line-2 {
            white-space: normal !important;
          }
          .hero-line-1 {
            white-space: normal !important;
            font-size: clamp(1.8rem, 8vw, 3rem) !important;
          }
        }

        @media (max-width: 480px) {
          #home {
            padding: 1.5rem 1rem;
            padding-top: 5rem;
          }
        }
      `}</style>
    </>
  );
}
