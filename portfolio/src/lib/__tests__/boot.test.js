import { describe, it, expect, beforeEach } from 'vitest';
import { shouldShowBoot, markBootShown } from '../bootGate';
import { buildBootLines } from '../bootLines';

function throwingStorage() {
  return {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
  };
}

describe('bootGate', () => {
  beforeEach(() => sessionStorage.clear());

  it('shows the boot on the first visit and not after it was marked shown', () => {
    expect(shouldShowBoot({ storage: sessionStorage, reducedMotion: false })).toBe(true);
    markBootShown(sessionStorage);
    expect(shouldShowBoot({ storage: sessionStorage, reducedMotion: false })).toBe(false);
  });

  it('never shows the boot under reduced motion', () => {
    expect(shouldShowBoot({ storage: sessionStorage, reducedMotion: true })).toBe(false);
  });

  it('shows the boot and does not throw when storage is unavailable', () => {
    const bad = throwingStorage();
    expect(shouldShowBoot({ storage: bad, reducedMotion: false })).toBe(true);
    expect(() => markBootShown(bad)).not.toThrow();
  });
});

describe('buildBootLines', () => {
  it('reports unavailable on the hosting line when the fetch failed', () => {
    const lines = buildBootLines({ issueError: true });
    expect(lines.some(l => /hosting status/.test(l) && l.endsWith('unavailable'))).toBe(true);
  });

  it('includes the real hosting state when known', () => {
    const lines = buildBootLines({ issue: { state: 'open', state_reason: null } });
    expect(lines.some(l => l.includes('HOSTING REQUESTED'))).toBe(true);
  });

  it('never uses the word ok on any line', () => {
    const all = [
      ...buildBootLines({}),
      ...buildBootLines({ issueError: true }),
      ...buildBootLines({ issue: { state: 'closed', state_reason: 'completed' } }),
    ];
    expect(all.filter(l => /\bok\b/i.test(l))).toEqual([]);
  });
});
