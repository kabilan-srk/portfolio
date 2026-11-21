import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const inputBase = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--border)',
  outline: 'none',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.85rem',
  padding: '0.6rem 0',
  transition: 'border-color 0.2s',
  caretColor: 'var(--accent)'
};

export default function Contact({ formData, formErrors, isSubmitting, submitStatus, handleInputChange, handleSubmit }) {
  return (
    <section id="contact" style={{
      padding: '1.75rem',
      backgroundColor: 'transparent'
    }}>
      <div style={{ maxWidth: 'none', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">REACH OUT</div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem'
          }}>
            [CONTACT]
          </h2>
          <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--accent)', marginBottom: '1.5rem' }} />
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{
            border: '1px solid var(--border)',
            padding: '2rem',
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.8rem'
          }}
        >
          {/* Name */}
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--accent)' }}>&gt;</span> name<span style={{ color: 'var(--accent)' }}>:</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="your name"
              style={{ ...inputBase, borderBottomColor: formErrors.name ? 'var(--accent)' : undefined }}
              onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderBottomColor = formErrors.name ? 'var(--accent)' : 'var(--border)'}
            />
            {formErrors.name && (
              <div style={{ color: 'var(--accent)', fontSize: '0.7rem', marginTop: '0.3rem' }}>
                ✗ {formErrors.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--accent)' }}>&gt;</span> email<span style={{ color: 'var(--accent)' }}>:</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              style={{ ...inputBase, borderBottomColor: formErrors.email ? 'var(--accent)' : undefined }}
              onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderBottomColor = formErrors.email ? 'var(--accent)' : 'var(--border)'}
            />
            {formErrors.email && (
              <div style={{ color: 'var(--accent)', fontSize: '0.7rem', marginTop: '0.3rem' }}>
                ✗ {formErrors.email}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--accent)' }}>&gt;</span> phone<span style={{ color: 'var(--text-faint)' }}> (optional)</span><span style={{ color: 'var(--accent)' }}>:</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91 ..."
              style={inputBase}
              onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderBottomColor = 'var(--border)'}
            />
          </div>

          {/* Message */}
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--accent)' }}>&gt;</span> message<span style={{ color: 'var(--accent)' }}>:</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              placeholder="write your message here..."
              style={{
                ...inputBase,
                resize: 'vertical',
                borderBottom: `1px solid ${formErrors.message ? 'var(--accent)' : 'var(--border)'}`,
                paddingTop: '0.4rem'
              }}
              onFocus={e => e.style.borderBottomColor = 'var(--accent)'}
              onBlur={e => e.style.borderBottomColor = formErrors.message ? 'var(--accent)' : 'var(--border)'}
            />
            {formErrors.message && (
              <div style={{ color: 'var(--accent)', fontSize: '0.7rem', marginTop: '0.3rem' }}>
                ✗ {formErrors.message}
              </div>
            )}
          </div>

          {/* Status */}
          {submitStatus && (
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: submitStatus === 'SUCCESS' ? 'var(--status-live)' : 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              {submitStatus === 'SUCCESS'
                ? '✓ Message transmitted.'
                : '✗ Transmission failed. Try again.'}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.85rem',
              backgroundColor: isSubmitting ? 'rgba(255,176,0,0.5)' : 'var(--accent)',
              color: '#000',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'box-shadow 0.2s, transform 0.2s'
            }}
            onMouseEnter={e => {
              if (!isSubmitting) {
                e.currentTarget.style.boxShadow = 'var(--accent-glow)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Send size={14} />
            {isSubmitting ? '[ SENDING... ]' : '[ SEND MESSAGE ]'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
