/* global process */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const css = readFileSync(join(process.cwd(), 'src', 'index.css'), 'utf8');

function reducedMotionBlocks() {
  return [...css.matchAll(/@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/g)].map(m => m[1]).join('\n');
}

describe('reduced motion', () => {
  it('keeps the hero text visible when animations are disabled', () => {
    const block = reducedMotionBlocks();
    for (const cls of ['.hero-line-1', '.hero-line-2', '.hero-line-3']) {
      expect(block).toContain(cls);
    }
    expect(block).toMatch(/opacity:\s*1\s*!important/);
  });
});

describe('anchor scrolling', () => {
  it('offsets section anchors so headings clear the fixed nav', () => {
    expect(css).toMatch(/section\[id\]\s*\{[^}]*scroll-margin-top:\s*4\.5rem/);
  });
});
