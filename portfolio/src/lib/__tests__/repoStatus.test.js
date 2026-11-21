import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchLastCommit } from '../repoStatus';

const OK_BODY = [{ sha: 'abc1234def5678', commit: { committer: { date: '2026-11-21T10:00:00Z' } } }];

function okResponse() {
  return { ok: true, status: 200, json: async () => OK_BODY };
}

describe('fetchLastCommit', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse()));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns the latest commit sha and date', async () => {
    await expect(fetchLastCommit('kabilan-srk/portfolio')).resolves.toEqual({
      sha: 'abc1234def5678',
      date: '2026-11-21T10:00:00Z',
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/kabilan-srk/portfolio/commits?per_page=1',
      expect.any(Object),
    );
  });

  it('serves a second call within 5 minutes from cache', async () => {
    await fetchLastCommit('kabilan-srk/portfolio');
    await fetchLastCommit('kabilan-srk/portfolio');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('rejects on a 403 rate-limit response', async () => {
    fetch.mockResolvedValue({ ok: false, status: 403, json: async () => ({}) });
    await expect(fetchLastCommit('kabilan-srk/portfolio')).rejects.toThrow('github 403');
  });

  it('rejects on an empty commit list', async () => {
    fetch.mockResolvedValue({ ok: true, status: 200, json: async () => [] });
    await expect(fetchLastCommit('kabilan-srk/portfolio')).rejects.toThrow();
  });

  it('still fetches when sessionStorage throws', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    await expect(fetchLastCommit('kabilan-srk/portfolio')).resolves.toMatchObject({ sha: 'abc1234def5678' });
  });
});
