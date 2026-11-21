import React from 'react';
import { motion } from 'framer-motion';

const BUCKET_ITEMS = [
  { id: 1, title: 'Ride Every Train in India',   description: 'Explore India through every railway route',       status: 'pending' },
  { id: 2, title: 'Travel in Flight Atleast Once', description: 'Fly as high as the dreams',                      status: 'pending' },
  { id: 3, title: 'Surprise My Parents',           description: 'Plan and gift them an unforgettable moment',     status: 'pending' },
  { id: 4, title: 'Own My Dream Ride',             description: 'Buy my dream car and bike',                      status: 'pending' },
  { id: 5, title: 'Chase the Northern Lights',     description: 'Witness Aurora Borealis live',                   status: 'pending' },
  { id: 6, title: 'Touch My First Snowfall',       description: 'Experience snow for the first time',             status: 'pending' },
  { id: 7, title: 'Create a Legacy Project',       description: 'Build something that lives beyond me',           status: 'pending' },
];

const STATUS_STYLE = {
  done:    { color: 'var(--status-live)', border: 'rgba(34,197,94,0.35)',    bg: 'rgba(34,197,94,0.08)',  label: '[DONE]' },
  pending: { color: 'var(--accent)',      border: 'var(--border-accent)',    bg: 'var(--accent-dim)',     label: '[PENDING]' },
};

export default function BucketList() {
  return (
    <section id="bucket-list" style={{
      padding: '5rem 2rem',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">LIFE</div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem'
          }}>
            [BUCKET LIST]
          </h2>
          <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--accent)', marginBottom: '3rem' }} />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem'
        }}>
          {BUCKET_ITEMS.map((item, idx) => {
            const style = STATUS_STYLE[item.status] || STATUS_STYLE.pending;
            return (
              <motion.div
                key={item.id}
                className="bucket-card glass"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                style={{
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '1.3rem 1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <h3 style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.4
                  }}>
                    {item.title}
                  </h3>
                  <span style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: style.color,
                    border: `1px solid ${style.border}`,
                    backgroundColor: style.bg,
                    padding: '0.2rem 0.5rem',
                    flexShrink: 0
                  }}>
                    {style.label}
                  </span>
                </div>
                <p style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5
                }}>
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
