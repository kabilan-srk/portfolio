import { describe, it, expect, vi } from 'vitest';
import { buildPaletteItems } from '../paletteItems';
import { SECTIONS } from '../sections';

const base = () => ({
  view: 'dashboard',
  goToSection: vi.fn(),
  toggleView: vi.fn(),
  resumeUrl: 'https://example.com/resume',
  projects: [],
  copyEmail: vi.fn(),
});

describe('buildPaletteItems', () => {
  it('builds the GO TO items from SECTIONS, in order', () => {
    const goTo = buildPaletteItems(base()).filter(i => i.group === 'GO TO');
    expect(goTo.map(i => i.id)).toEqual(SECTIONS.map(s => `go-${s.id}`));
  });

  it('navigates through goToSection so it works from the terminal view', () => {
    const args = base();
    const item = buildPaletteItems(args).find(i => i.id === 'go-projects');
    item.run();
    expect(args.goToSection).toHaveBeenCalledWith('projects');
  });

  it('labels the view toggle by the current view', () => {
    const a = buildPaletteItems({ ...base(), view: 'dashboard' }).find(i => i.id === 'view');
    const b = buildPaletteItems({ ...base(), view: 'terminal' }).find(i => i.id === 'view');
    expect(a.label).toBe('Switch to terminal view');
    expect(b.label).toBe('Switch to dashboard');
  });
});
