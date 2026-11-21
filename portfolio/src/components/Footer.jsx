import React from 'react';
import { Github, Mail, Server } from 'lucide-react';

export default function Footer({ name }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '2rem',
      backgroundColor: 'var(--bg-secondary)'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Status bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <a
            href="https://status.kabilansrk.me"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://uptime.betterstack.com/status-badges/v3/monitor/2nbvr.svg"
              alt="Better Stack uptime badge"
            />
          </a>
        </div>

        {/* Social links */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          marginBottom: '1.2rem'
        }}>
          <a
            href="https://github.com/KABILANSRK"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Github size={20} />
          </a>
          <a
            href="mailto:kabilans.26csb@licet.ac.in"
            style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Mail size={20} />
          </a>
          <a
            href="https://api.kabilansrk.me"
            target="_blank"
            rel="noopener noreferrer"
            title="SRE Utilities API"
            style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Server size={20} />
          </a>
        </div>

        <p style={{
          fontSize: '0.7rem',
          color: 'var(--text-faint)',
          textAlign: 'center',
          letterSpacing: '0.08em'
        }}>
          © 2025 {name}
        </p>
      </div>
    </footer>
  );
}
