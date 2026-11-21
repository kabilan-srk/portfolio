import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIssueStatus, deriveStatus, timeAgo } from '../lib/issueStatus';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const TONES = {
  live: { color: 'var(--status-live)', border: 'rgba(34,197,94,0.35)', dot: 'status-dot--live' },
  pending: { color: '#f59e0b', border: 'rgba(245,158,11,0.4)', dot: '' },
  closed: { color: 'var(--text-muted)', border: 'var(--border)', dot: '' },
};

function StatusBadge({ project }) {
  const { issue } = useIssueStatus(project.statusSource);
  const live = issue ? deriveStatus(issue) : null;
  const label = live?.label || project.badge || 'LIVE';
  const tone = TONES[live?.tone || (project.badge ? 'pending' : 'live')];
  return (
    <div style={{
      position: 'absolute', top: '10px', right: '10px',
      display: 'flex', alignItems: 'center', gap: '0.35rem',
      fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em',
      color: tone.color, border: `1px solid ${tone.border}`,
      padding: '0.25rem 0.55rem', backgroundColor: 'rgba(13,15,20,0.8)',
      backdropFilter: 'blur(4px)'
    }}>
      <span className={`status-dot ${tone.dot}`} style={{ width: '6px', height: '6px', backgroundColor: tone.dot ? undefined : tone.color }} />
      {label}
    </div>
  );
}

function IssueMeta({ project }) {
  const { issue, error } = useIssueStatus(project.statusSource);
  if (!project.statusSource) return null;
  const { repo, issue: num } = project.statusSource;
  let text = `${repo.split('/')[1]} #${num} · checking...`;
  if (error) text = `${repo.split('/')[1]} #${num} · status unavailable`;
  if (issue) text = `#${num} ${issue.state.toUpperCase()} · ${issue.comments} COMMENTS · UPDATED ${timeAgo(issue.updated_at).toUpperCase()}`;
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.06em', color: 'var(--text-faint)' }}>
      {text}
    </div>
  );
}

export default function Projects({ projects }) {
  return (
    <section id="projects" style={{
      minHeight: '60vh',
      padding: '5rem 2rem',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">WORK</div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem'
          }}>
            [PROJECTS]
          </h2>
          <div style={{
            width: '40px', height: '3px',
            backgroundColor: 'var(--accent)',
            marginBottom: '3rem'
          }} />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              className="project-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              style={{
                border: '1px solid var(--border)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      filter: 'grayscale(80%) contrast(1.15)',
                      display: 'block',
                      transition: 'filter 0.3s ease'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.12em'
                  }}>
                    {'</> OPEN SOURCE'}
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 40%, rgba(13,15,20,0.85) 100%)'
                }} />

                <StatusBadge project={project} />
              </div>

              {/* Content */}
              <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em'
                }}>
                  {project.name}
                </h3>

                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  flex: 1
                }}>
                  {project.description}
                </p>

                <IssueMeta project={project} />

                {/* Tech tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {project.technologies.map((tech, i) => (
                    <span key={i} style={{
                      border: '1px solid var(--border)',
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.06em',
                      backgroundColor: 'var(--bg-tertiary)'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      backgroundColor: 'var(--accent)',
                      color: '#000',
                      padding: '0.55rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      textDecoration: 'none',
                      letterSpacing: '0.08em',
                      transition: 'box-shadow 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--accent-glow)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <ExternalLink size={12} />
                    {project.liveLabel || '[OPEN]'}
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)',
                      padding: '0.55rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      textDecoration: 'none',
                      letterSpacing: '0.08em',
                      transition: 'border-color 0.2s, color 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--border-accent)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    <Github size={12} />
                    [CODE]
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
