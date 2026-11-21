import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { runCommand, COMMANDS, GOTO_TARGETS, CAT_TARGETS } from '../lib/terminalCommands';

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

export default function Terminal({ onExit, goToSection, portfolioData }) {
  const [history, setHistory] = useState([
    { type: 'banner', text: ASCII_BANNER },
    { type: 'output', text: "Type 'help' for available commands. Press ESC or click [GUI] for the dashboard." },
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
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onExit]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const prompt = { type: 'prompt', text: cmd };

      if (cmd !== '') {
        setCmdHistory(prev => [cmd, ...prev]);
        setHistoryIdx(-1);
      }

      const result = runCommand(cmd, portfolioData, goToSection, onExit);

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
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--bg-primary)',
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
            onClick={onExit}
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
            <X size={12} /> [GUI]
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
