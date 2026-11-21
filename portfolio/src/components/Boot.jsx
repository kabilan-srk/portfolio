import React, { useEffect, useRef, useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import { useIssueStatus } from '../lib/issueStatus';
import { buildBootLines } from '../lib/bootLines';

const LINE_MS = 350;
const MAX_MS = 2000;

export default function Boot({ onDone }) {
  const { issue, error } = useIssueStatus(portfolioData.projects[0]?.statusSource);
  const lines = buildBootLines({ issue, issueError: error });
  const [shown, setShown] = useState(1);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    const step = setInterval(() => setShown(n => Math.min(n + 1, 4)), LINE_MS);
    const cap = setTimeout(finish, MAX_MS);
    window.addEventListener('keydown', finish);
    return () => {
      clearInterval(step);
      clearTimeout(cap);
      window.removeEventListener('keydown', finish);
    };
    // finish is stable for the lifetime of this component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={finish}
      style={{
        position: 'fixed', inset: 0, zIndex: 10001, cursor: 'pointer',
        backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 clamp(1.5rem, 8vw, 6rem)',
      }}
    >
      {lines.slice(0, shown).map((line, i) => (
        <div key={i} style={{ marginBottom: '0.3rem' }}>
          <span style={{ color: 'var(--accent)' }}>[ boot ]</span> {line}
        </div>
      ))}
      <span className="cursor" style={{ color: 'var(--accent)', animation: 'blink 1s step-end infinite' }}>&#9608;</span>
      <div style={{ marginTop: '1.5rem', color: 'var(--text-faint)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
        PRESS ANY KEY OR CLICK TO SKIP
      </div>
    </div>
  );
}
