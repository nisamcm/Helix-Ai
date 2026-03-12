import { useState } from 'react'
import {
  HelixLogo, IconPlus, IconChevronLeft, IconSearch,
  IconChat, IconPin, IconSettings, IconInfo, IconGlobe
} from './icons'

export default function Sidebar({ collapsed, onToggle, mobileOpen, sessions, currentId, onNewChat, onLoadChat, onDeleteChat, onRenameChat, onPinChat, onOpenPanel, searchQuery, onSearch }) {
  const [ctxMenu, setCtxMenu] = useState(null) // {id, x, y}

  function handleContextMenu(e, id) {
    e.preventDefault()
    setCtxMenu({ id, x: e.clientX, y: Math.min(e.clientY, window.innerHeight - 180) })
  }

  function closeCtx() { setCtxMenu(null) }

  const filteredSessions = sessions.filter(s =>
    !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const pinnedSessions = filteredSessions.filter(s => s.pinned)
  const todaySessions  = filteredSessions.filter(s => !s.pinned)

  return (
    <>
      <nav className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <button className="sidebar-toggle" onClick={onToggle} title="Toggle sidebar">
          <IconChevronLeft />
        </button>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="helix-icon"><HelixLogo size={22} /></div>
          <div className="sidebar-logo-text">
            <div className="logo-name">Helix</div>
            <div className="logo-tagline">by Zam</div>
          </div>
        </div>

        {/* New Chat */}
        <button className="new-chat-btn" onClick={onNewChat}>
          <IconPlus />
          <span>New chat</span>
        </button>

        {/* Search */}
        <div className="sidebar-search">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            type="text"
            placeholder="Search chats…"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
          />
        </div>

        {/* Chat History */}
        <div className="chat-history">
          {sessions.length === 0 ? (
            <div className="history-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>No chats yet</span>
            </div>
          ) : (
            <>
              {pinnedSessions.length > 0 && (
                <>
                  <div className="history-section-label">Pinned</div>
                  {pinnedSessions.map(s => (
                    <div
                      key={s.id}
                      className={`chat-item ${s.id === currentId ? 'active' : ''}`}
                      onClick={() => onLoadChat(s.id)}
                      onContextMenu={e => handleContextMenu(e, s.id)}
                    >
                      <svg className="chat-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span className="chat-item-text">{s.title}</span>
                      <svg className="chat-item-pin" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1l-6 6-4 4 2 2 3-3v5l-2 2 2 2 2-2h5l-3 3 2 2 4-4 6-6z"/></svg>
                    </div>
                  ))}
                </>
              )}
              {todaySessions.length > 0 && (
                <>
                  <div className="history-section-label" style={{marginTop: pinnedSessions.length ? '6px' : 0}}>Today</div>
                  {todaySessions.map(s => (
                    <div
                      key={s.id}
                      className={`chat-item ${s.id === currentId ? 'active' : ''}`}
                      onClick={() => onLoadChat(s.id)}
                      onContextMenu={e => handleContextMenu(e, s.id)}
                    >
                      <svg className="chat-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span className="chat-item-text">{s.title}</span>
                    </div>
                  ))}
                </>
              )}
              {filteredSessions.length === 0 && searchQuery && (
                <div className="history-empty"><span>No results found</span></div>
              )}
            </>
          )}
        </div>

        {/* Bottom actions */}
        <div className="sidebar-bottom">
          <button className="sidebar-action" onClick={() => onOpenPanel('settings')}>
            <IconSettings />
            <span className="action-label">Settings</span>
          </button>
          <button className="sidebar-action" onClick={() => onOpenPanel('about')}>
            <IconInfo />
            <span className="action-label">About Helix</span>
          </button>
          <a href="https://muhammednisam.com" target="_blank" rel="noreferrer" className="sidebar-action">
            <IconGlobe />
            <span className="action-label">Zam's Website</span>
          </a>
        </div>
      </nav>

      {/* Context Menu */}
      {ctxMenu && (
        <>
          <div style={{position:'fixed',inset:0,zIndex:499}} onClick={closeCtx} />
          <div className="context-menu" style={{left: ctxMenu.x, top: ctxMenu.y}}>
            <div className="ctx-item" onClick={() => { onPinChat(ctxMenu.id); closeCtx() }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 1l-6 6-4 4 2 2 3-3v5l-2 2 2 2 2-2h5l-3 3 2 2 4-4 6-6z"/></svg>
              Pin chat
            </div>
            <div className="ctx-item" onClick={() => { onRenameChat(ctxMenu.id); closeCtx() }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Rename
            </div>
            <div className="ctx-item" onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              closeCtx()
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share
            </div>
            <div className="ctx-divider" />
            <div className="ctx-item danger" onClick={() => { onDeleteChat(ctxMenu.id); closeCtx() }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Delete
            </div>
          </div>
        </>
      )}
    </>
  )
}
