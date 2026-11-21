import React, { useState, useEffect, useRef, useMemo } from 'react';

export default function CommandPalette({ open, onClose, items }) {
  const [query, setQuery] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) { setQuery(''); setIdx(0); setTimeout(() => inputRef.current?.focus(), 0); }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i => `${i.group} ${i.label} ${i.keywords || ''}`.toLowerCase().includes(q));
  }, [query, items]);

  useEffect(() => { setIdx(0); }, [query]);

  if (!open) return null;

  const run = (item) => { if (!item) return; onClose(); item.run(); };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(results[idx]); }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9998 }} />
      <div
        role="dialog"
        aria-label="Command palette"
        style={{
          position: 'fixed', top: '18vh', left: '50%', transform: 'translateX(-50%)',
          width: 'min(560px, 92vw)', zIndex: 9999,
          backgroundColor: '#0a0c10', border: '1px solid var(--border-accent)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8)', fontFamily: 'var(--font-mono)',
        }}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a command or search..."
          spellCheck={false}
          autoComplete="off"
          style={{
            width: '100%', boxSizing: 'border-box', padding: '0.9rem 1rem',
            background: 'none', border: 'none', borderBottom: '1px solid var(--border)',
            outline: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem', caretColor: 'var(--accent)',
          }}
        />
        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          {results.length === 0 && (
            <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>No matches</div>
          )}
          {results.map((item, i) => (
            <div
              key={item.id}
              onClick={() => run(item)}
              onMouseEnter={() => setIdx(i)}
              ref={el => { if (el && i === idx) el.scrollIntoView({ block: 'nearest' }); }}
              style={{
                display: 'flex', justifyContent: 'space-between', gap: '1rem',
                padding: '0.6rem 1rem', cursor: 'pointer', fontSize: '0.78rem',
                color: i === idx ? 'var(--text-primary)' : 'var(--text-muted)',
                backgroundColor: i === idx ? 'var(--bg-tertiary)' : 'transparent',
                borderLeft: `2px solid ${i === idx ? 'var(--accent)' : 'transparent'}`,
              }}
            >
              <span>{item.label}</span>
              <span style={{ color: 'var(--text-faint)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>{item.group}</span>
            </div>
          ))}
        </div>
        <div style={{
          padding: '0.45rem 1rem', borderTop: '1px solid var(--border)', color: 'var(--text-faint)',
          fontSize: '0.62rem', letterSpacing: '0.08em', display: 'flex', gap: '1rem',
        }}>
          <span>UP/DOWN NAVIGATE</span><span>ENTER SELECT</span><span>ESC CLOSE</span>
        </div>
      </div>
    </>
  );
}
