import { deriveStatus } from './issueStatus';

// Only the hosting line carries a real result; the others only say an action finished.
export function buildBootLines({ issue, issueError } = {}) {
  let hosting = 'pending';
  if (issueError) hosting = 'unavailable';
  else if (issue) hosting = deriveStatus(issue).label;
  return [
    'loading profile ... done',
    'reading portfolio data ... done',
    `fetching hosting status ... ${hosting}`,
    'starting interface ... done',
  ];
}
