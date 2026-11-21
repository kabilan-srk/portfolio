import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(__dirname, '..', '..');

function rootTokens() {
  const css = readFileSync(join(SRC, 'index.css'), 'utf8');
  const root = css.match(/:root\s*{([^}]*)}/)[1];
  const tokens = {};
  for (const m of root.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) tokens[m[1]] = m[2].trim();
  return tokens;
}

function luminance(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function files(dir) {
  return readdirSync(dir).flatMap(name => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === '__tests__' || name === 'assets' ? [] : files(p);
    return /\.(jsx?|css)$/.test(name) ? [p] : [];
  });
}

describe('palette tokens', () => {
  const t = rootTokens();

  it.each(['text-primary', 'text-muted', 'accent'])('%s has contrast >= 4.5 on bg-primary', name => {
    expect(contrast(t[name], t['bg-primary'])).toBeGreaterThanOrEqual(4.5);
  });

  it('uses the amber-on-charcoal palette', () => {
    expect(t['bg-primary'].toLowerCase()).toBe('#15171a');
    expect(t['accent'].toLowerCase()).toBe('#ffb000');
    expect(t['accent-2'].toLowerCase()).toBe('#ff7a1a');
  });

  it('has no hardcoded red left in source', () => {
    const offenders = files(SRC).filter(f => /rgba\(255, ?0, ?0|#ff0000/i.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });
});
