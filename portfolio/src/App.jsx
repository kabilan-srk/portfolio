import React, { useState, useEffect } from 'react';
import { portfolioData } from './data/portfolioData';
import { useScrollSpy } from './hooks/useScrollSpy';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Terminal from './components/Terminal';
import CommandPalette from './components/CommandPalette';

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const activeSection = useScrollSpy();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Ctrl+` keyboard shortcut for terminal
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setTerminalOpen(o => !o);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const EMAIL = 'kabilansrkk@gmail.com';
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const paletteItems = [
    ...[['home', 'Home'], ['experience', 'Experience'], ['projects', 'Projects'], ['skills', 'Skills'],
        ['sre-toolkit', 'SRE Toolkit'], ['learning', 'Learning'], ['contact', 'Contact']]
      .map(([id, label]) => ({ id: `go-${id}`, group: 'GO TO', label, run: () => scrollToSection(id) })),
    { id: 'terminal', group: 'ACTION', label: 'Open terminal', keywords: 'shell cli', run: () => setTerminalOpen(true) },
    { id: 'resume', group: 'ACTION', label: 'Open resume', keywords: 'cv', run: () => window.open(portfolioData.personal.resumeUrl, '_blank', 'noopener') },
    { id: 'email', group: 'ACTION', label: 'Copy email address', keywords: 'contact mail', run: () => {
      navigator.clipboard?.writeText(EMAIL).then(() => flash('EMAIL COPIED'), () => flash('COPY FAILED'));
    } },
    ...portfolioData.projects.flatMap(p => [
      { id: `code-${p.name}`, group: 'PROJECT', label: `${p.name}: source code`, run: () => window.open(p.githubUrl, '_blank', 'noopener') },
      { id: `live-${p.name}`, group: 'PROJECT', label: `${p.name}: ${(p.liveLabel || 'open').replace(/[[\]]/g, '').toLowerCase()}`, run: () => window.open(p.liveUrl, '_blank', 'noopener') },
    ]),
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'NAME REQUIRED';
    if (!formData.email.trim()) {
      errors.email = 'EMAIL REQUIRED';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'INVALID EMAIL FORMAT';
    }
    if (!formData.message.trim()) errors.message = 'MESSAGE REQUIRED';
    return errors;
  };

  const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    setIsSubmitting(true);
    setFormErrors({});

    if (FORM_ENDPOINT) {
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        setSubmitStatus('SUCCESS');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setSubmitStatus(''), 5000);
      } catch (err) {
        console.error('Form submit error', err);
        setSubmitStatus('ERROR');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('SUCCESS');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitStatus(''), 5000);
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navigation
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        name={portfolioData.personal.name}
        onToggleTerminal={() => setTerminalOpen(o => !o)}
      />

      {terminalOpen && (
        <Terminal
          onClose={() => setTerminalOpen(false)}
          scrollToSection={scrollToSection}
          portfolioData={portfolioData}
        />
      )}

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={paletteItems} />

      {toast && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10000,
          padding: '0.5rem 1rem', backgroundColor: '#0a0c10', border: '1px solid var(--border-accent)',
          color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em',
        }}>{toast}</div>
      )}

      <Dashboard
        data={portfolioData}
        onOpenTerminal={() => setTerminalOpen(true)}
        contactProps={{ formData, formErrors, isSubmitting, submitStatus, handleInputChange, handleSubmit }}
      />

      <Footer name={portfolioData.personal.name} />
    </div>
  );
}
