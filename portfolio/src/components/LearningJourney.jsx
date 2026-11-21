import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function LearningJourney({ learning }) {
  return (
    <section id="learning" style={{
      padding: '1.75rem',
      backgroundColor: 'transparent'
    }}>
      <div style={{ maxWidth: 'none', margin: '0 auto' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">GROWTH</div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem'
          }}>
            [LEARNING JOURNEY]
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            building in public — studying now and what comes next
          </p>
          <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--accent)', marginBottom: '1.5rem' }} />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Currently Learning */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            transition={{ duration: 0.45 }}
            style={{
              border: '1px solid rgba(34,197,94,0.25)',
              backgroundColor: 'var(--bg-primary)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--status-live)'
            }}>
              <span className="status-dot status-dot--live" />
              CURRENTLY LEARNING
            </div>

            {learning.current.map((item, idx) => (
              <div key={idx} style={{
                paddingBottom: '0.9rem',
                borderBottom: idx < learning.current.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.25rem'
                }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: 'var(--status-live)',
                    border: '1px solid rgba(34,197,94,0.3)',
                    padding: '0.1rem 0.4rem',
                    backgroundColor: 'rgba(34,197,94,0.08)'
                  }}>
                    ACTIVE
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  {item.topic}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--text-faint)', marginRight: '0.3rem' }}>$ ref:</span>
                  {item.resource}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Planned */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            transition={{ duration: 0.45, delay: 0.1 }}
            style={{
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-primary)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--status-plan)'
            }}>
              <span className="status-dot status-dot--plan" />
              QUEUED
            </div>

            {learning.planned.map((item, idx) => (
              <div key={idx} style={{
                paddingBottom: '0.9rem',
                borderBottom: idx < learning.planned.length - 1 ? '1px solid var(--border)' : 'none',
                opacity: 0.75
              }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: 'var(--status-plan)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    padding: '0.1rem 0.4rem',
                    backgroundColor: 'rgba(245,158,11,0.08)'
                  }}>
                    QUEUED
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  {item.topic}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                  <span style={{ marginRight: '0.3rem' }}>$ ref:</span>
                  {item.resource}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes lj-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
