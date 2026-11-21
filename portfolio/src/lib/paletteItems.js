import { SECTIONS } from './sections';

const title = label => label.charAt(0) + label.slice(1).toLowerCase();

export function buildPaletteItems({ view, goToSection, toggleView, resumeUrl, projects, copyEmail }) {
  return [
    ...SECTIONS.map(s => ({ id: `go-${s.id}`, group: 'GO TO', label: title(s.label), run: () => goToSection(s.id) })),
    { id: 'view', group: 'ACTION', label: view === 'terminal' ? 'Switch to dashboard' : 'Switch to terminal view', keywords: 'shell cli gui terminal dashboard', run: toggleView },
    { id: 'resume', group: 'ACTION', label: 'Open resume', keywords: 'cv', run: () => window.open(resumeUrl, '_blank', 'noopener') },
    { id: 'email', group: 'ACTION', label: 'Copy email address', keywords: 'contact mail', run: copyEmail },
    ...projects.flatMap(p => [
      { id: `code-${p.name}`, group: 'PROJECT', label: `${p.name}: source code`, run: () => window.open(p.githubUrl, '_blank', 'noopener') },
      { id: `live-${p.name}`, group: 'PROJECT', label: `${p.name}: ${(p.liveLabel || 'open').replace(/[[\]]/g, '').toLowerCase()}`, run: () => window.open(p.liveUrl, '_blank', 'noopener') },
    ]),
  ];
}
