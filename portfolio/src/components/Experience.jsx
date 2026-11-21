import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function Experience({ experience }) {
  return (
    <section id="experience" style={{
      minHeight: '100vh',
      padding: '5rem 2rem',
      backgroundColor: 'var(--bg-secondary)'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">CAREER</div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem'
          }}>
            [EXPERIENCE]
          </h2>
          <div style={{
            width: '40px',
            height: '3px',
            backgroundColor: 'var(--accent)',
            marginBottom: '3rem'
          }} />
        </motion.div>

        {/* Timeline */}
        <div style={{
          position: 'relative',
          paddingLeft: '1.5rem',
          borderLeft: '1px solid var(--border-accent)'
        }}>
          {experience.map((exp, idx) => {
            const isActive = exp.duration.toLowerCase().includes('present');
            return (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                style={{ position: 'relative', marginBottom: '2.5rem' }}
              >
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: '-2.15rem',
                  top: '1.6rem',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'var(--accent)' : 'var(--text-faint)',
                  border: '2px solid var(--bg-secondary)',
                  boxShadow: isActive ? '0 0 0 2px var(--border-accent)' : 'none',
                  animation: isActive ? 'pulse-red 2s ease-in-out infinite' : 'none'
                }} />

                <div className="experience-card" style={{
                  border: '1px solid var(--border)',
                  padding: '1.6rem 1.8rem',
                  backgroundColor: 'var(--bg-primary)',
                  position: 'relative',
                }}>
                  {/* Active badge */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: 'var(--status-live)',
                      border: '1px solid rgba(34,197,94,0.3)',
                      padding: '0.25rem 0.6rem',
                      backgroundColor: 'rgba(34,197,94,0.08)'
                    }}>
                      <span className="status-dot status-dot--live" style={{ width: '6px', height: '6px' }} />
                      ACTIVE
                    </div>
                  )}

                  {/* Category tag */}
                  <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'var(--accent)',
                    marginBottom: '0.6rem',
                    textTransform: 'uppercase'
                  }}>
                    [{exp.category}]
                  </div>

                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '0.3rem',
                    letterSpacing: '-0.02em'
                  }}>
                    {exp.organization}
                  </h3>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                      {exp.role}
                    </span>
                    <span style={{ color: 'var(--text-faint)', fontSize: '0.75rem' }}>|</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                      {exp.duration}
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                        paddingLeft: '1rem',
                        borderLeft: '2px solid var(--border)',
                        display: 'flex',
                        gap: '0.4rem'
                      }}>
                        <span style={{ color: 'var(--accent)', flexShrink: 0 }}>&gt;</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
