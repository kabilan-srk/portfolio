import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchIssue } from '../issueStatus';

const SRC = { repo: 'jenkins-infra/repository-permissions-updater', issue: 5450 };
const body = b => ({ ok: true, status: 200, json: async () => b });

describe('fetchIssue shape validation', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ['empty object', {}],
    ['GitHub error body', { message: 'Not Found' }],
    ['array', []],
    ['unknown state', { state: 'weird' }],
  ])('rejects a 200 response that is a %s', async (_name, b) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(body(b)));
    await expect(fetchIssue(SRC)).rejects.toThrow();
    expect(sessionStorage.length).toBe(0);
  });

  it('accepts a real issue payload', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(body({ state: 'open', comments: 8, updated_at: '2026-11-21T10:00:00Z' })));
    await expect(fetchIssue(SRC)).resolves.toMatchObject({ state: 'open', comments: 8 });
  });
});
