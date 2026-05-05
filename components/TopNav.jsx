'use client'
import { useEffect, useRef, useState } from 'react'

const EASE_FAST = 'cubic-bezier(.62,.61,.02,1)'

export default function TopNav({ title = '' }) {
  const [widths, setWidths] = useState({ slot1: 0, slot2: 0 })
  const [entered, setEntered] = useState(false)
  const [compact, setCompact] = useState(false)
  const ghost1Ref = useRef(null)
  const ghost2Ref = useRef(null)
  const navRef = useRef(null)

  useEffect(() => {
    setWidths({
      slot1: ghost1Ref.current?.scrollWidth ?? 0,
      slot2: ghost2Ref.current?.scrollWidth ?? 0,
    })
    const t = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(t)
  }, [title])

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        if (y > lastY && y > 60) setCompact(true)
        else if (y < lastY) setCompact(false)
        lastY = y
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const slotStyle = (width, widthDelay) => ({
    position: 'relative',
    height: '1em',
    overflow: 'hidden',
    width: entered ? width : 0,
    transition: `width 700ms ${EASE_FAST} ${widthDelay}ms`,
  })

  const textStyle = (textDelay) => ({
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    whiteSpace: 'nowrap',
    transform: entered ? 'translateY(0%)' : 'translateY(110%)',
    transition: `transform 700ms ${EASE_FAST} ${textDelay}ms`,
  })

  return (
    <>
      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          height: '15vh',
          background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
      <nav
        ref={navRef}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: `${compact ? '1.25rem' : '4.5rem'} 2rem 1.5rem`,
          transition: `padding-top 300ms ${EASE_FAST}`,
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.4375rem', fontSize: 'var(--p-size)', fontWeight: 400, letterSpacing: '0em', lineHeight: 1.75 }}
        >
          {/* Slot 1: Todd Wu home link */}
          <div style={slotStyle(widths.slot1, 100)}>
            <div
              ref={ghost1Ref}
              style={{ position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap', pointerEvents: 'none' }}
            >
              <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#4E008E', verticalAlign: 'middle', marginRight: 5 }} />
              Todd Wu
              <span style={{ color: '#808080', marginLeft: 5 }}>›</span>
            </div>
            <div style={textStyle(0)}>
              <a
                href="/?skip=1"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#808080', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#1c1c1e'}
                onMouseLeave={e => e.currentTarget.style.color = '#808080'}
              >
                <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#4E008E', flexShrink: 0 }} />
                Todd Wu
                <span style={{ color: '#808080' }}>›</span>
              </a>
            </div>
          </div>

          {/* Slot 2: page title */}
          {title && (
            <div style={slotStyle(widths.slot2, 200)}>
              <div
                ref={ghost2Ref}
                style={{ position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap', pointerEvents: 'none' }}
              >
                {title}
              </div>
              <div style={textStyle(100)}>
                <span style={{ color: '#1c1c1e', fontWeight: 400 }}>{title}</span>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
