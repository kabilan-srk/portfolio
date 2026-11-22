import { describe, it, expect, vi } from 'vitest';
import { runCommand } from '../terminalCommands';
import { portfolioData } from '../../data/portfolioData';

const tiers = portfolioData.skills.tiers;

describe('skills tiers data', () => {
  it('tiers are daily, work, learning in order', () => {
    expect(tiers.map(t => [t.id, t.label])).toEqual([
      ['daily', 'DAILY'],
      ['work', 'USED AT WORK'],
      ['learning', 'LEARNING']
    ]);
  });

  it('tier members match the approved lists', () => {
    expect(tiers[0].items).toEqual(['GCP', 'CLOUD LOGGING', 'CLOUD MONITORING', 'IAM']);
    expect(tiers[1].items).toEqual(['JENKINS', 'RUNDECK', 'ATLANTIS', 'HELM', 'KUBERNETES', 'SNOWFLAKE', 'MONGODB ATLAS', 'MAKE']);
    expect(tiers[2].items).toEqual(['TERRAFORM', 'DOCKER', 'PYTHON', 'BASH', 'JAVASCRIPT', 'GITHUB ACTIONS']);
  });

  it('no tool appears in two tiers', () => {
    const all = tiers.flatMap(t => t.items);
    expect(new Set(all).size).toBe(all.length);
  });

  it('old toolkit data and numeric levels are gone', () => {
    expect(portfolioData.sreToolkit).toBeUndefined();
    expect(portfolioData.skills.sre).toBeUndefined();
  });
});

describe('skills command', () => {
  it('prints each tier and no percentages', () => {
    const text = runCommand('skills', portfolioData, vi.fn(), vi.fn()).map(l => l.text).join('\n');
    expect(text).toContain('DAILY');
    expect(text).toContain('GCP');
    expect(text).toContain('LEARNING');
    expect(text).toContain('TERRAFORM');
    expect(text).not.toMatch(/%/);
  });
});
