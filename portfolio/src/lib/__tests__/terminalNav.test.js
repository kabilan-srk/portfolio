import { describe, it, expect, vi } from 'vitest';
import { runCommand } from '../terminalCommands';
import { portfolioData } from '../../data/portfolioData';

const run = (input, goTo = vi.fn(), exit = vi.fn()) => ({ lines: runCommand(input, portfolioData, goTo, exit), goTo, exit });

describe('runCommand navigation', () => {
  it('goto <alias> resolves the section and navigates', () => {
    const { goTo } = run('goto exp');
    expect(goTo).toHaveBeenCalledWith('experience');
  });

  it('goto toolkit navigates to skills', () => {
    const { goTo } = run('goto toolkit');
    expect(goTo).toHaveBeenCalledWith('skills');
  });

  it('goto <unknown> prints an error and does not navigate', () => {
    const { lines, goTo } = run('goto nope');
    expect(goTo).not.toHaveBeenCalled();
    expect(lines.some(l => l.type === 'error')).toBe(true);
  });

  it('open <unknown> prints an error and stays in the terminal', () => {
    const { lines, exit } = run('open nope');
    expect(lines.some(l => l.type === 'error')).toBe(true);
    expect(exit).not.toHaveBeenCalled();
  });

  it('exit and q call onExit', () => {
    const a = run('exit');
    const b = run('q');
    expect(a.exit).toHaveBeenCalledTimes(1);
    expect(b.exit).toHaveBeenCalledTimes(1);
  });
});
