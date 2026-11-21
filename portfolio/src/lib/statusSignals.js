// Turns raw fetch results into the status strip's three signals. Never reports ok for an errored or missing signal.
import { deriveStatus, timeAgo } from './issueStatus';

const UNAVAILABLE = 'unavailable';

export function describeSignals({ issue, issueError, commit, commitError, build } = {}) {
  let hosting = { value: UNAVAILABLE, tone: 'unknown' };
  if (!issueError && issue) {
    const { label } = deriveStatus(issue);
    hosting = { value: label, tone: label === 'HOSTED' ? 'ok' : 'warn' };
  } else if (!issueError) {
    hosting = { value: 'checking...', tone: 'unknown' };
  }

  let last = { value: UNAVAILABLE, tone: 'unknown' };
  if (!commitError && commit) last = { value: timeAgo(commit.date), tone: 'ok' };
  else if (!commitError) last = { value: 'checking...', tone: 'unknown' };

  const built = build
    ? { value: `${build.sha.slice(0, 7)} · ${build.date}`, tone: 'ok' }
    : { value: UNAVAILABLE, tone: 'unknown' };

  return [
    { id: 'hosting', label: 'BUILD SOUND', ...hosting },
    { id: 'commit', label: 'LAST COMMIT', ...last },
    { id: 'build', label: 'DEPLOYED', ...built },
  ];
}
