import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { fetchIssue, deriveStatus, timeAgo } from '../lib/issueStatus';

const ASCII_BANNER = `
 ██╗  ██╗ █████╗ ██████╗ ██╗██╗      █████╗ ███╗  ██╗
 ██║ ██╔╝██╔══██╗██╔══██╗██║██║     ██╔══██╗████╗ ██║
 █████╔╝ ███████║██████╔╝██║██║     ███████║██╔██╗██║
 ██╔═██╗ ██╔══██║██╔══██╗██║██║     ██╔══██║██║╚████║
 ██║  ██╗██║  ██║██████╔╝██║███████╗██║  ██║██║  ╚███║
 ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝╚══════╝╚═╝  ╚═╝╚═╝   ╚══╝

 ███████╗██████╗ ██╗  ██╗
 ██╔════╝██╔══██╗██║ ██╔╝
 ███████╗██████╔╝█████╔╝
 ╚════██║██╔══██╗██╔═██╗
 ███████║██║  ██║██║  ██╗
 ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
`.trim();

const COMMANDS = ['help', 'whoami', 'about', 'ls', 'goto', 'cat', 'projects', 'skills', 'status', 'contact', 'open', 'clear', 'exit', 'q'];
const GOTO_TARGETS = ['home', 'experience', 'projects', 'skills', 'toolkit', 'learning', 'contact'];
const CAT_TARGETS = ['experience', 'projects'];

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

function buildCommandMap(portfolioData, scrollToSection, onClose) {
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
      { type: 'output', text: '│  exit / q          — close terminal' },
      { type: 'output', text: '└─────────────────────────────────────────────────────' },
    ],

    whoami: () => [
      { type: 'output', text: `name:     ${portfolioData.personal.name}` },
      { type: 'output', text: `role:     ${portfolioData.personal.title}` },
      { type: 'output', text: `summary:  ${portfolioData.personal.intro}` },
      { type: 'output', text: `status:   ${portfolioData.personal.subIntro}` },
    ],

    about: () => buildCommandMap(portfolioData, scrollToSection, onClose).whoami(),

    ls: () => [
      { type: 'output', text: 'home/  experience/  projects/  skills/  toolkit/  learning/  contact/' },
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

    projects: () => buildCommandMap(portfolioData, scrollToSection, onClose)['cat projects'](),

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

    exit: () => { onClose(); return []; },
    q:    () => { onClose(); return []; },
  };
}

function runCommand(input, portfolioData, scrollToSection, onClose) {
  const raw = input.trim().toLowerCase();
  const cmdMap = buildCommandMap(portfolioData, scrollToSection, onClose);

  // goto command
  if (raw.startsWith('goto ')) {
    const section = raw.slice(5).trim();
    const sectionMap = {
      home: 'home', experience: 'experience', exp: 'experience',
      projects: 'projects', skills: 'skills', toolkit: 'sre-toolkit',
      'sre-toolkit': 'sre-toolkit', learning: 'learning', contact: 'contact'
    };
    const id = sectionMap[section];
    if (id) {
      scrollToSection(id);
      onClose();
      return [{ type: 'output', text: `navigating to ${section}...` }];
    }
    return [{ type: 'error', text: `unknown section: ${section}. try: home, experience, projects, skills, toolkit, learning, contact` }];
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

export default function Terminal({ onClose, scrollToSection, portfolioData }) {
  const [history, setHistory] = useState([
    { type: 'banner', text: ASCII_BANNER },
    { type: 'output', text: "Type 'help' for available commands. Press ESC to close." },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const prompt = { type: 'prompt', text: cmd };

      if (cmd !== '') {
        setCmdHistory(prev => [cmd, ...prev]);
        setHistoryIdx(-1);
      }

      const result = runCommand(cmd, portfolioData, scrollToSection, onClose);

      if (result instanceof Promise) {
        setHistory(prev => [...prev, prompt, { type: 'output', text: 'fetching...' }]);
        setInput('');
        result.then(lines => setHistory(prev => [...prev, ...lines]));
        return;
      }

      if (result === '__CLEAR__') {
        setHistory([]);
        setInput('');
        return;
      }

      setHistory(prev => [...prev, prompt, ...result]);
      setInput('');
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next] || '');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInput(next === -1 ? '' : cmdHistory[next]);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const lower = input.toLowerCase();
      const argMatch = lower.match(/^(goto|cat|open)\s+(.*)$/);
      if (argMatch) {
        const [, verb, partial] = argMatch;
        const pool = verb === 'goto' ? GOTO_TARGETS
          : verb === 'cat' ? CAT_TARGETS
          : portfolioData.projects.map(p => p.name.toLowerCase().replace(/\s+/g, '-'));
        const hits = pool.filter(t => t.startsWith(partial));
        if (hits.length === 1) setInput(`${verb} ${hits[0]}`);
        else if (hits.length > 1) {
          setHistory(prev => [...prev, { type: 'prompt', text: input }, { type: 'output', text: hits.join('  ') }]);
        }
        return;
      }
      const matches = COMMANDS.filter(c => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setHistory(prev => [...prev,
          { type: 'prompt', text: input },
          { type: 'output', text: matches.join('  ') }
        ]);
      }
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 9998,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(900px, 92vw)',
          height: 'min(560px, 85vh)',
          backgroundColor: '#0a0c10',
          border: '1px solid var(--border-accent)',
          boxShadow: '0 0 60px rgba(255,0,0,0.15), 0 24px 80px rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Title bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--bg-secondary)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="status-dot status-dot--live" style={{ width: '8px', height: '8px' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', letterSpacing: '0.08em' }}>
              KABILAN@PORTFOLIO:~$
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.2rem 0.5rem',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--accent)';
              e.currentTarget.style.borderColor = 'var(--border-accent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <X size={12} /> ESC
          </button>
        </div>

        {/* Output area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            scrollbarWidth: 'thin',
          }}
        >
          {history.map((line, i) => {
            if (line.type === 'banner') {
              return (
                <pre key={i} style={{
                  color: 'var(--accent)',
                  fontSize: 'clamp(0.35rem, 1.2vw, 0.62rem)',
                  lineHeight: 1.3,
                  marginBottom: '0.5rem',
                  userSelect: 'none',
                  opacity: 0.85,
                }}>
                  {line.text}
                </pre>
              );
            }
            if (line.type === 'prompt') {
              return (
                <div key={i} style={{ color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                  <span style={{ color: 'var(--status-live)' }}>kabilan</span>
                  <span style={{ color: 'var(--text-muted)' }}>@portfolio</span>
                  <span style={{ color: 'var(--text-faint)' }}>:~$</span>
                  <span style={{ marginLeft: '0.5rem' }}>{line.text}</span>
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={i} style={{ color: 'var(--accent)', marginBottom: '0.15rem' }}>
                  ✗ {line.text}
                </div>
              );
            }
            return (
              <div key={i} style={{
                color: line.accent ? 'var(--text-primary)' : 'var(--text-muted)',
                marginBottom: '0.15rem',
                fontWeight: line.accent ? 700 : 400,
              }}>
                {line.text || ' '}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input line */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.6rem 1rem',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--bg-secondary)',
          flexShrink: 0,
          gap: '0.5rem',
        }}>
          <span style={{ color: 'var(--status-live)', flexShrink: 0 }}>kabilan</span>
          <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>@portfolio</span>
          <span style={{ color: 'var(--text-faint)', flexShrink: 0 }}>:~$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              caretColor: 'var(--accent)',
            }}
          />
        </div>
      </div>
    </>
  );
}
