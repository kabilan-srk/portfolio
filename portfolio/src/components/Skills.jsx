import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LANES = [
  {
    id: 'lane01',
    label: 'LANE 01 — PLATFORM & INFRA',
    keys: ['LINUX', 'DOCKER'],
  },
  {
    id: 'lane02',
    label: 'LANE 02 — CLOUD & ORCHESTRATION',
    keys: ['GCP', 'KUBERNETES', 'HELM'],
  },
  {
    id: 'lane03',
    label: 'LANE 03 — AUTOMATION & DELIVERY',
    keys: ['JENKINS', 'TERRAFORM'],
  },
];

function SkillBar({ skill, inView }) {
  return (
    <div style={{ flex: '1 1 180px', minWidth: '160px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {skill.name}
          </span>
          {skill.level < 30 && (
            <span style={{
              fontSize: '0.58rem',
              fontWeight: 700,
              color: 'var(--accent)',
              border: '1px solid var(--border-accent)',
              padding: '0 0.3rem',
              letterSpacing: '0.06em'
            }}>
              LEARNING
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{skill.level}%</span>
      </div>
      <div style={{
        height: '6px',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '3px',
        overflow: 'hidden',
        border: '1px solid var(--border)'
      }}>
        <div style={{
          height: '100%',
          width: inView ? `${skill.level}%` : '0%',
          backgroundColor: skill.level < 30 ? 'rgba(255,176,0,0.45)' : 'var(--accent)',
          transition: 'width 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '3px',
          boxShadow: skill.level >= 30 ? '0 0 8px rgba(255,176,0,0.4)' : 'none'
        }} />
      </div>
    </div>
  );
}

export default function Skills({ skills }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const skillMap = {};
  skills.sre.forEach(s => { skillMap[s.name] = s; });

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
          <div className="section-label">CAPABILITY · SELF-RATED</div>
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

        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {LANES.map((lane, li) => {
            const laneSkills = lane.keys
              .map(k => skillMap[k])
              .filter(Boolean);
            const otherSkills = li === 0
              ? skills.sre.filter(s => !['LINUX','DOCKER','GCP','KUBERNETES','HELM','JENKINS','TERRAFORM'].includes(s.name))
              : [];
            const allSkills = [...laneSkills, ...otherSkills];

            if (allSkills.length === 0) return null;
            return (
              <motion.div
                key={lane.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: li * 0.1 }}
                style={{
                  border: '1px solid var(--border)',
                  padding: '1.4rem 1.6rem',
                  backgroundColor: 'var(--bg-primary)'
                }}
              >
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'var(--text-faint)',
                  marginBottom: '1.2rem'
                }}>
                  {lane.label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem 2.5rem' }}>
                  {allSkills.map(skill => (
                    <SkillBar key={skill.name} skill={skill} inView={inView} />
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
