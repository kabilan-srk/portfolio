// Latest commit of a public GitHub repo, cached in sessionStorage for 5 minutes.
import { useState, useEffect } from 'react';

const TTL_MS = 5 * 60 * 1000;

export async function fetchLastCommit(repo) {
  const key = `commit:${repo}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (cached && Date.now() - cached.at < TTL_MS) return cached.data;
  } catch { /* storage unavailable */ }

  const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`github ${res.status}`);
  const list = await res.json();
  const first = Array.isArray(list) ? list[0] : null;
  if (!first?.sha || !first?.commit?.committer?.date) throw new Error('github: no commits');
  const data = { sha: first.sha, date: first.commit.committer.date };
  try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data })); } catch { /* ignore */ }
  return data;
}

export function useLastCommit(repo) {
  const [commit, setCommit] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    fetchLastCommit(repo).then(d => alive && setCommit(d)).catch(() => alive && setError(true));
    return () => { alive = false; };
  }, [repo]);
  return { commit, error };
}
