import { describe, it, expect } from 'vitest';
import { SECTIONS, resolveSection } from '../sections';

describe('SECTIONS', () => {
  it('lists the six nav sections in order', () => {
    expect(SECTIONS.map(s => s.id)).toEqual(['home', 'experience', 'projects', 'skills', 'learning', 'contact']);
  });
});

describe('resolveSection', () => {
  it('resolves aliases', () => {
    expect(resolveSection('exp')).toBe('experience');
    expect(resolveSection('toolkit')).toBe('skills');
    expect(resolveSection('sre-toolkit')).toBe('skills');
  });

  it('is case-insensitive and resolves labels', () => {
    expect(resolveSection('ABOUT')).toBe('home');
    expect(resolveSection('  Projects ')).toBe('projects');
  });

  it('returns null for unknown or empty input', () => {
    expect(resolveSection('nope')).toBeNull();
    expect(resolveSection('')).toBeNull();
  });
});
