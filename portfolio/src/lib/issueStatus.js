// Live status of a GitHub issue, cached in sessionStorage (unauthenticated API: 60 req/h/IP).
import { useState, useEffect } from 'react';

const TTL_MS = 5 * 60 * 1000;

export function deriveStatus(issue) {
  if (!issue) return { label: null, tone: 'pending' };
  if (issue.state === 'open') return { label: 'HOSTING REQUESTED', tone: 'pending' };
  if (issue.state_reason === 'completed') return { label: 'HOSTED', tone: 'live' };
  return { label: 'REQUEST CLOSED', tone: 'closed' };
}

export async function fetchIssue({ repo, issue }) {
  const key = `issue:${repo}#${issue}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (cached && Date.now() - cached.at < TTL_MS) return cached.data;
  } catch { /* storage unavailable */ }

  const res = await fetch(`https://api.github.com/repos/${repo}/issues/${issue}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`github ${res.status}`);
  const j = await res.json();
  if (!j || (j.state !== 'open' && j.state !== 'closed')) throw new Error('github: unexpected response');
  const data = {
    state: j.state,
    state_reason: j.state_reason,
    comments: j.comments,
    updated_at: j.updated_at,
    closed_at: j.closed_at,
  };
  try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data })); } catch { /* ignore */ }
  return data;
}

export function timeAgo(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function useIssueStatus(source) {
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!source) return;
    let alive = true;
    fetchIssue(source).then(d => alive && setIssue(d)).catch(() => alive && setError(true));
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source?.repo, source?.issue]);
  return { issue, error };
}
