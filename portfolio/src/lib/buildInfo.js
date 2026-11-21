// Build metadata injected by the Pages workflow (VITE_BUILD_SHA, VITE_BUILD_DATE).
export function getBuildInfo() {
  const sha = import.meta.env.VITE_BUILD_SHA;
  const date = import.meta.env.VITE_BUILD_DATE;
  return sha && date ? { sha, date } : null;
}
