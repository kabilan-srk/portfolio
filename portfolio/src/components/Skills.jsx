import React from 'react';
import { motion } from 'framer-motion';

export default function Skills({ skills }) {
  const tiers = skills.tiers.filter(t => t.items.length > 0);

  return (
    <section id="skills" style={{
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
          <div className="section-label">WHAT I USE · BY FREQUENCY</div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem'
          }}>
            [SKILLS]
          </h2>
          <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--accent)', marginBottom: '1.5rem' }} />
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {tiers.map((tier, i) => {
            const accent = tier.id === 'daily';
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  border: accent ? '1px solid var(--border-accent)' : '1px solid var(--border)',
                  padding: '1.4rem 1.6rem',
                  backgroundColor: accent ? 'var(--accent-dim)' : 'var(--bg-primary)'
                }}
              >
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: accent ? 'var(--accent)' : 'var(--text-faint)',
                  marginBottom: '1.2rem'
                }}>
                  {tier.label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {tier.items.map(item => (
                    <span
                      key={item}
                      style={{
                        border: accent ? '1px solid var(--border-accent)' : '1px solid var(--border)',
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: accent ? 'var(--accent)' : 'var(--text-muted)'
                      }}
                    >
                      {item}
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
