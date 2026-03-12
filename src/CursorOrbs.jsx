import { useEffect, useRef } from 'react'

export default function CursorOrbs() {
  const glowRef = useRef(null)
  const trailRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const glow = glowRef.current
    const trail = trailRef.current
    const dot = dotRef.current
    if (!glow || !trail || !dot) return

    let mouseX = 0, mouseY = 0
    let glowX = 0, glowY = 0
    let trailX = 0, trailY = 0
    let visible = false
    let rafId

    const GLOW_EASE = 0.07
    const TRAIL_EASE = 0.14

    function animate() {
      glowX += (mouseX - glowX) * GLOW_EASE
      glowY += (mouseY - glowY) * GLOW_EASE
      trailX += (mouseX - trailX) * TRAIL_EASE
      trailY += (mouseY - trailY) * TRAIL_EASE

      glow.style.left = glowX + 'px'
      glow.style.top  = glowY + 'px'
      trail.style.left = trailX + 'px'
      trail.style.top  = trailY + 'px'
      dot.style.left = mouseX + 'px'
      dot.style.top  = mouseY + 'px'
      rafId = requestAnimationFrame(animate)
    }
    animate()

    function onMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visible) {
        visible = true
        glowX = trailX = mouseX
        glowY = trailY = mouseY
        glow.style.opacity  = '1'
        trail.style.opacity = '1'
        dot.style.opacity   = '1'
      }
    }

    function onLeave() {
      visible = false
      glow.style.opacity  = '0'
      trail.style.opacity = '0'
      dot.style.opacity   = '0'
    }

    function onOver(e) {
      const el = e.target.closest('button, a, [role="button"], .cap-card, .suggestion-pill, .chat-item, .tool-chip, .model-opt, .sidebar-action, .link-card, .ctx-item')
      if (el) {
        dot.style.width  = '12px'
        dot.style.height = '12px'
        dot.style.background = 'rgba(168,85,247,0.6)'
        dot.style.boxShadow  = '0 0 12px rgba(168,85,247,0.35)'
      } else {
        dot.style.width  = '6px'
        dot.style.height = '6px'
        dot.style.background = 'rgba(168,85,247,0.45)'
        dot.style.boxShadow  = '0 0 6px rgba(168,85,247,0.25)'
      }
    }

    function onDown() {
      glow.style.transform = 'translate(-50%, -50%) scale(1.2)'
      glow.style.transition = 'transform 0.15s ease, opacity 0.6s ease'
    }
    function onUp() {
      glow.style.transform = 'translate(-50%, -50%) scale(1)'
      glow.style.transition = 'transform 0.4s ease, opacity 0.6s ease'
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
    }
  }, [])

  return (
    <>
      <div ref={glowRef}  className="cursor-glow"  />
      <div ref={trailRef} className="cursor-trail" />
      <div ref={dotRef}   className="cursor-dot"   />
    </>
  )
}
