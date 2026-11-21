import { fetchIssue, deriveStatus, timeAgo } from './issueStatus';
import { resolveSection, SECTIONS } from './sections';

export const COMMANDS = ['help', 'whoami', 'about', 'ls', 'goto', 'cat', 'projects', 'skills', 'status', 'contact', 'open', 'clear', 'exit', 'q'];
export const GOTO_TARGETS = ['home', 'experience', 'projects', 'skills', 'toolkit', 'learning', 'contact'];
export const CAT_TARGETS = ['experience', 'projects'];

const normalize = (str) => str.toLowerCase().replace(/[-_]+/g, ' ').trim();
const findProject = (projects, name) => {
  const n = normalize(name);
  return projects.find(p => normalize(p.name) === n) || projects.find(p => normalize(p.name).includes(n));
};

async function projectStatus(portfolioData) {
  const tracked = portfolioData.projects.filter(p => p.statusSource);
  if (tracked.length === 0) return [{ type: 'output', text: 'no tracked projects.' }];
  const lines = [];
  for (const p of tracked) {
    try {
      const issue = await fetchIssue(p.statusSource);
      const { label } = deriveStatus(issue);
      lines.push({ type: 'output', text: '' });
      lines.push({ type: 'output', text: `┌─ ${p.name}`, accent: true });
      lines.push({ type: 'output', text: `│  status:   ${label}` });
      lines.push({ type: 'output', text: `│  issue:    ${p.statusSource.repo}#${p.statusSource.issue} (${issue.state})` });
      lines.push({ type: 'output', text: `│  activity: ${issue.comments} comments, updated ${timeAgo(issue.updated_at)}` });
      lines.push({ type: 'output', text: '└────────────────────────────────' });
    } catch {
      lines.push({ type: 'error', text: `${p.name}: could not reach GitHub API (rate limit or offline)` });
    }
  }
  return lines;
}

function buildCommandMap(portfolioData, goToSection, onExit) {
  return {
    help: () => [
      { type: 'output', text: '┌─ AVAILABLE COMMANDS ────────────────────────────────' },
      { type: 'output', text: '│  help              — show this menu' },
      { type: 'output', text: '│  whoami / about    — who is Kabilan?' },
      { type: 'output', text: '│  ls                — list portfolio sections' },
      { type: 'output', text: '│  goto <section>    — navigate to a section' },
      { type: 'output', text: '│  cat experience    — display work experience' },
      { type: 'output', text: '│  cat projects      — display projects' },
      { type: 'output', text: '│  projects          — same as cat projects' },
      { type: 'output', text: '│  skills            — display skills' },
      { type: 'output', text: '│  status            — live hosting status (GitHub)' },
      { type: 'output', text: '│  contact           — display contact info' },
      { type: 'output', text: '│  open <project>    — open project live URL' },
      { type: 'output', text: '│  clear             — clear terminal' },
      { type: 'output', text: '│  exit / q          — back to the dashboard' },
      { type: 'output', text: '└─────────────────────────────────────────────────────' },
    ],

    whoami: () => [
      { type: 'output', text: `name:     ${portfolioData.personal.name}` },
      { type: 'output', text: `role:     ${portfolioData.personal.title}` },
      { type: 'output', text: `summary:  ${portfolioData.personal.intro}` },
      { type: 'output', text: `status:   ${portfolioData.personal.subIntro}` },
    ],

    about: () => buildCommandMap(portfolioData, goToSection, onExit).whoami(),

    ls: () => [
      { type: 'output', text: SECTIONS.map(x => `${x.id}/`).join('  ') },
    ],

    'cat experience': () => portfolioData.experience.flatMap(exp => [
      { type: 'output', text: '' },
      { type: 'output', text: `┌─ ${exp.organization} — ${exp.role}`, accent: true },
      { type: 'output', text: `│  period: ${exp.duration}` },
      { type: 'output', text: `│  role:   ${exp.category}` },
      ...exp.achievements.map(a => ({ type: 'output', text: `│  > ${a.toLowerCase()}` })),
      { type: 'output', text: '└────────────────────────────────' },
    ]),

    'cat projects': () => portfolioData.projects.flatMap(p => [
      { type: 'output', text: '' },
      { type: 'output', text: `┌─ ${p.name}`, accent: true },
      { type: 'output', text: `│  ${p.description.toLowerCase()}` },
      { type: 'output', text: `│  tech:   ${p.technologies.join(', ')}` },
      { type: 'output', text: `│  ${(p.liveLabel || '[open]').replace(/[[\]]/g, '').toLowerCase()}:   ${p.liveUrl}` },
      { type: 'output', text: `│  code:   ${p.githubUrl}` },
      { type: 'output', text: '└────────────────────────────────' },
    ]),

    projects: () => buildCommandMap(portfolioData, goToSection, onExit)['cat projects'](),

    status: () => projectStatus(portfolioData),

    skills: () => {
      const lines = [{ type: 'output', text: '— SKILLS ————————————' }];
      portfolioData.skills.sre.forEach(s => {
        const filled = Math.round(s.level / 5);
        const empty = 20 - filled;
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        lines.push({ type: 'output', text: `  ${s.name.padEnd(14)} [${bar}] ${s.level}%` });
      });
      return lines;
    },

    contact: () => [
      { type: 'output', text: '— CONTACT ────────────────────' },
      { type: 'output', text: '  github:  github.com/KABILANSRK' },
      { type: 'output', text: '  email:   kabilansrkk@gmail.com' },
      { type: 'output', text: '  phone:   +91 available on request' },
    ],

    clear: () => '__CLEAR__',

    exit: () => { onExit(); return []; },
    q:    () => { onExit(); return []; },
  };
}

export function runCommand(input, portfolioData, goToSection, onExit) {
  const raw = input.trim().toLowerCase();
  const cmdMap = buildCommandMap(portfolioData, goToSection, onExit);

  // goto command
  if (raw.startsWith('goto ')) {
    const section = raw.slice(5).trim();
    const id = resolveSection(section);
    if (id) {
      goToSection(id);
      return [{ type: 'output', text: `navigating to ${section}...` }];
    }
    return [{ type: 'error', text: `unknown section: ${section}. try: ${SECTIONS.map(x => x.id).join(', ')}` }];
  }

  // open command
  if (raw.startsWith('open ')) {
    const name = raw.slice(5).trim();
    const project = findProject(portfolioData.projects, name);
    if (project) {
      window.open(project.liveUrl, '_blank');
      return [{ type: 'output', text: `opening ${project.name}...` }];
    }
    const names = portfolioData.projects.map(p => p.name.toLowerCase()).join(', ');
    return [{ type: 'error', text: `unknown project: ${name}. available: ${names}` }];
  }

  if (cmdMap[raw]) return cmdMap[raw]();

  if (raw === '') return [];

  return [{ type: 'error', text: `command not found: ${raw}. type 'help' for available commands.` }];
}

