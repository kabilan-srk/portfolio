import { describe, it, expect } from 'vitest';
import { describeSignals } from '../statusSignals';
import { getBuildInfo } from '../buildInfo';

const byId = (signals, id) => signals.find(s => s.id === id);
const COMMIT = { sha: 'abc1234def5678', date: '2026-11-21T10:00:00Z' };
const BUILD = { sha: 'abc1234def5678', date: '2026-11-21' };

describe('describeSignals', () => {
  it('always returns hosting, commit, build in that order', () => {
    const s = describeSignals({});
    expect(s.map(x => x.id)).toEqual(['hosting', 'commit', 'build']);
  });

  it('shows an open issue as HOSTING REQUESTED with tone warn', () => {
    const h = byId(describeSignals({ issue: { state: 'open', state_reason: null } }), 'hosting');
    expect(h).toMatchObject({ value: 'HOSTING REQUESTED', tone: 'warn' });
  });

  it('shows a completed issue as HOSTED with tone ok', () => {
    const h = byId(describeSignals({ issue: { state: 'closed', state_reason: 'completed' } }), 'hosting');
    expect(h).toMatchObject({ value: 'HOSTED', tone: 'ok' });
  });

  it('shows unavailable with tone unknown when the issue fetch failed', () => {
    const h = byId(describeSignals({ issueError: true }), 'hosting');
    expect(h).toMatchObject({ value: 'unavailable', tone: 'unknown' });
  });

  it('shows unavailable when the commit fetch failed or build info is missing', () => {
    const s = describeSignals({ commit: null, commitError: true, build: null });
    expect(byId(s, 'commit')).toMatchObject({ value: 'unavailable', tone: 'unknown' });
    expect(byId(s, 'build')).toMatchObject({ value: 'unavailable', tone: 'unknown' });
  });

  it('shows the short sha and date for a known build, and a relative age for the commit', () => {
    const s = describeSignals({ commit: COMMIT, build: BUILD });
    expect(byId(s, 'build').value).toBe('abc1234 · 2026-11-21');
    expect(byId(s, 'commit').value).toMatch(/ago$/);
  });

  it('never reports ok for a signal whose fetch errored', () => {
    const s = describeSignals({ issueError: true, commitError: true, build: null });
    expect(s.filter(x => x.tone === 'ok')).toEqual([]);
  });
});

describe('getBuildInfo', () => {
  it('returns null when build env vars are not set', () => {
    expect(getBuildInfo()).toBeNull();
  });
});
