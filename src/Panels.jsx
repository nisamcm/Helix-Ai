import { useState } from 'react'
import { IconClose, HelixLogo, IconUser, IconMail, IconArrowRight, IconExternalLink, IconCheck } from './icons'

function Toggle({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn)
  return <button className={`toggle ${on ? 'on' : ''}`} onClick={() => setOn(v => !v)} />
}

function PanelHeader({ title, onClose }) {
  return (
    <div className="panel-header">
      <div className="panel-title">{title}</div>
      <button className="close-btn" onClick={onClose}><IconClose /></button>
    </div>
  )
}

export function SettingsPanel({ open, onClose, theme, onSetTheme, onClearHistory }) {
  return (
    <div className={`panel ${open ? 'open' : ''}`}>
      <PanelHeader title="Settings" onClose={onClose} />
      <div className="panel-body">
        <div className="setting-section">
          <div className="setting-label">Appearance</div>
          <div className="theme-options">
            <button className={`theme-opt ${theme === 'light' ? 'active' : ''}`} onClick={() => onSetTheme('light')}>☀️ Light</button>
            <button className={`theme-opt ${theme === 'dark'  ? 'active' : ''}`} onClick={() => onSetTheme('dark')}>🌙 Dark</button>
          </div>
        </div>

        <div className="setting-section">
          <div className="setting-label">AI Behavior</div>
          {[
            { name: 'Streaming responses', desc: 'See text appear word by word', on: true },
            { name: 'Memory', desc: 'Helix remembers across conversations', on: true },
            { name: 'Safe mode', desc: 'Filter potentially harmful content', on: true },
          ].map(item => (
            <div className="setting-row" key={item.name}>
              <div className="setting-info">
                <div className="setting-name">{item.name}</div>
                <div className="setting-desc">{item.desc}</div>
              </div>
              <Toggle defaultOn={item.on} />
            </div>
          ))}
        </div>

        <div className="setting-section">
          <div className="setting-label">Chat</div>
          {[
            { name: 'Auto-title chats', desc: 'Automatically name conversations', on: true },
            { name: 'Show timestamps', desc: 'Show when messages were sent', on: false },
          ].map(item => (
            <div className="setting-row" key={item.name}>
              <div className="setting-info">
                <div className="setting-name">{item.name}</div>
                <div className="setting-desc">{item.desc}</div>
              </div>
              <Toggle defaultOn={item.on} />
            </div>
          ))}
        </div>

        <div className="setting-section">
          <div className="setting-label">Data</div>
          {[
            { name: 'Chat history', desc: 'Save and sync conversation history', on: true },
            { name: 'Improve Helix', desc: 'Share anonymized data to improve AI', on: false },
          ].map(item => (
            <div className="setting-row" key={item.name}>
              <div className="setting-info">
                <div className="setting-name">{item.name}</div>
                <div className="setting-desc">{item.desc}</div>
              </div>
              <Toggle defaultOn={item.on} />
            </div>
          ))}
        </div>

        <div className="setting-section">
          <div className="setting-label">Danger Zone</div>
          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-name">Clear chat history</div>
              <div className="setting-desc">Delete all conversations permanently</div>
            </div>
            <button className="danger-btn" onClick={onClearHistory}>Clear all</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AboutPanel({ open, onClose, onOpenContact }) {
  return (
    <div className={`panel ${open ? 'open' : ''}`}>
      <PanelHeader title="About Helix" onClose={onClose} />
      <div className="panel-body">
        <div className="about-card">
          <div className="about-logo"><HelixLogo size={32} /></div>
          <div className="about-name">Helix AI</div>
          <div className="about-meta">Version 1.0.0 · Built by Zam<br />A powerful AI assistant for everyone. Capable of reasoning, creating, coding, and understanding — all in one platform.</div>
        </div>

        <div className="setting-label">Developer</div>

        <div className="link-card" onClick={() => window.open('https://muhammednisam.com','_blank')}>
          <div className="link-card-icon" style={{background:'var(--accent-subtle)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </div>
          <div className="link-card-info">
            <div className="link-card-name">Zam — Developer</div>
            <div className="link-card-desc">Visit Zam's portfolio & work</div>
          </div>
          <div className="link-card-arrow"><IconExternalLink /></div>
        </div>

        <div className="link-card" onClick={onOpenContact}>
          <div className="link-card-icon" style={{background:'rgba(16,185,129,0.1)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div className="link-card-info">
            <div className="link-card-name">Contact Zam</div>
            <div className="link-card-desc">Send a message or collaboration request</div>
          </div>
          <div className="link-card-arrow"><IconArrowRight /></div>
        </div>

        <div className="link-card" onClick={() => window.open('https://linkedin.com/in/muhammed-nisam','_blank')}>
          <div className="link-card-icon" style={{background:'rgba(59,130,246,0.1)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#3B82F6"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </div>
          <div className="link-card-info">
            <div className="link-card-name">LinkedIn</div>
            <div className="link-card-desc">Connect professionally</div>
          </div>
          <div className="link-card-arrow"><IconExternalLink /></div>
        </div>

        <div className="setting-label">Legal</div>
        <div className="about-meta" style={{color:'var(--fg3)',fontSize:'0.78rem',lineHeight:'1.6'}}>
          Helix AI is developed by Zam (Muhammed Nisam CM). This platform uses AI to generate responses. Always verify important information. © 2025 Helix by Zam. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export function ContactPanel({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}))

  function handleSubmit() {
    onSubmit()
    setForm({ name:'', email:'', subject:'', message:'' })
  }

  return (
    <div className={`panel ${open ? 'open' : ''}`}>
      <PanelHeader title="Contact Zam" onClose={onClose} />
      <div className="panel-body">
        <div className="about-meta" style={{color:'var(--fg2)'}}>
          Have a project idea, collaboration request, or just want to say hello? Reach out to Zam directly.
        </div>

        <div className="contact-form">
          <div className="form-field">
            <label className="form-label">Your Name</label>
            <input className="form-input" type="text" placeholder="John Doe" value={form.name} onChange={set('name')} />
          </div>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="form-field">
            <label className="form-label">Subject</label>
            <input className="form-input" type="text" placeholder="Project collaboration…" value={form.subject} onChange={set('subject')} />
          </div>
          <div className="form-field">
            <label className="form-label">Message</label>
            <textarea className="form-textarea" placeholder="Tell Zam about your project or idea…" value={form.message} onChange={set('message')} />
          </div>
          <button className="submit-btn" onClick={handleSubmit}>Send Message →</button>
        </div>

        <div className="setting-label" style={{marginTop:'8px'}}>Or reach out directly</div>
        <div className="link-card" onClick={() => window.open('mailto:nisamcmapple@gmail.com')}>
          <div className="link-card-icon" style={{background:'rgba(124,58,237,0.1)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div className="link-card-info">
            <div className="link-card-name">nisamcmapple@gmail.com</div>
            <div className="link-card-desc">Send an email directly</div>
          </div>
        </div>
        <div className="link-card" onClick={() => window.open('https://instagram.com/z._a_.m','_blank')}>
          <div className="link-card-icon" style={{background:'rgba(236,72,153,0.1)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </div>
          <div className="link-card-info">
            <div className="link-card-name">@z._a_.m</div>
            <div className="link-card-desc">Follow on Instagram</div>
          </div>
        </div>
      </div>
    </div>
  )
}
