import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

:root {
  --accent: #7C3AED;
  --accent2: #A855F7;
  --accent-glow: rgba(124,58,237,0.25);
  --accent-subtle: rgba(124,58,237,0.08);
  --bg: #0A0A0F;
  --bg2: #0F0F1A;
  --bg3: #141420;
  --sidebar-bg: #0C0C17;
  --card: rgba(255,255,255,0.04);
  --card-hover: rgba(255,255,255,0.07);
  --border: rgba(255,255,255,0.07);
  --border-strong: rgba(255,255,255,0.12);
  --fg: #F0EEF8;
  --fg2: #8B87A8;
  --fg3: #5A5675;
  --input-bg: rgba(255,255,255,0.05);
  --msg-user-bg: rgba(124,58,237,0.15);
  --msg-ai-bg: rgba(255,255,255,0.04);
  --scrollbar: rgba(255,255,255,0.08);
}
[data-theme="light"] {
  --bg: #F8F7FF; --bg2: #F0EEF8; --bg3: #E8E5F5;
  --sidebar-bg: #EDEAF8;
  --card: rgba(124,58,237,0.04); --card-hover: rgba(124,58,237,0.08);
  --border: rgba(124,58,237,0.1); --border-strong: rgba(124,58,237,0.2);
  --fg: #1A1530; --fg2: #5B5280; --fg3: #9890C0;
  --input-bg: rgba(255,255,255,0.8);
  --msg-user-bg: rgba(124,58,237,0.1);
  --msg-ai-bg: rgba(255,255,255,0.9);
  --scrollbar: rgba(124,58,237,0.15);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; overflow: hidden; }
body {
  font-family: 'DM Sans', system-ui, sans-serif;
  background: var(--bg); color: var(--fg);
  -webkit-font-smoothing: antialiased;
  transition: background 0.3s, color 0.3s;
}
body::before {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 200px; pointer-events: none; z-index: 9999; opacity: 0.5;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 4px; }

/* Cursor orbs */
.cursor-glow {
  position: fixed; width: 380px; height: 380px; border-radius: 50%;
  pointer-events: none; z-index: 1; transform: translate(-50%,-50%);
  background: radial-gradient(circle at center, rgba(124,58,237,0.13) 0%, rgba(168,85,247,0.06) 35%, transparent 70%);
  transition: opacity 0.6s ease; will-change: transform;
}
.cursor-trail {
  position: fixed; width: 160px; height: 160px; border-radius: 50%;
  pointer-events: none; z-index: 1; transform: translate(-50%,-50%);
  background: radial-gradient(circle at center, rgba(168,85,247,0.10) 0%, transparent 70%);
  transition: opacity 0.6s ease; will-change: transform; filter: blur(8px);
}
.cursor-dot {
  position: fixed; width: 6px; height: 6px; border-radius: 50%;
  pointer-events: none; z-index: 2; transform: translate(-50%,-50%);
  background: rgba(168,85,247,0.45);
  transition: opacity 0.3s, width 0.2s, height 0.2s, background 0.2s;
  box-shadow: 0 0 6px rgba(168,85,247,0.3);
}
.cursor-dot.hovering {
  width: 12px; height: 12px;
  background: rgba(168,85,247,0.75);
  box-shadow: 0 0 12px rgba(168,85,247,0.5);
}
[data-theme="light"] .cursor-glow {
  background: radial-gradient(circle at center, rgba(124,58,237,0.10) 0%, rgba(168,85,247,0.05) 35%, transparent 70%);
}
[data-theme="light"] .cursor-trail {
  background: radial-gradient(circle at center, rgba(124,58,237,0.08) 0%, transparent 70%);
}
[data-theme="light"] .cursor-dot { background: rgba(124,58,237,0.5); box-shadow: 0 0 6px rgba(124,58,237,0.25); }
[data-theme="light"] .cursor-dot.hovering { background: rgba(124,58,237,0.75); }

/* Layout */
.app { display: flex; height: 100vh; overflow: hidden; position: relative; }

/* Sidebar */
.sidebar {
  width: 260px; min-width: 260px; height: 100vh;
  background: var(--sidebar-bg); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; position: relative; z-index: 100;
  transition: width 0.3s ease, min-width 0.3s ease, transform 0.3s ease, background 0.3s;
  flex-shrink: 0;
}
.sidebar.collapsed { width: 60px; min-width: 60px; }
.sidebar-logo {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 16px 16px; border-bottom: 1px solid var(--border); flex-shrink: 0;
}
.helix-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 4px 15px var(--accent-glow);
}
.helix-icon svg { width: 22px; height: 22px; }
.sidebar-logo-text { overflow: hidden; white-space: nowrap; transition: opacity 0.2s, width 0.3s; }
.sidebar.collapsed .sidebar-logo-text { opacity: 0; width: 0; }
.logo-name { font-family:'Syne',sans-serif; font-weight:800; font-size:1.15rem; color:var(--fg); letter-spacing:-0.02em; }
.logo-tagline { font-size:0.68rem; color:var(--fg3); letter-spacing:0.08em; text-transform:uppercase; }
.sidebar-toggle {
  position: absolute; top: 22px; right: -14px;
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--bg3); border: 1px solid var(--border-strong);
  color: var(--fg2); cursor: pointer;
  display: flex; align-items: center; justify-content: center; z-index: 10;
  transition: background 0.2s, color 0.2s;
}
.sidebar-toggle:hover { background: var(--accent); color: white; }
.sidebar-toggle svg { width: 14px; height: 14px; transition: transform 0.3s; }
.sidebar.collapsed .sidebar-toggle svg { transform: rotate(180deg); }
.new-chat-btn {
  margin: 12px; padding: 10px 14px; border-radius: 10px;
  background: var(--accent); color: white; border: none; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  font-family:'DM Sans',sans-serif; font-weight:500; font-size:0.875rem;
  transition: background 0.2s, box-shadow 0.2s; white-space: nowrap; overflow: hidden;
  box-shadow: 0 4px 12px var(--accent-glow);
}
.new-chat-btn:hover { background: var(--accent2); }
.new-chat-btn svg { width:16px; height:16px; flex-shrink:0; }
.new-chat-btn span { transition: opacity 0.2s; }
.sidebar.collapsed .new-chat-btn span { opacity:0; width:0; display:none; }
.sidebar.collapsed .new-chat-btn { padding:10px; justify-content:center; }
.sidebar-search { margin: 0 12px 8px; position: relative; }
.sidebar-search input {
  width:100%; padding:8px 12px 8px 32px; background:var(--input-bg);
  border:1px solid var(--border); border-radius:8px; color:var(--fg);
  font-family:'DM Sans',sans-serif; font-size:0.8rem; outline:none; transition:border-color 0.2s;
}
.sidebar-search input:focus { border-color:var(--accent); }
.sidebar-search input::placeholder { color:var(--fg3); }
.sidebar-search .search-icon { position:absolute; left:9px; top:50%; transform:translateY(-50%); color:var(--fg3); width:14px; height:14px; }
.sidebar.collapsed .sidebar-search { display:none; }
.history-empty {
  display:flex; flex-direction:column; align-items:center; gap:8px;
  padding:32px 12px; color:var(--fg3); font-size:0.78rem; text-align:center;
}
.history-empty svg { width:28px; height:28px; opacity:0.4; }
.sidebar.collapsed .history-empty { display:none; }
.chat-history { flex:1; overflow-y:auto; padding:4px 8px; }
.history-section-label {
  font-size:0.7rem; color:var(--fg3); text-transform:uppercase;
  letter-spacing:0.08em; padding:8px 8px 4px; white-space:nowrap; overflow:hidden;
}
.sidebar.collapsed .history-section-label { display:none; }
.chat-item {
  display:flex; align-items:center; gap:8px; padding:8px 10px;
  border-radius:8px; cursor:pointer; position:relative; transition:background 0.15s;
}
.chat-item:hover { background:var(--card-hover); }
.chat-item.active { background:var(--accent-subtle); }
.chat-item-icon { width:18px; height:18px; color:var(--fg3); flex-shrink:0; }
.chat-item-text {
  font-size:0.82rem; color:var(--fg2); white-space:nowrap;
  overflow:hidden; text-overflow:ellipsis; flex:1; transition:opacity 0.2s;
}
.sidebar.collapsed .chat-item-text { opacity:0; width:0; }
.chat-item.active .chat-item-text { color:var(--fg); }
.sidebar-bottom { border-top:1px solid var(--border); padding:8px; display:flex; flex-direction:column; gap:2px; flex-shrink:0; }
.sidebar-action {
  display:flex; align-items:center; gap:10px; padding:9px 10px;
  border-radius:8px; cursor:pointer; transition:background 0.15s;
  text-decoration:none; color:var(--fg2); font-size:0.83rem;
  white-space:nowrap; overflow:hidden; border:none; background:transparent;
  width:100%; text-align:left; font-family:'DM Sans',sans-serif;
}
.sidebar-action:hover { background:var(--card-hover); color:var(--fg); }
.sidebar-action svg { width:16px; height:16px; flex-shrink:0; color:var(--fg3); }
.sidebar-action:hover svg { color:var(--fg); }
.sidebar-action .action-label { transition: opacity 0.2s; }
.sidebar.collapsed .action-label { opacity:0; width:0; display:none; }
.sidebar.collapsed .sidebar-action { justify-content:center; padding:9px; }

/* Main */
.main { flex:1; display:flex; flex-direction:column; height:100vh; overflow:hidden; position:relative; background:var(--bg); transition:background 0.3s; }
.topbar { display:flex; align-items:center; justify-content:space-between; padding:12px 20px; border-bottom:1px solid var(--border); flex-shrink:0; background:var(--bg); transition:background 0.3s, border-color 0.3s; z-index:10; }
.topbar-left { display:flex; align-items:center; gap:10px; }
.model-selector {
  display:flex; align-items:center; gap:6px; padding:6px 12px;
  background:var(--card); border:1px solid var(--border); border-radius:8px;
  cursor:pointer; transition:border-color 0.2s, background 0.2s; color:var(--fg);
  font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:500;
}
.model-selector:hover { border-color:var(--accent); background:var(--card-hover); }
.model-selector svg { width:14px; height:14px; color:var(--fg3); }
.topbar-right { display:flex; align-items:center; gap:8px; }
.icon-btn {
  width:36px; height:36px; border-radius:8px; background:transparent;
  border:1px solid transparent; color:var(--fg2); cursor:pointer;
  display:flex; align-items:center; justify-content:center; transition:all 0.2s;
  font-family:'DM Sans',sans-serif;
}
.icon-btn svg { width:18px; height:18px; }
.icon-btn:hover { background:var(--card-hover); border-color:var(--border); color:var(--fg); }
.zam-btn {
  display:flex; align-items:center; gap:6px; padding:6px 12px;
  background:var(--card); border:1px solid var(--border); border-radius:8px;
  color:var(--fg2); font-size:0.8rem; font-weight:500; cursor:pointer;
  text-decoration:none; transition:all 0.2s; font-family:'DM Sans',sans-serif;
}
.zam-btn:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-subtle); }
.zam-btn svg { width:14px; height:14px; }

/* Chat area */
.chat-area { flex:1; overflow-y:auto; padding:24px 0; display:flex; flex-direction:column; }
.welcome-screen {
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  flex:1; padding:40px 20px; text-align:center; gap:28px;
  animation: fadeUp 0.6s ease;
}
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.welcome-logo {
  width:72px; height:72px; border-radius:20px;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 8px 32px var(--accent-glow), 0 0 0 1px rgba(124,58,237,0.3);
  animation:pulse-logo 3s ease-in-out infinite;
}
@keyframes pulse-logo {
  0%,100%{box-shadow:0 8px 32px var(--accent-glow),0 0 0 1px rgba(124,58,237,0.3)}
  50%{box-shadow:0 8px 48px rgba(124,58,237,0.4),0 0 0 1px rgba(124,58,237,0.5)}
}
.welcome-logo svg { width:40px; height:40px; }
.welcome-title { font-family:'Syne',sans-serif; font-weight:800; font-size:clamp(1.6rem,4vw,2.4rem); color:var(--fg); letter-spacing:-0.04em; line-height:1.1; }
.welcome-title span { background:linear-gradient(135deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.welcome-subtitle { color:var(--fg2); font-size:1rem; max-width:420px; line-height:1.6; }
.capability-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:10px; width:100%; max-width:680px; }
.cap-card { padding:16px; background:var(--card); border:1px solid var(--border); border-radius:12px; cursor:pointer; transition:all 0.2s; text-align:left; display:flex; flex-direction:column; gap:8px; }
.cap-card:hover { background:var(--card-hover); border-color:var(--accent); transform:translateY(-1px); }
.cap-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.1rem; }
.cap-title { font-size:0.82rem; font-weight:600; color:var(--fg); font-family:'Syne',sans-serif; }
.cap-desc { font-size:0.75rem; color:var(--fg3); line-height:1.4; }
.suggestion-pills { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; max-width:560px; }
.suggestion-pill { padding:8px 14px; background:var(--card); border:1px solid var(--border); border-radius:20px; font-size:0.82rem; color:var(--fg2); cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
.suggestion-pill:hover { border-color:var(--accent); color:var(--fg); background:var(--accent-subtle); }

/* Messages */
.message-row { padding:16px max(20px,calc(50% - 380px)); display:flex; gap:12px; animation:fadeUp 0.3s ease; }
.message-row.user { justify-content:flex-end; }
.message-row.ai { justify-content:flex-start; }
.message-avatar { width:32px; height:32px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; font-family:'Syne',sans-serif; }
.message-avatar.ai { background:linear-gradient(135deg,var(--accent),var(--accent2)); color:white; }
.message-avatar.user { background:var(--card); border:1px solid var(--border); color:var(--fg2); }
.msg-content-wrap { display:flex; flex-direction:column; }
.message-bubble { max-width:min(520px,75vw); padding:12px 16px; border-radius:14px; font-size:0.9rem; line-height:1.65; }
.message-row.user .message-bubble { background:var(--msg-user-bg); border:1px solid rgba(124,58,237,0.2); border-radius:14px 4px 14px 14px; color:var(--fg); }
.message-row.ai .message-bubble { background:var(--msg-ai-bg); border:1px solid var(--border); border-radius:4px 14px 14px 14px; color:var(--fg); }
.message-bubble pre { background:rgba(0,0,0,0.3); border:1px solid var(--border); border-radius:8px; padding:12px; overflow-x:auto; font-size:0.8rem; margin:8px 0; font-family:'Courier New',monospace; }
[data-theme="light"] .message-bubble pre { background:rgba(0,0,0,0.06); }
.message-actions { display:flex; gap:4px; margin-top:6px; opacity:0; transition:opacity 0.2s; }
.message-row:hover .message-actions { opacity:1; }
.msg-action-btn { padding:4px 8px; background:transparent; border:1px solid var(--border); border-radius:6px; color:var(--fg3); font-size:0.72rem; cursor:pointer; display:flex; align-items:center; gap:4px; transition:all 0.15s; font-family:'DM Sans',sans-serif; }
.msg-action-btn:hover { background:var(--card-hover); color:var(--fg); }
.msg-action-btn svg { width:12px; height:12px; }
.msg-action-btn.voted { color:var(--accent); }
.msg-action-btn.voted-down { color:#EF4444; }

/* Typing indicator */
.typing-indicator { display:flex; gap:4px; padding:4px 0; }
.typing-indicator span { width:6px; height:6px; border-radius:50%; background:var(--fg3); animation:bounce 1.2s ease infinite; }
.typing-indicator span:nth-child(2){animation-delay:0.2s}
.typing-indicator span:nth-child(3){animation-delay:0.4s}
@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}

/* Input */
.input-area { flex-shrink:0; padding:12px 20px 20px; background:var(--bg); transition:background 0.3s; }
.input-container { max-width:760px; margin:0 auto; background:var(--input-bg); border:1px solid var(--border); border-radius:16px; transition:border-color 0.2s, box-shadow 0.2s; overflow:hidden; }
.input-container:focus-within { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }
.input-tools { display:flex; align-items:center; gap:4px; padding:8px 12px 0; flex-wrap:wrap; }
.tool-chip { display:flex; align-items:center; gap:5px; padding:4px 10px; background:var(--card); border:1px solid var(--border); border-radius:20px; font-size:0.75rem; color:var(--fg2); cursor:pointer; transition:all 0.15s; white-space:nowrap; font-family:'DM Sans',sans-serif; }
.tool-chip:hover, .tool-chip.active { border-color:var(--accent); color:var(--accent); background:var(--accent-subtle); }
.tool-chip svg { width:12px; height:12px; }
.attached-file { font-size:0.75rem; color:var(--accent); }
.input-row { display:flex; align-items:flex-end; gap:8px; padding:8px 12px 10px; }
.main-input { flex:1; background:transparent; border:none; outline:none; color:var(--fg); font-family:'DM Sans',sans-serif; font-size:0.95rem; resize:none; max-height:180px; min-height:24px; line-height:1.5; overflow-y:auto; padding:2px 0; }
.main-input::placeholder { color:var(--fg3); }
.send-btn { width:36px; height:36px; border-radius:10px; background:var(--accent); border:none; color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.2s; box-shadow:0 2px 8px var(--accent-glow); }
.send-btn:hover { background:var(--accent2); transform:scale(1.05); }
.send-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
.send-btn svg { width:18px; height:18px; }
.input-footer { display:flex; align-items:center; justify-content:space-between; padding:0 12px 8px; font-size:0.72rem; color:var(--fg3); }

/* Overlay & Panels */
.overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:200; opacity:0; pointer-events:none; transition:opacity 0.3s; backdrop-filter:blur(4px); }
.overlay.open { opacity:1; pointer-events:all; }
.panel { position:fixed; right:0; top:0; bottom:0; width:min(480px,100vw); background:var(--bg2); border-left:1px solid var(--border); z-index:300; display:flex; flex-direction:column; transform:translateX(100%); transition:transform 0.35s cubic-bezier(0.32,0.72,0,1), background 0.3s; }
.panel.open { transform:translateX(0); }
.panel-header { display:flex; align-items:center; justify-content:space-between; padding:20px; border-bottom:1px solid var(--border); flex-shrink:0; }
.panel-title { font-family:'Syne',sans-serif; font-weight:700; font-size:1.1rem; color:var(--fg); }
.close-btn { width:32px; height:32px; border-radius:8px; background:transparent; border:1px solid var(--border); color:var(--fg2); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
.close-btn:hover { background:var(--card-hover); color:var(--fg); }
.close-btn svg { width:16px; height:16px; }
.panel-body { flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:16px; }
.setting-section { display:flex; flex-direction:column; gap:8px; }
.setting-label { font-size:0.72rem; font-weight:600; color:var(--fg3); text-transform:uppercase; letter-spacing:0.08em; font-family:'Syne',sans-serif; }
.setting-row { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:var(--card); border:1px solid var(--border); border-radius:10px; gap:12px; }
.setting-info { flex:1; }
.setting-name { font-size:0.875rem; color:var(--fg); font-weight:500; }
.setting-desc { font-size:0.75rem; color:var(--fg3); margin-top:2px; }
.toggle { width:40px; height:22px; background:var(--border-strong); border-radius:11px; position:relative; cursor:pointer; transition:background 0.2s; flex-shrink:0; border:none; }
.toggle::after { content:''; position:absolute; width:16px; height:16px; border-radius:50%; background:white; top:3px; left:3px; transition:transform 0.2s; }
.toggle.on { background:var(--accent); }
.toggle.on::after { transform:translateX(18px); }
.theme-options { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.theme-opt { padding:12px; border:1px solid var(--border); border-radius:10px; cursor:pointer; text-align:center; font-size:0.82rem; color:var(--fg2); transition:all 0.2s; font-family:'DM Sans',sans-serif; background:transparent; }
.theme-opt:hover { border-color:var(--accent); color:var(--fg); }
.theme-opt.active { border-color:var(--accent); background:var(--accent-subtle); color:var(--accent); }
.about-card { padding:20px; background:var(--card); border:1px solid var(--border); border-radius:12px; display:flex; flex-direction:column; gap:12px; }
.about-logo { width:56px; height:56px; border-radius:14px; background:linear-gradient(135deg,var(--accent),var(--accent2)); display:flex; align-items:center; justify-content:center; box-shadow:0 6px 20px var(--accent-glow); }
.about-logo svg { width:32px; height:32px; }
.about-name { font-family:'Syne',sans-serif; font-weight:800; font-size:1.3rem; color:var(--fg); }
.about-meta { font-size:0.8rem; color:var(--fg3); line-height:1.5; }
.link-card { display:flex; align-items:center; gap:12px; padding:14px; background:var(--card); border:1px solid var(--border); border-radius:10px; text-decoration:none; transition:all 0.2s; cursor:pointer; }
.link-card:hover { border-color:var(--accent); background:var(--card-hover); }
.link-card-icon { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.link-card-info { flex:1; }
.link-card-name { font-size:0.875rem; font-weight:600; color:var(--fg); }
.link-card-desc { font-size:0.75rem; color:var(--fg3); margin-top:2px; }
.link-card-arrow { color:var(--fg3); }
.link-card-arrow svg { width:16px; height:16px; }
.contact-form { display:flex; flex-direction:column; gap:12px; }
.form-field { display:flex; flex-direction:column; gap:5px; }
.form-label { font-size:0.78rem; color:var(--fg2); font-weight:500; }
.form-input, .form-textarea { padding:10px 12px; background:var(--input-bg); border:1px solid var(--border); border-radius:8px; color:var(--fg); font-family:'DM Sans',sans-serif; font-size:0.875rem; outline:none; transition:border-color 0.2s; }
.form-input:focus, .form-textarea:focus { border-color:var(--accent); }
.form-input::placeholder, .form-textarea::placeholder { color:var(--fg3); }
.form-textarea { resize:vertical; min-height:100px; }
.submit-btn { padding:11px 20px; background:var(--accent); color:white; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-weight:600; font-size:0.875rem; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 12px var(--accent-glow); }
.submit-btn:hover { background:var(--accent2); }

/* Context menu */
.context-menu { position:fixed; background:var(--bg2); border:1px solid var(--border-strong); border-radius:10px; padding:4px; z-index:500; min-width:160px; box-shadow:0 8px 32px rgba(0,0,0,0.4); animation:fadeIn 0.15s ease; }
@keyframes fadeIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
.ctx-item { display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:6px; cursor:pointer; font-size:0.82rem; color:var(--fg2); transition:all 0.15s; font-family:'DM Sans',sans-serif; background:transparent; border:none; width:100%; text-align:left; }
.ctx-item:hover { background:var(--card-hover); color:var(--fg); }
.ctx-item.danger { color:#EF4444; }
.ctx-item.danger:hover { background:rgba(239,68,68,0.1); }
.ctx-item svg { width:14px; height:14px; }
.ctx-divider { height:1px; background:var(--border); margin:3px 0; }

/* Model dropdown */
.model-dropdown-wrap { position:relative; }
.model-dropdown { position:absolute; top:calc(100% + 8px); left:0; background:var(--bg2); border:1px solid var(--border-strong); border-radius:12px; padding:6px; z-index:200; min-width:220px; box-shadow:0 8px 32px rgba(0,0,0,0.4); animation:fadeIn 0.15s ease; }
.model-opt { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px; cursor:pointer; transition:all 0.15s; font-family:'DM Sans',sans-serif; background:transparent; border:none; width:100%; text-align:left; }
.model-opt:hover { background:var(--card-hover); }
.model-opt.active { background:var(--accent-subtle); }
.model-opt-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.model-opt-info { flex:1; }
.model-opt-name { font-size:0.875rem; font-weight:600; color:var(--fg); }
.model-opt-desc { font-size:0.72rem; color:var(--fg3); }
.model-check { color:var(--accent); }
.model-check svg { width:14px; height:14px; }

/* Toast */
.toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(80px); background:var(--bg3); border:1px solid var(--border-strong); border-radius:10px; padding:10px 18px; font-size:0.83rem; color:var(--fg); z-index:9000; transition:transform 0.3s ease, opacity 0.3s; opacity:0; display:flex; align-items:center; gap:8px; box-shadow:0 4px 20px rgba(0,0,0,0.4); font-family:'DM Sans',sans-serif; pointer-events:none; }
.toast.show { transform:translateX(-50%) translateY(0); opacity:1; }
.toast svg { width:16px; height:16px; color:var(--accent); }

/* Mobile */
.mobile-sidebar-toggle { display:none; position:fixed; top:14px; left:12px; z-index:150; width:36px; height:36px; border-radius:8px; background:var(--bg2); border:1px solid var(--border); color:var(--fg); cursor:pointer; align-items:center; justify-content:center; }
.mobile-sidebar-toggle svg { width:18px; height:18px; }
@media(max-width:640px){
  .sidebar { position:fixed; top:0; left:0; bottom:0; z-index:150; transform:translateX(-100%); width:260px!important; min-width:260px!important; }
  .sidebar.mobile-open { transform:translateX(0); }
  .sidebar-toggle { display:none; }
  .mobile-sidebar-toggle { display:flex; }
  .zam-btn span { display:none; }
  .capability-grid { grid-template-columns:1fr 1fr; }
}
`;

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const HELIX_SYSTEM = `You are Helix, an advanced AI assistant created by Zam (Muhammed Nisam CM), a Developer and visual designer from Kerala, India. You are helpful, knowledgeable, and friendly. You assist users with coding, writing, analysis, creative work, and general questions. When asked who created you, say you were built by Zam. Keep responses clear, well-structured, and concise.`;

const MODELS = [
  { id: "pro",    name: "Helix Pro",    desc: "Advanced reasoning & creativity", color: "#7C3AED" },
  { id: "flash",  name: "Helix Flash",  desc: "Faster, lighter responses",       color: "#10B981" },
  { id: "vision", name: "Helix Vision", desc: "Image understanding & generation", color: "#F59E0B" },
  { id: "code",   name: "Helix Code",   desc: "Specialized for code",            color: "#3B82F6" },
];

const CAP_CARDS = [
  { icon: "💻", title: "Write Code",    desc: "Generate, debug, or explain code in any language",   prompt: "Write me a React component for a dark mode toggle" },
  { icon: "🎨", title: "Create Images", desc: "Generate stunning visuals from text descriptions",    prompt: "Generate an image of a futuristic city at night" },
  { icon: "✍️", title: "Write & Edit",  desc: "Craft emails, essays, stories, and more",            prompt: "Write a professional cover letter for a developer role" },
  { icon: "📊", title: "Analyze Data",  desc: "Understand charts, spreadsheets, and datasets",      prompt: "Analyze and summarize this data for me" },
];
const CAP_COLORS = ["rgba(59,130,246,0.15)","rgba(245,158,11,0.15)","rgba(16,185,129,0.15)","rgba(239,68,68,0.15)"];

const SUGGESTIONS = [
  "What can you help me with?",
  "Explain quantum computing simply",
  "Build a simple to-do app in JavaScript",
  "Give me creative logo ideas",
  "Translate this text to Arabic",
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function parseMarkdown(raw) {
  let s = raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  s = s.replace(/```(\w*)\n?([\s\S]*?)```/g, (_,__,code) =>
    `<pre><code>${code.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")}</code></pre>`);
  s = s.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");
  s = s.replace(/\*(.*?)\*/g,"<em>$1</em>");
  s = s.replace(/`([^`]+)`/g,'<code style="background:rgba(124,58,237,0.15);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:0.85em">$1</code>');
  s = s.replace(/\n/g,"<br>");
  return s;
}

function copyToClipboard(text, toast) {
  navigator.clipboard.writeText(text)
    .then(() => toast("Copied to clipboard"))
    .catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
      toast("Copied to clipboard");
    });
}

function generateTitle(text) {
  return text.replace(/\s+/g," ").trim().slice(0,36) + (text.length > 36 ? "…" : "");
}

/* ─────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────── */
const HelixSVG = ({ size = 40 }) => (
  <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
    <path d="M10 8 C18 8 22 20 30 20 C22 20 18 32 10 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9"/>
    <path d="M30 8 C22 8 18 20 10 20 C18 20 22 32 30 32" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <circle cx="20" cy="20" r="2.5" fill="white"/>
    <circle cx="14" cy="13" r="1.8" fill="rgba(255,255,255,0.7)"/>
    <circle cx="26" cy="27" r="1.8" fill="rgba(255,255,255,0.7)"/>
    <circle cx="26" cy="13" r="1.8" fill="rgba(255,255,255,0.4)"/>
    <circle cx="14" cy="27" r="1.8" fill="rgba(255,255,255,0.4)"/>
  </svg>
);

/* ─────────────────────────────────────────
   CURSOR ORB HOOK
───────────────────────────────────────── */
function useCursor() {
  const glowRef  = useRef(null);
  const trailRef = useRef(null);
  const dotRef   = useRef(null);
  const mouse    = useRef({ x: 0, y: 0 });
  const glowPos  = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });
  const visible  = useRef(false);
  const rafId    = useRef(null);

  useEffect(() => {
    const animate = () => {
      const { x: mx, y: my } = mouse.current;
      glowPos.current.x  += (mx - glowPos.current.x)  * 0.07;
      glowPos.current.y  += (my - glowPos.current.y)  * 0.07;
      trailPos.current.x += (mx - trailPos.current.x) * 0.14;
      trailPos.current.y += (my - trailPos.current.y) * 0.14;
      if (glowRef.current) {
        glowRef.current.style.left = glowPos.current.x + "px";
        glowRef.current.style.top  = glowPos.current.y + "px";
      }
      if (trailRef.current) {
        trailRef.current.style.left = trailPos.current.x + "px";
        trailRef.current.style.top  = trailPos.current.y + "px";
      }
      if (dotRef.current) {
        dotRef.current.style.left = mx + "px";
        dotRef.current.style.top  = my + "px";
      }
      rafId.current = requestAnimationFrame(animate);
    };
    animate();

    const onMove = e => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) {
        visible.current = true;
        glowPos.current  = { x: e.clientX, y: e.clientY };
        trailPos.current = { x: e.clientX, y: e.clientY };
        [glowRef, trailRef, dotRef].forEach(r => { if(r.current) r.current.style.opacity = "1"; });
      }
    };
    const onLeave = () => {
      visible.current = false;
      [glowRef, trailRef, dotRef].forEach(r => { if(r.current) r.current.style.opacity = "0"; });
    };
    const onOver = e => {
      const el = e.target.closest("button,a,[data-hover],input,textarea,.cap-card,.suggestion-pill,.chat-item,.tool-chip,.model-opt,.sidebar-action,.link-card");
      if (dotRef.current) dotRef.current.classList.toggle("hovering", !!el);
    };
    const onDown = () => {
      if (glowRef.current) { glowRef.current.style.transform = "translate(-50%,-50%) scale(1.2)"; glowRef.current.style.transition = "transform 0.15s ease, opacity 0.6s ease"; }
    };
    const onUp = () => {
      if (glowRef.current) { glowRef.current.style.transform = "translate(-50%,-50%) scale(1)"; glowRef.current.style.transition = "transform 0.4s ease, opacity 0.6s ease"; }
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  return { glowRef, trailRef, dotRef };
}

/* ─────────────────────────────────────────
   TOAST HOOK
───────────────────────────────────────── */
function useToast() {
  const [toast, setToast] = useState({ msg: "", show: false });
  const timerRef = useRef(null);
  const showToast = useCallback(msg => {
    clearTimeout(timerRef.current);
    setToast({ msg, show: true });
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  }, []);
  return { toast, showToast };
}

/* ─────────────────────────────────────────
   TOGGLE SWITCH
───────────────────────────────────────── */
function Toggle({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return <button className={`toggle ${on ? "on" : ""}`} onClick={() => setOn(v => !v)} />;
}

/* ─────────────────────────────────────────
   MESSAGE COMPONENT
───────────────────────────────────────── */
function Message({ msg, onCopy, onRetry, onEdit, showToast }) {
  const [vote, setVote] = useState(null); // 'up' | 'down' | null
  const html = parseMarkdown(msg.content);
  const isAI = msg.role === "assistant";

  return (
    <div className={`message-row ${isAI ? "ai" : "user"}`}>
      {isAI && <div className="message-avatar ai">H</div>}
      <div className="msg-content-wrap">
        <div className="message-bubble" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="message-actions">
          <button className="msg-action-btn" onClick={() => onCopy(msg.content)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy
          </button>
          {isAI ? (
            <>
              <button className="msg-action-btn" onClick={onRetry}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Retry
              </button>
              <button className={`msg-action-btn ${vote==="up"?"voted":""}`} onClick={() => { setVote("up"); showToast("Thanks for the feedback!"); }}>👍</button>
              <button className={`msg-action-btn ${vote==="down"?"voted-down":""}`} onClick={() => { setVote("down"); showToast("Got it — we'll improve"); }}>👎</button>
            </>
          ) : (
            <button className="msg-action-btn" onClick={() => onEdit(msg.content)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
          )}
        </div>
      </div>
      {!isAI && <div className="message-avatar user">U</div>}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function App() {
  // Theme
  const [theme, setTheme] = useState("dark");
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  // Sidebar
  const [collapsed, setCollapsed]       = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);

  // Panel
  const [activePanel, setActivePanel]   = useState(null); // 'settings'|'about'|'contact'

  // Model
  const [activeModel, setActiveModel]   = useState(MODELS[0]);
  const [modelOpen, setModelOpen]       = useState(false);

  // Chat sessions
  const [sessions, setSessions]         = useState({}); // id -> {title, messages[]}
  const [currentId, setCurrentId]       = useState(null);
  const [messages, setMessages]         = useState([]);
  const [isTyping, setIsTyping]         = useState(false);
  const [searchQ, setSearchQ]           = useState("");
  const idCounterRef = useRef(0);

  // Input
  const [inputVal, setInputVal]         = useState("");
  const [tools, setTools]               = useState(new Set());
  const [attachedFile, setAttachedFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatAreaRef  = useRef(null);

  // Context menu
  const [ctxMenu, setCtxMenu]           = useState({ open: false, x: 0, y: 0, id: null });

  // Contact form
  const [contactForm, setContactForm]   = useState({ name:"", email:"", subject:"", message:"" });

  // Settings toggles
  const [settings, setSettings]         = useState({ streaming:true, memory:true, safeMode:true, autoTitle:true, timestamps:false, chatHistory:true, improve:false });

  const { toast, showToast } = useToast();
  const { glowRef, trailRef, dotRef } = useCursor();

  // Inject global CSS once
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatAreaRef.current) chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [messages, isTyping]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = e => {
      if (e.key === "Escape") setActivePanel(null);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); textareaRef.current?.focus(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handler = e => {
      if (!e.target.closest(".model-dropdown-wrap")) setModelOpen(false);
      if (!e.target.closest(".context-menu") && !e.target.closest(".chat-item")) setCtxMenu(c => ({ ...c, open: false }));
      if (window.innerWidth <= 640 && !e.target.closest(".sidebar") && !e.target.closest(".mobile-sidebar-toggle")) setMobileOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  /* ── Chat logic ── */
  function newChat() {
    setMessages([]);
    setCurrentId(null);
    setInputVal("");
    setTools(new Set());
    setAttachedFile(null);
    setSessions(s => {
      // mark all inactive (selection)
      return s;
    });
  }

  async function sendMessage(text) {
    const msg = (text || inputVal).trim();
    if (!msg || isTyping) return;
    setInputVal("");

    let id = currentId;
    if (!id) {
      id = `chat-${++idCounterRef.current}-${Date.now()}`;
      const title = generateTitle(msg);
      setSessions(prev => ({ ...prev, [id]: { title, messages: [] } }));
      setCurrentId(id);
    }

    const newUserMsg = { role: "user", content: msg, id: Date.now() };
    const updated = [...messages, newUserMsg];
    setMessages(updated);
    setSessions(prev => ({ ...prev, [id]: { ...prev[id], messages: updated } }));

    setIsTyping(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: HELIX_SYSTEM,
          messages: updated.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (data.content?.[0]) {
        const reply = { role: "assistant", content: data.content[0].text, id: Date.now() + 1 };
        const final = [...updated, reply];
        setMessages(final);
        setSessions(prev => ({ ...prev, [id]: { ...prev[id], messages: final } }));
      } else {
        const err = { role: "assistant", content: "⚠️ " + (data.error?.message || "Something went wrong."), id: Date.now() + 1 };
        setMessages(prev => [...prev, err]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Unable to connect. Please try again.", id: Date.now() + 1 }]);
    } finally {
      setIsTyping(false);
    }
  }

  async function regenerate() {
    if (!messages.length || isTyping) return;
    let msgs = [...messages];
    if (msgs[msgs.length - 1].role === "assistant") msgs = msgs.slice(0, -1);
    if (!msgs.length) return;
    setMessages(msgs);
    setIsTyping(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: HELIX_SYSTEM, messages: msgs.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      if (data.content?.[0]) {
        setMessages([...msgs, { role: "assistant", content: data.content[0].text, id: Date.now() }]);
      }
    } catch { setMessages([...msgs, { role: "assistant", content: "⚠️ Connection error.", id: Date.now() }]); }
    finally { setIsTyping(false); }
  }

  function loadChat(id) {
    if (id === currentId) return;
    setCurrentId(id);
    setMessages(sessions[id]?.messages || []);
    if (window.innerWidth <= 640) setMobileOpen(false);
  }

  function deleteChat(id) {
    setSessions(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (id === currentId) { setCurrentId(null); setMessages([]); }
    setCtxMenu(c => ({ ...c, open: false }));
    showToast("Chat deleted");
  }

  function pinChat() { setCtxMenu(c => ({ ...c, open: false })); showToast("Chat pinned"); }
  function renameChat(id) {
    const name = prompt("Rename chat:");
    if (name) {
      setSessions(prev => ({ ...prev, [id]: { ...prev[id], title: name } }));
      showToast("Chat renamed");
    }
    setCtxMenu(c => ({ ...c, open: false }));
  }
  function shareChat() {
    navigator.clipboard.writeText(window.location.href);
    setCtxMenu(c => ({ ...c, open: false }));
    showToast("Link copied to clipboard");
  }

  function toggleTool(t) {
    setTools(prev => { const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n; });
  }

  function fillInput(text) {
    setInputVal(text);
    textareaRef.current?.focus();
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  const filteredSessions = Object.entries(sessions).filter(([, s]) =>
    !searchQ || s.title.toLowerCase().includes(searchQ.toLowerCase())
  );

  /* ─── RENDER ─── */
  return (
    <>
      {/* Cursor orbs */}
      <div ref={glowRef}  className="cursor-glow"  style={{ opacity: 0 }} />
      <div ref={trailRef} className="cursor-trail" style={{ opacity: 0 }} />
      <div ref={dotRef}   className="cursor-dot"   style={{ opacity: 0 }} />

      {/* Mobile sidebar toggle */}
      <button className="mobile-sidebar-toggle" onClick={() => setMobileOpen(o => !o)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      <div className="app">
        {/* ── SIDEBAR ── */}
        <nav className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
          <button className="sidebar-toggle" onClick={() => setCollapsed(c => !c)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          <div className="sidebar-logo">
            <div className="helix-icon"><HelixSVG size={22} /></div>
            <div className="sidebar-logo-text">
              <div className="logo-name">Helix</div>
              <div className="logo-tagline">by Zam</div>
            </div>
          </div>

          <button className="new-chat-btn" onClick={newChat}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            <span>New chat</span>
          </button>

          <div className="sidebar-search">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search chats…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          </div>

          <div className="chat-history">
            {filteredSessions.length === 0 ? (
              <div className="history-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>No chats yet</span>
              </div>
            ) : (
              <>
                <div className="history-section-label">Today</div>
                {filteredSessions.map(([id, s]) => (
                  <div
                    key={id}
                    className={`chat-item ${id === currentId ? "active" : ""}`}
                    onClick={() => loadChat(id)}
                    onContextMenu={e => { e.preventDefault(); setCtxMenu({ open: true, x: e.clientX, y: Math.min(e.clientY, window.innerHeight - 180), id }); }}
                  >
                    <svg className="chat-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span className="chat-item-text">{s.title}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="sidebar-bottom">
            <button className="sidebar-action" onClick={() => setActivePanel("settings")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
              <span className="action-label">Settings</span>
            </button>
            <button className="sidebar-action" onClick={() => setActivePanel("about")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              <span className="action-label">About Helix</span>
            </button>
            <a href="https://muhammednisam.com" target="_blank" rel="noreferrer" className="sidebar-action">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span className="action-label">Zam's Website</span>
            </a>
          </div>
        </nav>

        {/* ── MAIN ── */}
        <main className="main">
          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-left">
              <div className="model-dropdown-wrap">
                <button className="model-selector" onClick={() => setModelOpen(o => !o)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent)" }}><path d="M12 2a5 5 0 1 0 5 5"/><path d="M12 2 8 6l4 4M12 12a5 5 0 1 0 5 5"/><path d="M12 22l-4-4 4-4"/></svg>
                  <span>{activeModel.name}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {modelOpen && (
                  <div className="model-dropdown">
                    {MODELS.map(m => (
                      <button key={m.id} className={`model-opt ${m.id === activeModel.id ? "active" : ""}`} onClick={() => { setActiveModel(m); setModelOpen(false); showToast("Switched to " + m.name); }}>
                        <div className="model-opt-dot" style={{ background: m.color }} />
                        <div className="model-opt-info">
                          <div className="model-opt-name">{m.name}</div>
                          <div className="model-opt-desc">{m.desc}</div>
                        </div>
                        {m.id === activeModel.id && (
                          <div className="model-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="topbar-right">
              <a href="https://muhammednisam.com" target="_blank" rel="noreferrer" className="zam-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span>Zam's Website</span>
              </a>
              <button className="icon-btn" onClick={() => setActivePanel("contact")} title="Contact Zam">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </button>
              <button className="icon-btn" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} title="Toggle theme">
                {theme === "dark"
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                }
              </button>
              <button className="icon-btn" onClick={() => setActivePanel("settings")} title="Settings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div className="chat-area" ref={chatAreaRef}>
            {messages.length === 0 && !isTyping ? (
              <div className="welcome-screen">
                <div className="welcome-logo"><HelixSVG size={40} /></div>
                <div>
                  <div className="welcome-title">Hello, I'm <span>Helix</span></div>
                  <div className="welcome-subtitle" style={{ marginTop: 8 }}>An AI assistant crafted by Zam. Ask me anything — from code to creative writing.</div>
                </div>
                <div className="capability-grid">
                  {CAP_CARDS.map((c, i) => (
                    <div key={i} className="cap-card" onClick={() => fillInput(c.prompt)}>
                      <div className="cap-icon" style={{ background: CAP_COLORS[i] }}>{c.icon}</div>
                      <div className="cap-title">{c.title}</div>
                      <div className="cap-desc">{c.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="suggestion-pills">
                  {SUGGESTIONS.map((s, i) => (
                    <div key={i} className="suggestion-pill" onClick={() => fillInput(s)}>{s}</div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <Message
                    key={msg.id}
                    msg={msg}
                    onCopy={text => copyToClipboard(text, showToast)}
                    onRetry={regenerate}
                    onEdit={text => { fillInput(text); showToast("Message loaded in input"); }}
                    showToast={showToast}
                  />
                ))}
                {isTyping && (
                  <div className="message-row ai">
                    <div className="message-avatar ai">H</div>
                    <div className="message-bubble">
                      <div className="typing-indicator"><span/><span/><span/></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input area */}
          <div className="input-area">
            <div className="input-container">
              <div className="input-tools">
                {[
                  { id: "img",  label: "Image",       icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg> },
                  { id: "code", label: "Code",        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
                  { id: "web",  label: "Web search",  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
                ].map(t => (
                  <button key={t.id} className={`tool-chip ${tools.has(t.id) ? "active" : ""}`} onClick={() => toggleTool(t.id)}>
                    {t.icon}{t.label}
                  </button>
                ))}
                <button className={`tool-chip ${attachedFile ? "active" : ""}`} onClick={() => fileInputRef.current?.click()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  Attach
                </button>
                <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={e => { if (e.target.files[0]) setAttachedFile(e.target.files[0].name); }} />
                {attachedFile && <span className="attached-file">📎 {attachedFile}</span>}
              </div>

              <div className="input-row">
                <textarea
                  ref={textareaRef}
                  className="main-input"
                  placeholder="Message Helix…"
                  rows={1}
                  value={inputVal}
                  onChange={e => {
                    setInputVal(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
                  }}
                  onKeyDown={handleKey}
                />
                <button className="send-btn" onClick={() => sendMessage()} disabled={!inputVal.trim() || isTyping}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>

              <div className="input-footer">
                <span>Helix can make mistakes. Verify important info.</span>
                <span>{inputVal.length}</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── OVERLAY ── */}
      <div className={`overlay ${activePanel ? "open" : ""}`} onClick={() => setActivePanel(null)} />

      {/* ── SETTINGS PANEL ── */}
      <div className={`panel ${activePanel === "settings" ? "open" : ""}`}>
        <div className="panel-header">
          <div className="panel-title">Settings</div>
          <button className="close-btn" onClick={() => setActivePanel(null)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        </div>
        <div className="panel-body">
          <div className="setting-section">
            <div className="setting-label">Appearance</div>
            <div className="theme-options">
              <button className={`theme-opt ${theme==="light"?"active":""}`} onClick={() => setTheme("light")}>☀️ Light</button>
              <button className={`theme-opt ${theme==="dark"?"active":""}`} onClick={() => setTheme("dark")}>🌙 Dark</button>
            </div>
          </div>
          <div className="setting-section">
            <div className="setting-label">AI Behavior</div>
            {[["Streaming responses","See text appear word by word","streaming",true],["Memory","Helix remembers across conversations","memory",true],["Safe mode","Filter potentially harmful content","safeMode",true]].map(([name,desc,key,def]) => (
              <div className="setting-row" key={key}>
                <div className="setting-info"><div className="setting-name">{name}</div><div className="setting-desc">{desc}</div></div>
                <Toggle defaultOn={def} />
              </div>
            ))}
          </div>
          <div className="setting-section">
            <div className="setting-label">Chat</div>
            {[["Auto-title chats","Automatically name conversations","autoTitle",true],["Show timestamps","Show when messages were sent","timestamps",false]].map(([name,desc,key,def]) => (
              <div className="setting-row" key={key}>
                <div className="setting-info"><div className="setting-name">{name}</div><div className="setting-desc">{desc}</div></div>
                <Toggle defaultOn={def} />
              </div>
            ))}
          </div>
          <div className="setting-section">
            <div className="setting-label">Data</div>
            {[["Chat history","Save and sync conversation history","chatHistory",true],["Improve Helix","Share anonymized data to improve AI","improve",false]].map(([name,desc,key,def]) => (
              <div className="setting-row" key={key}>
                <div className="setting-info"><div className="setting-name">{name}</div><div className="setting-desc">{desc}</div></div>
                <Toggle defaultOn={def} />
              </div>
            ))}
          </div>
          <div className="setting-section">
            <div className="setting-label">Danger Zone</div>
            <div className="setting-row">
              <div className="setting-info"><div className="setting-name">Clear chat history</div><div className="setting-desc">Delete all conversations permanently</div></div>
              <button onClick={() => { setSessions({}); setMessages([]); setCurrentId(null); showToast("Chat history cleared"); }} style={{ padding:"6px 14px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",color:"#EF4444",borderRadius:6,cursor:"pointer",fontSize:"0.8rem",fontFamily:"'DM Sans',sans-serif" }}>Clear all</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── ABOUT PANEL ── */}
      <div className={`panel ${activePanel === "about" ? "open" : ""}`}>
        <div className="panel-header">
          <div className="panel-title">About Helix</div>
          <button className="close-btn" onClick={() => setActivePanel(null)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        </div>
        <div className="panel-body">
          <div className="about-card">
            <div className="about-logo"><HelixSVG size={32} /></div>
            <div className="about-name">Helix AI</div>
            <div className="about-meta">Version 1.0.0 · Built by Zam<br/>A powerful AI assistant for everyone. Capable of reasoning, creating, coding, and understanding — all in one platform.</div>
          </div>
          <div className="setting-label">Developer</div>
          <div className="link-card" onClick={() => window.open("https://muhammednisam.com","_blank")}>
            <div className="link-card-icon" style={{ background:"var(--accent-subtle)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <div className="link-card-info"><div className="link-card-name">Zam — Developer</div><div className="link-card-desc">Visit Zam's portfolio & work</div></div>
            <div className="link-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></div>
          </div>
          <div className="link-card" onClick={() => setActivePanel("contact")}>
            <div className="link-card-icon" style={{ background:"rgba(16,185,129,0.1)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div className="link-card-info"><div className="link-card-name">Contact Zam</div><div className="link-card-desc">Send a message or collaboration request</div></div>
            <div className="link-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></div>
          </div>
          <div className="link-card" onClick={() => window.open("https://linkedin.com/in/muhammed-nisam","_blank")}>
            <div className="link-card-icon" style={{ background:"rgba(59,130,246,0.1)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#3B82F6"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </div>
            <div className="link-card-info"><div className="link-card-name">LinkedIn</div><div className="link-card-desc">Connect professionally</div></div>
            <div className="link-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></div>
          </div>
          <div className="setting-label">Legal</div>
          <div className="about-meta" style={{ color:"var(--fg3)",fontSize:"0.78rem",lineHeight:1.6 }}>Helix AI is developed by Zam (Muhammed Nisam CM). This platform uses AI to generate responses. Always verify important information. © 2025 Helix by Zam. All rights reserved.</div>
        </div>
      </div>

      {/* ── CONTACT PANEL ── */}
      <div className={`panel ${activePanel === "contact" ? "open" : ""}`}>
        <div className="panel-header">
          <div className="panel-title">Contact Zam</div>
          <button className="close-btn" onClick={() => setActivePanel(null)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        </div>
        <div className="panel-body">
          <div className="about-meta" style={{ color:"var(--fg2)" }}>Have a project idea, collaboration request, or just want to say hello? Reach out to Zam directly.</div>
          <div className="contact-form">
            <div className="form-field"><label className="form-label">Your Name</label><input className="form-input" type="text" placeholder="John Doe" value={contactForm.name} onChange={e => setContactForm(f=>({...f,name:e.target.value}))} /></div>
            <div className="form-field"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com" value={contactForm.email} onChange={e => setContactForm(f=>({...f,email:e.target.value}))} /></div>
            <div className="form-field"><label className="form-label">Subject</label><input className="form-input" type="text" placeholder="Project collaboration…" value={contactForm.subject} onChange={e => setContactForm(f=>({...f,subject:e.target.value}))} /></div>
            <div className="form-field"><label className="form-label">Message</label><textarea className="form-textarea" placeholder="Tell Zam about your project or idea…" value={contactForm.message} onChange={e => setContactForm(f=>({...f,message:e.target.value}))} /></div>
            <button className="submit-btn" onClick={() => { showToast("Message sent! Zam will get back to you soon."); setActivePanel(null); setContactForm({name:"",email:"",subject:"",message:""}); }}>Send Message →</button>
          </div>
          <div className="setting-label" style={{ marginTop:8 }}>Or reach out directly</div>
          <div className="link-card" onClick={() => window.open("mailto:nisamcmapple@gmail.com")}>
            <div className="link-card-icon" style={{ background:"rgba(124,58,237,0.1)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div className="link-card-info"><div className="link-card-name">nisamcmapple@gmail.com</div><div className="link-card-desc">Send an email directly</div></div>
          </div>
          <div className="link-card" onClick={() => window.open("https://instagram.com/z._a_.m","_blank")}>
            <div className="link-card-icon" style={{ background:"rgba(236,72,153,0.1)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </div>
            <div className="link-card-info"><div className="link-card-name">@z._a_.m</div><div className="link-card-desc">Follow on Instagram</div></div>
          </div>
        </div>
      </div>

      {/* ── CONTEXT MENU ── */}
      {ctxMenu.open && (
        <div className="context-menu" style={{ left: ctxMenu.x, top: ctxMenu.y }}>
          <button className="ctx-item" onClick={pinChat}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 1l-6 6-4 4 2 2 3-3v5l-2 2 2 2 2-2h5l-3 3 2 2 4-4 6-6z"/></svg>
            Pin chat
          </button>
          <button className="ctx-item" onClick={() => renameChat(ctxMenu.id)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Rename
          </button>
          <button className="ctx-item" onClick={shareChat}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share
          </button>
          <div className="ctx-divider" />
          <button className="ctx-item danger" onClick={() => deleteChat(ctxMenu.id)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Delete
          </button>
        </div>
      )}

      {/* ── TOAST ── */}
      <div className={`toast ${toast.show ? "show" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
        <span>{toast.msg}</span>
      </div>
    </>
  );
}
