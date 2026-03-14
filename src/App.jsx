import { useState, useRef, useEffect } from 'react'
import Sidebar from './Sidebar'
import { SettingsPanel, AboutPanel, ContactPanel } from './Panels'
import Toast from './Toast'
import {
  HelixLogo, IconSun, IconMoon, IconGlobe, IconMail, IconSettings,
  IconDna, IconChevronDown, IconCheck, IconSend, IconImage, IconCode,
  IconPaperclip, IconCopy, IconRefresh, IconEdit, IconMenu
} from './icons'

const HELIX_SYSTEM = `You are Helix, an advanced AI assistant created by Zam (Muhammed Nisam CM), a Developer and visual designer from Kerala, India. You are helpful, knowledgeable, and friendly. You assist users with coding, writing, analysis, creative work, and general questions. When asked who created you, say you were built by Zam. Keep responses clear and well-structured. Use markdown formatting: **bold**, *italic*, inline code, fenced code blocks with language tags, bullet lists, numbered lists, and tables where appropriate.`

const MODELS = [
  { id: 'openai',    name: 'Helix Pro',    desc: 'Smartest — OpenAI via Pollinations',   color: '#7C3AED', model: 'openai' },
  { id: 'mistral',   name: 'Helix Fast',   desc: 'Fast & efficient — Mistral',            color: '#10B981', model: 'mistral' },
  { id: 'llama',     name: 'Helix Open',   desc: 'Open source — Llama by Meta',           color: '#F59E0B', model: 'llama' },
  { id: 'deepseek',  name: 'Helix Code',   desc: 'Best for coding — DeepSeek',            color: '#3B82F6', model: 'deepseek' },
]

/* ─────────────────────────────────────────
   SYNTAX HIGHLIGHTER (no external lib)
───────────────────────────────────────── */
const C = {
  keyword:  '#C792EA', string: '#C3E88D', comment: '#607B96',
  number:   '#F78C6C', fn:     '#82AAFF', tag:     '#F07178',
  attr:     '#FFCB6B', def:    '#EEFFFF',
}

function highlight(raw, lang) {
  const e = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  let s = e(raw)
  const kw = (...words) => new RegExp(`\\b(${words.join('|')})\\b`, 'g')
  const color = (col, rx, group = '$1') =>
    `<span style="color:${col}">${group}</span>`

  if (/^(js|jsx|ts|tsx|javascript|typescript)$/.test(lang)) {
    s = s.replace(/(\/\/[^\n]*)/g,             `<span style="color:${C.comment}">$1</span>`)
    s = s.replace(/(\/\*[\s\S]*?\*\/)/g,       `<span style="color:${C.comment}">$1</span>`)
    s = s.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g,
                                                `<span style="color:${C.string}">$1</span>`)
    s = s.replace(kw('const','let','var','function','return','if','else','for',
                      'while','class','import','export','default','from','async',
                      'await','try','catch','throw','new','typeof','instanceof',
                      'of','in','null','undefined','true','false','=&gt;'),
                                                `<span style="color:${C.keyword}">$1</span>`)
    s = s.replace(/\b(\d+\.?\d*)\b/g,          `<span style="color:${C.number}">$1</span>`)
    s = s.replace(/\b([A-Za-z_$][\w$]*)\s*(?=\()/g,
                                                `<span style="color:${C.fn}">$1</span>`)
  } else if (/^(py|python)$/.test(lang)) {
    s = s.replace(/(#[^\n]*)/g,                `<span style="color:${C.comment}">$1</span>`)
    s = s.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*')/g,
                                                `<span style="color:${C.string}">$1</span>`)
    s = s.replace(kw('def','class','return','import','from','if','elif','else','for',
                      'while','in','not','and','or','True','False','None','async',
                      'await','try','except','with','as','pass','break','lambda'),
                                                `<span style="color:${C.keyword}">$1</span>`)
    s = s.replace(/\b(\d+\.?\d*)\b/g,          `<span style="color:${C.number}">$1</span>`)
    s = s.replace(/\b([A-Za-z_][\w]*)\s*(?=\()/g,
                                                `<span style="color:${C.fn}">$1</span>`)
  } else if (/^(css|scss)$/.test(lang)) {
    s = s.replace(/(\/\*[\s\S]*?\*\/)/g,       `<span style="color:${C.comment}">$1</span>`)
    s = s.replace(/([.#]?[A-Za-z-]+)\s*\{/g,   `<span style="color:${C.tag}">$1</span>{`)
    s = s.replace(/([a-z-]+)\s*:/g,            `<span style="color:${C.attr}">$1</span>:`)
    s = s.replace(/(["'][^"']*["'])/g,          `<span style="color:${C.string}">$1</span>`)
    s = s.replace(/\b(\d+\.?\d*(?:px|em|rem|%|vh|vw|s|ms)?)\b/g,
                                                `<span style="color:${C.number}">$1</span>`)
  } else if (/^(html|xml)$/.test(lang)) {
    s = s.replace(/(&lt;\/?[A-Za-z][\w-]*)/g,  `<span style="color:${C.tag}">$1</span>`)
    s = s.replace(/\s([A-Za-z-]+=)/g,          ` <span style="color:${C.attr}">$1</span>`)
    s = s.replace(/(["'][^"']*["'])/g,          `<span style="color:${C.string}">$1</span>`)
    s = s.replace(/(\/&gt;|&gt;)/g,            `<span style="color:${C.tag}">$1</span>`)
  } else {
    s = s.replace(/(["'`][^"'`\n]*["'`])/g,    `<span style="color:${C.string}">$1</span>`)
    s = s.replace(/\b(\d+\.?\d*)\b/g,          `<span style="color:${C.number}">$1</span>`)
  }
  return s
}

/* ─────────────────────────────────────────
   MARKDOWN RENDERER
───────────────────────────────────────── */
function renderMarkdown(text) {
  if (!text) return ''
  let s = text

  // Fenced code blocks
  s = s.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const trimmed = code.replace(/\n$/, '')
    const hl = highlight(trimmed, (lang || '').toLowerCase())
    const lbl = lang || 'code'
    return `<div class="code-block"><div class="code-header"><span class="code-lang">${lbl}</span><button class="code-copy-btn" onclick="(function(b){const t=b.closest('.code-block').querySelector('code').innerText;navigator.clipboard.writeText(t);b.textContent='Copied!';setTimeout(()=>b.textContent='Copy',2000)})(this)">Copy</button></div><pre><code>${hl}</code></pre></div>`
  })

  // Inline code
  s = s.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>')

  // Markdown tables
  s = s.replace(/((?:\|.+\|\n)+)/g, block => {
    const rows = block.trim().split('\n').filter(r => !/^\|[-:| ]+\|$/.test(r.trim()))
    if (rows.length < 1) return block
    const parse = r => r.trim().replace(/^\||\|$/g,'').split('|').map(c => c.trim())
    const [head, ...body] = rows
    const ths = parse(head).map(h => `<th>${h}</th>`).join('')
    const trs = body.map(r => `<tr>${parse(r).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')
    return `<div class="md-table-wrap"><table class="md-table"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`
  })

  // Headings
  s = s.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
  s = s.replace(/^## (.+)$/gm,  '<h2 class="md-h2">$1</h2>')
  s = s.replace(/^# (.+)$/gm,   '<h1 class="md-h1">$1</h1>')

  // Bold + italic
  s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  s = s.replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
  s = s.replace(/\*(.+?)\*/g,         '<em>$1</em>')

  // Blockquote
  s = s.replace(/^> (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')

  // Unordered lists
  s = s.replace(/((?:^[ \t]*[-*] .+\n?)+)/gm, block => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^[ \t]*[-*] /, '')}</li>`).join('')
    return `<ul class="md-ul">${items}</ul>`
  })

  // Ordered lists
  s = s.replace(/((?:^\d+\. .+\n?)+)/gm, block => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('')
    return `<ol class="md-ol">${items}</ol>`
  })

  // Horizontal rule
  s = s.replace(/^---$/gm, '<hr class="md-hr" />')

  // Links
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="md-link" href="$2" target="_blank" rel="noreferrer">$1</a>')

  // Line breaks — double newline = paragraph, single = <br>
  const parts = s.split(/\n\n+/)
  s = parts.map(p => {
    if (/^<(div|ul|ol|h[1-6]|blockquote|hr|table|pre)/.test(p.trim())) return p
    return `<p class="md-p">${p.replace(/\n/g, '<br>')}</p>`
  }).join('')

  return s
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea')
    ta.value = text; document.body.appendChild(ta); ta.select()
    document.execCommand('copy'); document.body.removeChild(ta)
  })
}

let idC = 0
function genId() { return ++idC + '-' + Date.now() }
function genTitle(t) { return t.replace(/\s+/g,' ').trim().slice(0,36) + (t.length>36?'…':'') }

/* ─────────────────────────────────────────
   MESSAGE ROW
───────────────────────────────────────── */
function MessageRow({ msg, onCopy, onRetry, onEdit }) {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  if (msg.role === 'ai') {
    return (
      <div className="message-row ai">
        <div className="message-avatar ai">H</div>
        <div style={{minWidth:0,flex:1}}>
          {msg.typing ? (
            <div className="message-bubble ai-bubble">
              <div className="typing-indicator"><span/><span/><span/></div>
            </div>
          ) : (
            <div
              className={`message-bubble ai-bubble markdown-body${msg.streaming?' streaming-bubble':''}`}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content || '') }}
            />
          )}
          {msg.streaming && <span className="stream-cursor"/>}
          {!msg.streaming && !msg.typing && (
            <div className="message-actions">
              <button className="msg-action-btn" onClick={() => { copyToClipboard(msg.content); onCopy() }}><IconCopy/> Copy</button>
              <button className="msg-action-btn" onClick={onRetry}><IconRefresh/> Retry</button>
              <button className={`msg-action-btn${liked?' liked':''}`} onClick={()=>{setLiked(v=>!v);setDisliked(false)}}>👍</button>
              <button className={`msg-action-btn${disliked?' disliked':''}`} onClick={()=>{setDisliked(v=>!v);setLiked(false)}}>👎</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="message-row user">
      <div style={{minWidth:0,flex:1}}>
        <div className="message-bubble user-bubble">{msg.content}</div>
        <div className="message-actions" style={{justifyContent:'flex-end'}}>
          <button className="msg-action-btn" onClick={()=>{copyToClipboard(msg.content);onCopy()}}><IconCopy/> Copy</button>
          <button className="msg-action-btn" onClick={()=>onEdit(msg.content)}><IconEdit/> Edit</button>
        </div>
      </div>
      <div className="message-avatar user">U</div>
    </div>
  )
}

/* ─────────────────────────────────────────
   WELCOME SCREEN
───────────────────────────────────────── */
function WelcomeScreen({ onFill }) {
  const caps = [
    { icon:'💻', bg:'rgba(59,130,246,0.15)',  title:'Write Code',     desc:'Generate, debug, or explain any language',   prompt:'Write a React hook for debouncing input' },
    { icon:'🎨', bg:'rgba(245,158,11,0.15)',  title:'Create Content', desc:'Generate ideas, copy, and creative writing', prompt:'Give me 10 creative name ideas for an AI product' },
    { icon:'✍️', bg:'rgba(16,185,129,0.15)', title:'Write & Edit',   desc:'Craft emails, essays, stories and more',     prompt:'Write a professional cover letter for a developer role' },
    { icon:'📊', bg:'rgba(239,68,68,0.15)',  title:'Analyze & Plan', desc:'Break down complex problems and data',        prompt:'Create a 30-day React learning roadmap' },
  ]
  const pills = [
    'What can you help me with?',
    'Explain async/await in JavaScript',
    'Build a REST API with Node.js',
    'Write a Python web scraper',
    'How do React hooks work?',
  ]
  return (
    <div className="welcome-screen">
      <div className="welcome-logo"><HelixLogo size={40}/></div>
      <div>
        <div className="welcome-title">Hello, I'm <span>Helix</span></div>
        <div className="welcome-subtitle" style={{marginTop:'8px'}}>An AI assistant crafted by Zam. Ask me anything — code, writing, analysis, and more.</div>
      </div>
      <div className="capability-grid">
        {caps.map(c=>(
          <div key={c.title} className="cap-card" onClick={()=>onFill(c.prompt)}>
            <div className="cap-icon" style={{background:c.bg}}>{c.icon}</div>
            <div className="cap-title">{c.title}</div>
            <div className="cap-desc">{c.desc}</div>
          </div>
        ))}
      </div>
      <div className="suggestion-pills">
        {pills.map(p=><div key={p} className="suggestion-pill" onClick={()=>onFill(p)}>{p}</div>)}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function App() {
  const [theme, setThemeState]               = useState('dark')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activePanel, setActivePanel]        = useState(null)
  const [activeModel, setActiveModel]        = useState(MODELS[0])
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [sessions, setSessions]              = useState([])
  const [currentId, setCurrentId]            = useState(null)
  const [displayMessages, setDisplayMessages] = useState([])
  const [inputText, setInputText]            = useState('')
  const [isGenerating, setIsGenerating]      = useState(false)
  const [activeTools, setActiveTools]        = useState(new Set())
  const [attachedFile, setAttachedFile]      = useState(null)
  const [searchQuery, setSearchQuery]        = useState('')
  const [toast, setToast]                    = useState({ msg:'', visible:false })
  const chatAreaRef  = useRef(null)
  const inputRef     = useRef(null)
  const fileInputRef = useRef(null)
  const toastTimer   = useRef(null)
  const messagesRef  = useRef([])

  function showToast(msg) {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ msg, visible:true })
    toastTimer.current = setTimeout(() => setToast(t=>({...t,visible:false})), 3000)
  }

  function setTheme(t) { setThemeState(t); document.documentElement.setAttribute('data-theme',t) }

  useEffect(() => { document.documentElement.setAttribute('data-theme','dark') }, [])

  useEffect(() => {
    if (chatAreaRef.current)
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight
  }, [displayMessages])

  useEffect(() => {
    const onKey = e => {
      if (e.key==='Escape') setActivePanel(null)
      if ((e.metaKey||e.ctrlKey)&&e.key==='k') { e.preventDefault(); inputRef.current?.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleInputChange(e) {
    setInputText(e.target.value)
    const el = e.target; el.style.height='auto'; el.style.height=Math.max(48, Math.min(el.scrollHeight,180))+'px'
  }

  function fillInput(text) { setInputText(text); inputRef.current?.focus() }

  function toggleTool(tool) {
    setActiveTools(prev => { const n=new Set(prev); n.has(tool)?n.delete(tool):n.add(tool); return n })
  }

  /* ── Sessions ── */
  function newChat() {
    setCurrentId(null); setDisplayMessages([]); messagesRef.current=[]; setInputText('')
    setActiveTools(new Set()); setAttachedFile(null)
    if (window.innerWidth<=640) setMobileSidebarOpen(false)
  }
  function loadChat(id) {
    if (id===currentId) return
    const s = sessions.find(s=>s.id===id); if(!s) return
    setCurrentId(id); messagesRef.current=s.messages; setDisplayMessages(s.messages)
    if (window.innerWidth<=640) setMobileSidebarOpen(false)
  }
  function deleteChat(id) {
    setSessions(p=>p.filter(s=>s.id!==id))
    if (id===currentId) { setCurrentId(null); setDisplayMessages([]); messagesRef.current=[] }
    showToast('Chat deleted')
  }
  function renameChat(id) {
    const name=prompt('Rename chat:'); if(!name) return
    setSessions(p=>p.map(s=>s.id===id?{...s,title:name}:s)); showToast('Chat renamed')
  }
  function pinChat(id) { setSessions(p=>p.map(s=>s.id===id?{...s,pinned:!s.pinned}:s)) }
  function clearHistory() {
    setSessions([]); setCurrentId(null); setDisplayMessages([]); messagesRef.current=[]
    showToast('Chat history cleared')
  }

  /* ── Simulated streaming reveal ── */
  function simulateStream(fullText, msgId, onDone) {
    const tokens = fullText.split(/(\s+)/)
    let i = 0, built = ''
    function tick() {
      if (i >= tokens.length) { onDone(fullText); return }
      built += tokens.slice(i, i+4).join('')
      i += 4
      setDisplayMessages(prev => prev.map(m => m.id===msgId ? {...m, content:built, streaming:true} : m))
      setTimeout(tick, 16 + Math.random()*18)
    }
    tick()
  }

  /* ── Send message ── */
  async function sendMessage() {
    const text = inputText.trim()
    if (!text || isGenerating) return

    let chatId = currentId
    if (!chatId) {
      chatId = genId()
      setSessions(prev => [{ id:chatId, title:genTitle(text), messages:[], pinned:false }, ...prev])
      setCurrentId(chatId)
    }

    const userMsg = { id:genId(), role:'user', content:text }
    const history = [...messagesRef.current, userMsg]
    messagesRef.current = history
    setDisplayMessages([...history])
    setSessions(prev => prev.map(s => s.id===chatId ? {...s,messages:history} : s))
    setInputText(''); if(inputRef.current) inputRef.current.style.height='auto'
    setIsGenerating(true)

    const streamId = genId()
    setDisplayMessages(prev => [...prev, { id:streamId, role:'ai', content:'', streaming:true }])

    try {
      // ✅ Full conversation history sent — this is the "memory"
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          model: activeModel.model,
          system: HELIX_SYSTEM,
          messages: history.map(m => ({ role: m.role==='ai'?'assistant':'user', content: m.content }))
        })
      })
      const data = await res.json()
      if (!data.content?.[0]?.text) throw new Error(data.error?.message || 'No response')

      simulateStream(data.content[0].text, streamId, finalText => {
        const aiMsg = { id:streamId, role:'ai', content:finalText, streaming:false }
        const updated = [...history, aiMsg]
        messagesRef.current = updated
        setDisplayMessages(updated)
        setSessions(prev => prev.map(s => s.id===chatId ? {...s,messages:updated} : s))
        setIsGenerating(false)
      })
    } catch (err) {
      const errMsg = { id:streamId, role:'ai', content:'⚠️ '+err.message, streaming:false }
      const updated = [...history, errMsg]
      messagesRef.current = updated; setDisplayMessages(updated); setIsGenerating(false)
    }
  }

  async function regenerate() {
    if (!messagesRef.current.length || isGenerating) return
    const msgs = [...messagesRef.current]
    if (msgs[msgs.length-1].role==='ai') msgs.pop()
    if (!msgs.length) return
    messagesRef.current = msgs; setDisplayMessages([...msgs]); setIsGenerating(true)

    const streamId = genId()
    setDisplayMessages(prev => [...prev, { id:streamId, role:'ai', content:'', streaming:true }])

    try {
      const res = await fetch('/api/chat', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model: activeModel.model, system: HELIX_SYSTEM,
          messages: msgs.map(m=>({role:m.role==='ai'?'assistant':'user',content:m.content}))
        })
      })
      const data = await res.json()
      if (!data.content?.[0]?.text) throw new Error(data.error?.message||'No response')
      simulateStream(data.content[0].text, streamId, finalText => {
        const aiMsg = { id:streamId, role:'ai', content:finalText, streaming:false }
        const updated = [...msgs, aiMsg]
        messagesRef.current = updated; setDisplayMessages(updated)
        setSessions(prev => prev.map(s=>s.id===currentId?{...s,messages:updated}:s))
        setIsGenerating(false)
      })
    } catch (err) {
      setDisplayMessages([...msgs, { id:streamId, role:'ai', content:'⚠️ '+err.message, streaming:false }])
      setIsGenerating(false)
    }
  }

  function handleKey(e) { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage()} }

  const hasMessages = displayMessages.length > 0

  return (
    <div className="app-layout">
      <button className="mobile-sidebar-toggle" onClick={()=>setMobileSidebarOpen(v=>!v)}>
        <IconMenu/>
      </button>

      <Sidebar
        collapsed={sidebarCollapsed} onToggle={()=>setSidebarCollapsed(v=>!v)}
        mobileOpen={mobileSidebarOpen} sessions={sessions} currentId={currentId}
        onNewChat={newChat} onLoadChat={loadChat} onDeleteChat={deleteChat}
        onRenameChat={renameChat} onPinChat={pinChat} onOpenPanel={setActivePanel}
        searchQuery={searchQuery} onSearch={setSearchQuery}
      />

      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <div style={{position:'relative'}}>
              <button className="model-selector" onClick={()=>setModelDropdownOpen(v=>!v)}>
                <IconDna/>
                <span style={{color:'#fff'}}>{activeModel.name}</span>
                <IconChevronDown/>
              </button>
              {modelDropdownOpen && (
                <>
                  <div style={{position:'fixed',inset:0,zIndex:199}} onClick={()=>setModelDropdownOpen(false)}/>
                  <div className="model-dropdown">
                    {MODELS.map(m=>(
                      <div key={m.id} className={`model-opt ${m.id===activeModel.id?'active':''}`}
                        onClick={()=>{setActiveModel(m);setModelDropdownOpen(false);showToast(`Switched to ${m.name}`)}}>
                        <div className="model-opt-dot" style={{background:m.color}}/>
                        <div className="model-opt-info">
                          <div className="model-opt-name">{m.name}</div>
                          <div className="model-opt-desc">{m.desc}</div>
                        </div>
                        {m.id===activeModel.id&&<div className="model-check"><IconCheck/></div>}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="topbar-right">
            <a href="https://muhammednisam.com" target="_blank" rel="noreferrer" className="zam-btn">
              <IconGlobe/><span>Zam's Website</span>
            </a>
            <button className="icon-btn" onClick={()=>setActivePanel('contact')} title="Contact Zam"><IconMail/></button>
            <button className="icon-btn" onClick={()=>setTheme(theme==='dark'?'light':'dark')} title="Toggle theme">
              {theme==='dark'?<IconSun/>:<IconMoon/>}
            </button>
            <button className="icon-btn" onClick={()=>setActivePanel('settings')} title="Settings"><IconSettings/></button>
          </div>
        </div>

        {/* Chat area */}
        <div className="chat-area" ref={chatAreaRef}>
          {!hasMessages ? (
            <WelcomeScreen onFill={fillInput}/>
          ) : (
            displayMessages.map(msg=>(
              <MessageRow key={msg.id} msg={msg}
                onCopy={()=>showToast('Copied to clipboard')}
                onRetry={regenerate}
                onEdit={text=>{setInputText(text);inputRef.current?.focus()}}
              />
            ))
          )}
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-container">
            <div className="input-tools">
              {[
                {id:'img', label:'Image',      Icon:IconImage},
                {id:'code',label:'Code',        Icon:IconCode},
                {id:'web', label:'Web search',  Icon:IconGlobe},
                {id:'file',label:'Attach',      Icon:IconPaperclip},
              ].map(({id,label,Icon})=>(
                <button key={id} className={`tool-chip ${activeTools.has(id)?'active':''}`}
                  onClick={()=>id==='file'?fileInputRef.current?.click():toggleTool(id)}>
                  <Icon/>{label}
                </button>
              ))}
              <input ref={fileInputRef} type="file" style={{display:'none'}}
                onChange={e=>{if(e.target.files[0]){setAttachedFile(e.target.files[0].name);toggleTool('file')}}}/>
              {attachedFile&&<span className="attached-file">📎 {attachedFile}</span>}
            </div>
            <div className="input-row">
              <textarea ref={inputRef} className="main-input" placeholder="Message Helix…"
                rows={1} value={inputText} onChange={handleInputChange} onKeyDown={handleKey}/>
              <button className="send-btn" onClick={sendMessage} disabled={isGenerating||!inputText.trim()}>
                {isGenerating ? <div className="send-spinner"/> : <IconSend/>}
              </button>
            </div>
            <div className="input-footer">
              <span>Helix can make mistakes. Verify important info.</span>
              <span>{inputText.length}</span>
            </div>
          </div>
        </div>
      </main>

      <div className={`overlay ${activePanel?'open':''}`} onClick={()=>setActivePanel(null)}/>
      <SettingsPanel open={activePanel==='settings'} onClose={()=>setActivePanel(null)}
        theme={theme} onSetTheme={setTheme}
        onClearHistory={()=>{clearHistory();setActivePanel(null)}}/>
      <AboutPanel open={activePanel==='about'} onClose={()=>setActivePanel(null)}
        onOpenContact={()=>setActivePanel('contact')}/>
      <ContactPanel open={activePanel==='contact'} onClose={()=>setActivePanel(null)}
        onSubmit={()=>{showToast('Message sent! Zam will get back to you soon.');setActivePanel(null)}}/>
      <Toast message={toast.msg} visible={toast.visible}/>
    </div>
  )
}
