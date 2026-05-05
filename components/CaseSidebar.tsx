'use client'
import { useEffect, useState, useRef } from 'react'

const NAV = [
  { id: 'hero',         label: 'Intro' },
  { id: 'mission',      label: 'Mission' },
  { id: 'solution',     label: 'Solution' },
  { id: 'context',      label: 'Research' },
  { id: 'ideation',     label: 'Ideation' },
  { id: 'decisions',    label: 'Decisions' },
  { id: 'testing',      label: 'Testing' },
  { id: 'reflection',   label: 'Reflection' },
]

const SHOW_AT = 160
const HIDE_AT  = 60

export default function CaseSidebar() {
  const [activeId, setActiveId]   = useState('hero')
  const [visible,  setVisible]    = useState(false)
  const [exiting,  setExiting]    = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const visibleRef  = useRef(false)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // ── Scroll-spy ──
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    // ── Scroll-triggered sidebar show/hide ──
    function onScroll() {
      const y = window.scrollY
      if (y > SHOW_AT && !visibleRef.current) {
        visibleRef.current = true
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
        setExiting(false)
        setVisible(true)
      } else if (y < HIDE_AT && visibleRef.current) {
        visibleRef.current = false
        setExiting(true)
        setVisible(false)
        exitTimerRef.current = setTimeout(() => setExiting(false), 320)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    }
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const enterTransition = 'opacity 500ms cubic-bezier(.16,1,.3,1), transform 500ms cubic-bezier(.16,1,.3,1)'
  const exitTransition  = 'opacity 280ms cubic-bezier(.4,0,1,1), transform 280ms cubic-bezier(.4,0,1,1)'
  const colorTransition = ', color 300ms cubic-bezier(0,0,.2,1)'

  return (
    <aside className="fixed left-0 top-0 h-full z-40 flex-col pt-10 pl-6 w-[140px] hidden lg:flex">
      <a
        href="/"
        className="mb-8"
        style={{
          fontSize: 'var(--p-size)',
          fontWeight: 400,
          letterSpacing: '0em',
          lineHeight: 1.75,
          color: hoveredId === '__home' ? '#1c1c1e' : '#808080',
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateX(-16px)',
          transition: (exiting ? exitTransition : enterTransition) + colorTransition,
          textDecoration: 'none',
        }}
        onMouseEnter={() => setHoveredId('__home')}
        onMouseLeave={() => setHoveredId(null)}
      >
        Home
      </a>

      <nav className="flex flex-col">
        {NAV.map(({ id, label }, i) => {
          const isActive = activeId === id
          const delay = visible && !exiting ? `${i * 40}ms` : '0ms'
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              className="text-left focus-visible:outline-none"
              style={{
                fontSize: 'var(--p-size)',
                fontWeight: 400,
                letterSpacing: '0em',
                lineHeight: 1.75,
                marginBottom: '0rem',
                color: hoveredId === id ? '#1c1c1e' : isActive ? '#4E008E' : '#808080',
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateX(-16px)',
                transition: (exiting ? exitTransition : enterTransition + ` ${delay}`) + colorTransition,
              }}
            >
              {label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
