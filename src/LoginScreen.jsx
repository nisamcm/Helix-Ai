import { useEffect, useRef } from 'react'
import { HelixLogo } from './icons'

export default function LoginScreen({ onLogin }) {
  const btnRef = useRef(null)

  useEffect(() => {
    // Wait for Google script to load
    function initGoogle() {
      if (!window.google) return
      window.google.accounts.id.initialize({
        client_id: window.GOOGLE_CLIENT_ID,
        callback: handleCredential,
        auto_select: false,
      })
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        width: 280,
      })
    }

    if (window.google) {
      initGoogle()
    } else {
      // Poll until Google script loads
      const interval = setInterval(() => {
        if (window.google) { clearInterval(interval); initGoogle() }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [])

  function handleCredential(response) {
    // Decode JWT to get user info
    const payload = JSON.parse(atob(response.credential.split('.')[1]))
    onLogin({
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      sub: payload.sub,
    })
  }

  return (
    <div className="login-screen">
      {/* Animated background orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <HelixLogo size={32} />
          </div>
          <div className="login-logo-text">Helix</div>
        </div>

        {/* Heading */}
        <div className="login-heading">
          Welcome to <span>Helix AI</span>
        </div>
        <div className="login-subheading">
          Sign in with your Google account to start chatting. <br />
          Free to use — powered by Gemini AI.
        </div>

        {/* Google button rendered here */}
        <div className="login-btn-wrap" ref={btnRef} />

        {/* Features */}
        <div className="login-features">
          {[
            { icon: '⚡', text: 'Powered by Google Gemini' },
            { icon: '🔒', text: 'Secure Google login' },
            { icon: '💬', text: 'Smart AI conversations' },
            { icon: '🎨', text: 'Code, write, analyze' },
          ].map(f => (
            <div key={f.text} className="login-feature">
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="login-footer">
          Built by <a href="https://muhammednisam.com" target="_blank" rel="noreferrer">Zam</a>
          &nbsp;·&nbsp;
          Helix AI v2.0
        </div>
      </div>
    </div>
  )
}
