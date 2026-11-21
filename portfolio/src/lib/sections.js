export const SECTIONS = [
  { id: 'home', label: 'ABOUT', aliases: ['about', 'home'] },
  { id: 'experience', label: 'EXPERIENCE', aliases: ['exp'] },
  { id: 'projects', label: 'PROJECTS', aliases: [] },
  { id: 'skills', label: 'SKILLS', aliases: ['toolkit', 'sre-toolkit'] },
  { id: 'learning', label: 'LEARNING', aliases: [] },
  { id: 'contact', label: 'CONTACT', aliases: [] },
];

export function resolveSection(name) {
  const q = String(name || '').trim().toLowerCase();
  if (!q) return null;
  const hit = SECTIONS.find(s => s.id === q || s.label.toLowerCase() === q || s.aliases.includes(q));
  return hit ? hit.id : null;
}
