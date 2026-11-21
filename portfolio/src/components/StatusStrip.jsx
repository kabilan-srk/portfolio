import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { useIssueStatus } from '../lib/issueStatus';
import { useLastCommit } from '../lib/repoStatus';
import { getBuildInfo } from '../lib/buildInfo';
import { describeSignals } from '../lib/statusSignals';

const TONE_COLOR = {
  ok: 'var(--status-live)',
  warn: 'var(--accent)',
  unknown: 'var(--text-muted)',
};

const REPO = 'kabilan-srk/portfolio';

export default function StatusStrip() {
  const { issue, error: issueError } = useIssueStatus(portfolioData.projects[0]?.statusSource);
  const { commit, error: commitError } = useLastCommit(REPO);
  const signals = describeSignals({ issue, issueError, commit, commitError, build: getBuildInfo() });

  return (
    <div
      aria-label="System status"
      style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.75rem 2rem', alignItems: 'center',
        padding: '0.9rem 1.25rem', border: '1px solid var(--border)',
        backgroundColor: 'var(--bg-secondary)', fontSize: '0.72rem', letterSpacing: '0.06em',
      }}
    >
      <span style={{ color: 'var(--text-faint)', fontWeight: 700 }}>STATUS</span>
      {signals.map(s => (
        <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: TONE_COLOR[s.tone] }} />
          <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
          <span style={{ color: TONE_COLOR[s.tone], fontWeight: 700 }}>{s.value}</span>
        </span>
      ))}
    </div>
  );
}
