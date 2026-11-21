import React from 'react';
import { motion } from 'framer-motion';

const CATEGORY_CONFIG = {
  infrastructure: { label: '⎔  INFRASTRUCTURE', accent: true },
  observability:  { label: '◈  OBSERVABILITY',  accent: false },
  cicd:           { label: '⟳  CI / CD',         accent: false },
  languages:      { label: '⟨⟩ LANGUAGES',       accent: false },
  databases:      { label: '⊞  DATABASES',       accent: false }
};

const ORDERED_KEYS = ['infrastructure', 'observability', 'cicd', 'languages', 'databases'];

export default function SREToolkit({ sreToolkit }) {
  return (
    <section id="sre-toolkit" style={{
      padding: '1.75rem',
      backgroundColor: 'transparent'
    }}>
      <div style={{ maxWidth: 'none', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">TOOLING</div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem'
          }}>
            [SRE TOOLKIT]
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            tools i work with and am actively learning
          </p>
          <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--accent)', marginBottom: '1.5rem' }} />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          {ORDERED_KEYS.filter(k => sreToolkit[k]).map((key, idx) => {
            const config = CATEGORY_CONFIG[key] || { label: key.toUpperCase(), accent: false };
            const tools = sreToolkit[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                style={{
                  border: config.accent ? '1px solid var(--border-accent)' : '1px solid var(--border)',
                  padding: '1.2rem',
                  backgroundColor: config.accent ? 'var(--accent-dim)' : 'var(--bg-secondary)'
                }}
              >
                <div style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: config.accent ? 'var(--accent)' : 'var(--text-muted)',
                  marginBottom: '1rem'
                }}>
                  {config.label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {tools.map(tool => (
                    <span
                      key={tool}
                      style={{
                        border: config.accent ? '1px solid var(--border-accent)' : '1px solid var(--border)',
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: config.accent ? 'var(--accent)' : 'var(--text-muted)',
                        cursor: 'default',
                        transition: 'background 0.15s, color 0.15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--accent-dim)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = config.accent ? 'var(--accent)' : 'var(--text-muted)';
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
