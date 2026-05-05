'use client'

import { useRef, useState } from 'react'

/* ─── Pause button shared by all video blocks ─── */
function VideoBlock({
  caption,
  className = '',
  aspectClass = '',
}: {
  caption?: string
  className?: string
  aspectClass?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)

  function toggle() {
    if (!videoRef.current) return
    if (paused) {
      videoRef.current.play()
      setPaused(false)
    } else {
      videoRef.current.pause()
      setPaused(true)
    }
  }

  return (
    <div className={`w-full bg-[#F8F8F8] overflow-hidden relative ${className}`}>
      <div className={`w-full ${aspectClass} bg-[#E5E5E5] flex items-center justify-center`}>
        {/* placeholder — swap for real <video> */}
        <span className="text-[#999] text-sm">Video placeholder</span>
      </div>
      <button
        onClick={toggle}
        aria-label={paused ? 'Play' : 'Pause'}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors duration-[450ms] ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        {paused ? (
          /* play icon */
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
            <path d="M1 1l10 6L1 13V1z" />
          </svg>
        ) : (
          /* pause icon */
          <svg width="10" height="13" viewBox="0 0 10 13" fill="currentColor">
            <rect x="0" y="0" width="3.5" height="13" rx="1" />
            <rect x="6.5" y="0" width="3.5" height="13" rx="1" />
          </svg>
        )}
      </button>
      {caption && (
        <p className="text-center pt-4 pb-4 text-xs text-text-secondary tracking-wide">
          {caption}
        </p>
      )}
    </div>
  )
}

/* ─── Divider with centered label ─── */
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex flex-row gap-4 items-center case-x-gutter case-mt">
      <div className="flex-1 border-b border-secondary" />
      <h6 className="text-xs uppercase tracking-[0.08em] text-text-secondary whitespace-nowrap shrink-0">
        {label}
      </h6>
      <div className="flex-1 border-b border-secondary" />
    </div>
  )
}

/* ─── Callout / insight box ─── */
function CalloutBox({
  label,
  title,
  desc,
}: {
  label: string
  title: string
  desc: string
}) {
  return (
    <div className="bg-[#F8F8F8] p-6 flex flex-col gap-2 border border-secondary">
      <p className="text-xs uppercase tracking-[0.08em] text-text-secondary">{label}</p>
      <h3 className="text-base font-semibold text-primary leading-snug">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
    </div>
  )
}

/* ─── Image placeholder ─── */
function ImgPlaceholder({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-full bg-[#F8F8F8] flex items-center justify-center ${className}`}
    >
      <img
        src="https://placehold.co/800x480/F8F8F8/999999?text=Image"
        alt="placeholder"
        className="object-contain w-fit h-full"
      />
    </div>
  )
}

/* ─────────────────────────────────────────────── */
/*  PAGE                                           */
/* ─────────────────────────────────────────────── */
export default function CaseStudyPage() {
  const [ideationOpen, setIdeationOpen] = useState(false)
  const [dotIndex, setDotIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const carouselImages = [
    'Concept A — Triage-first flow',
    'Concept B — Document-centric flow',
    'Concept C — Guided wizard flow',
    'Concept D — Assistant-led flow',
  ]

  function handleCarouselScroll() {
    if (!carouselRef.current) return
    const el = carouselRef.current
    const cardW = el.scrollWidth / carouselImages.length
    setDotIndex(Math.round(el.scrollLeft / cardW))
  }

  return (
    <main className="w-full bg-white px-0 md:px-[2rem] lg:px-[2rem] xl:px-[2rem] rounded-[1rem] flex flex-col pb-24">

      {/* ── 1. HERO ──────────────────────────────── */}
      <section id="hero" className="flex flex-col pt-12">
        <div className="case-x-gutter flex flex-col gap-6">
          {/* Logo + tag */}
          <div className="flex items-center gap-3">
            <img
              src="https://placehold.co/32x32/F8F8F8/999999?text=F"
              alt="Forma logo"
              className="w-8 h-8 rounded-md"
            />
            <span className="text-xs uppercase tracking-[0.08em] text-text-secondary">
              Forma · AI Claim
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.06] tracking-[-0.03em] text-primary max-w-[36rem]">
            Redesigning the insurance claim experience with AI
          </h1>

          {/* Team info grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {[
              { label: 'Role', value: 'Lead Product Designer' },
              { label: 'Team', value: 'Todd Wu, 3 Engineers, 1 PM' },
              { label: 'Timeline', value: '12 weeks · Q3 2024' },
              { label: 'Platform', value: 'Web App' },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.08em] text-text-secondary">{label}</p>
                <p className="text-sm text-primary font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cover video */}
        <div className="mt-8">
          <VideoBlock aspectClass="aspect-video" />
        </div>
      </section>

      {/* ── 2. MISSION ───────────────────────────── */}
      <section id="mission" className="flex flex-col case-gap case-mt">
        <div className="case-x-gutter flex flex-col">
          <div className="max-w-full md:max-w-[36rem] lg:max-w-[42rem] xl:max-w-[60rem] flex flex-col gap-4">
            <h6 className="text-xs uppercase tracking-[0.08em] text-text-secondary">Mission</h6>
            <h2 className="text-[clamp(1.625rem,3.2vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.002em] text-primary">
              Cut claim processing time from days to minutes
            </h2>
            <p className="text-[1.0625rem] text-text-secondary leading-[1.75]">
              Forma's existing claim workflow required adjusters to manually review hundreds of
              documents, cross-reference policy terms, and draft settlement letters — a process
              averaging 4.2 days per claim. We embedded AI into every stage to surface the right
              information at the right moment.
            </p>
          </div>
        </div>
        <ImgPlaceholder className="h-[40vh]" />
      </section>

      {/* ── 3. KEY INSIGHTS ──────────────────────── */}
      <section id="key-insights" className="flex flex-col case-gap case-mt">
        <div className="case-x-gutter">
          <h6 className="text-xs uppercase tracking-[0.08em] text-text-secondary mb-4">Key Insights</h6>
        </div>
        <div className="flex flex-col md:flex-col lg:flex-row xl:flex-row gap-[0.5rem] case-x-gutter">
          {/* Column A */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <h6 className="text-xs uppercase tracking-[0.08em] text-text-secondary">Insight 01</h6>
            <h3 className="text-[1.1875rem] font-semibold leading-[1.4] tracking-[-0.01em] text-primary">
              Adjusters distrust AI outputs without clear sourcing
            </h3>
            <p className="text-[1.0625rem] text-text-secondary leading-[1.2]">
              Every AI recommendation needs an inline citation trail. Without it, adjusters
              re-verify every field manually, eliminating all time savings.
            </p>
            <ImgPlaceholder className="h-[40vh] mt-2" />
          </div>
          {/* Column B */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <h6 className="text-xs uppercase tracking-[0.08em] text-text-secondary">Insight 02</h6>
            <h3 className="text-[1.1875rem] font-semibold leading-[1.4] tracking-[-0.01em] text-primary">
              Exception handling is the real bottleneck
            </h3>
            <p className="text-[1.0625rem] text-text-secondary leading-[1.2]">
              68% of delay comes from edge cases the system cannot auto-resolve. The design
              must make escalation paths obvious and frictionless.
            </p>
            <ImgPlaceholder className="h-[40vh] mt-2" />
          </div>
        </div>
      </section>

      {/* ── 4. SOLUTION ──────────────────────────── */}
      <section id="solution" className="flex flex-col case-gap case-mt">
        <div className="case-x-gutter flex flex-col">
          <div className="max-w-full md:max-w-[36rem] lg:max-w-[42rem] xl:max-w-[60rem] flex flex-col gap-4">
            <h6 className="text-xs uppercase tracking-[0.08em] text-text-secondary">Solution</h6>
            <h2 className="text-[clamp(1.625rem,3.2vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.002em] text-primary">
              An AI co-pilot that earns adjuster trust
            </h2>
            <p className="text-[1.0625rem] text-text-secondary leading-[1.75]">
              We built a three-panel workspace: document viewer on the left, AI-extracted data
              in the center with live citation links, and policy terms on the right. Every AI
              suggestion shows its source, confidence level, and a one-click verify path.
            </p>
          </div>
        </div>
        <VideoBlock caption="Final solution walkthrough · 2 min" aspectClass="aspect-video" />
      </section>

      {/* ── 5. RESEARCH DIVIDER ──────────────────── */}
      <SectionDivider label="Research" />

      {/* ── 6. RESEARCH SECTIONS ─────────────────── */}

      {/* Context */}
      <section id="context" className="flex flex-col case-gap case-mt">
        <div className="case-x-gutter flex flex-col">
          <div className="max-w-full md:max-w-[36rem] lg:max-w-[42rem] xl:max-w-[60rem] flex flex-col gap-4">
            <h6 className="text-xs uppercase tracking-[0.08em] text-text-secondary">Context</h6>
            <h2 className="text-[clamp(1.625rem,3.2vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.002em] text-primary">
              A legacy workflow built before digital-first claims
            </h2>
            <p className="text-[1.0625rem] text-text-secondary leading-[1.75]">
              The existing system was a 12-year-old desktop app ported to web. Adjusters
              worked across five separate tools with no shared state. We shadowed six adjusters
              across two regional offices over two weeks.
            </p>
          </div>
        </div>
        <ImgPlaceholder className="h-[40vh]" />
      </section>

      {/* Pain Points */}
      <section id="pain-points" className="flex flex-col case-gap case-mt">
        <div className="case-x-gutter flex flex-col">
          <div className="max-w-full md:max-w-[36rem] lg:max-w-[42rem] xl:max-w-[60rem] flex flex-col gap-4">
            <h6 className="text-xs uppercase tracking-[0.08em] text-text-secondary">Pain Points</h6>
            <h2 className="text-[clamp(1.625rem,3.2vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.002em] text-primary">
              Three critical failure modes
            </h2>
            <ul className="flex flex-col gap-3">
              {[
                'Context switching: adjusters toggle between 5 tools 40+ times per claim',
                'Manual re-entry: the same data is typed into 3 different systems',
                'Audit trail gaps: approvals happen over email, outside the system of record',
              ].map((point, i) => (
                <li key={i} className="flex gap-3 text-[1.0625rem] text-text-secondary leading-[1.75]">
                  <span className="text-xs font-semibold text-text-secondary mt-1 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ImgPlaceholder className="h-[40vh]" />
      </section>

      {/* User Research */}
      <section id="user-research" className="flex flex-col case-gap case-mt">
        <div className="case-x-gutter flex flex-col">
          <div className="max-w-full md:max-w-[36rem] lg:max-w-[42rem] xl:max-w-[60rem] flex flex-col gap-4">
            <h6 className="text-xs uppercase tracking-[0.08em] text-text-secondary">User Research</h6>
            <h2 className="text-[clamp(1.625rem,3.2vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.002em] text-primary">
              18 interviews, 3 mental models
            </h2>
            <p className="text-[1.0625rem] text-text-secondary leading-[1.75]">
              We interviewed 18 adjusters and identified three distinct mental models: the
              Verifier (must see sources), the Delegator (trusts AI if auditable), and the
              Expert (wants AI to handle routine, flag exceptions). The design had to serve all three.
            </p>
          </div>
        </div>
        <ImgPlaceholder className="h-[40vh]" />
      </section>

      {/* ── IDEATION DIVIDER ─────────────────────── */}
      <SectionDivider label="Ideation" />

      {/* ── 7. IDEATION ──────────────────────────── */}
      <section id="ideation" className="flex flex-col case-gap case-mt">
        <div className="case-x-gutter flex flex-col gap-4">
          <div className="max-w-full md:max-w-[36rem] lg:max-w-[42rem] xl:max-w-[60rem] flex flex-col gap-4">
            <h6 className="text-xs uppercase tracking-[0.08em] text-text-secondary">Ideation</h6>
            <h2 className="text-[clamp(1.625rem,3.2vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.002em] text-primary">
              Four directions explored
            </h2>
            <p className="text-[1.0625rem] text-text-secondary leading-[1.75]">
              We ran a two-day design sprint generating concepts across automation levels and
              information architectures. Each direction was stress-tested against our three
              adjuster archetypes.
            </p>
          </div>

          {/* "Ideated with" toggle */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIdeationOpen((v) => !v)}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-text-secondary hover:text-primary transition-colors duration-[450ms] ease-in-out focus-visible:outline-none w-fit"
            >
              <span>{ideationOpen ? '▲' : '▼'}</span>
              4 Ideated with
            </button>
            <div
              className="overflow-hidden transition-[max-height] duration-[450ms] ease-in-out"
              style={{ maxHeight: ideationOpen ? '200px' : '0px' }}
            >
              <ul className="flex flex-col gap-1 pt-2">
                {['Sarah Chen · UX Researcher', 'Marcus Lee · PM', 'Priya Nair · Engineering Lead', 'Tom Walsh · Insurance SME'].map(
                  (name) => (
                    <li key={name} className="text-sm text-text-secondary">
                      {name}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Horizontal scroll carousel */}
        <div className="flex flex-col gap-4">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex flex-row gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 lg:px-20"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {carouselImages.map((label, i) => (
              <div
                key={i}
                className="shrink-0 w-[80%] bg-[#F8F8F8] h-[40vh] flex items-center justify-center rounded-sm"
                style={{ scrollSnapAlign: 'center' }}
              >
                <span className="text-sm text-text-secondary">{label}</span>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2">
            {carouselImages.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!carouselRef.current) return
                  const cardW = carouselRef.current.scrollWidth / carouselImages.length
                  carouselRef.current.scrollTo({ left: cardW * i, behavior: 'smooth' })
                  setDotIndex(i)
                }}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-[450ms] ease-in-out focus-visible:outline-none ${
                  dotIndex === i ? 'bg-primary' : 'bg-secondary'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Callout box */}
        <div className="case-x-gutter">
          <CalloutBox
            label="Key decision"
            title="We chose direction B — document-centric with AI overlay"
            desc="It preserved adjusters' existing mental model while layering AI assistance as a visible, inspectable layer rather than an opaque replacement. Switching cost was lowest; trust ceiling was highest."
          />
        </div>
      </section>

      {/* ── 8. FINAL SOLUTION ────────────────────── */}
      <section id="final-solution" className="flex flex-col case-gap case-mt">
        <div className="case-x-gutter flex flex-col">
          <div className="max-w-full md:max-w-[36rem] lg:max-w-[42rem] xl:max-w-[60rem] flex flex-col gap-4">
            <h6 className="text-xs uppercase tracking-[0.08em] text-text-secondary">Final Solution</h6>
            <h2 className="text-[clamp(1.625rem,3.2vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.002em] text-primary">
              The AI Claim Workspace
            </h2>
            <p className="text-[1.0625rem] text-text-secondary leading-[1.75]">
              A three-panel split view — document, AI extraction, policy — with inline citation
              links, confidence badges, one-click escalation, and a full audit trail baked into
              every adjuster action. Ships with a picture-in-picture prototype overlay for
              in-context handoff reviews.
            </p>
          </div>
        </div>

        {/* Video with PiP overlay */}
        <div className="relative">
          <VideoBlock caption="Full prototype walkthrough · 4 min" aspectClass="aspect-video" />
          {/* PiP overlay */}
          <div className="absolute bottom-12 right-4 w-[160px] md:w-[220px] bg-[#F8F8F8] border border-secondary shadow-sm overflow-hidden rounded-sm">
            <div className="aspect-video bg-[#E5E5E5] flex items-center justify-center">
              <span className="text-[10px] text-text-secondary">PiP overlay</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. KEY LEARNINGS ─────────────────────── */}
      <section id="learnings" className="flex flex-col case-gap case-mt">
        <div className="case-x-gutter flex flex-col">
          <div className="max-w-full md:max-w-[36rem] lg:max-w-[42rem] xl:max-w-[60rem] flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h6 className="text-xs uppercase tracking-[0.08em] text-text-secondary">Key Learnings</h6>
              <h2 className="text-[clamp(1.625rem,3.2vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.002em] text-primary">
                What we'd do differently
              </h2>
            </div>
            <ul className="flex flex-col gap-6">
              <li className="flex flex-col gap-1">
                <h3 className="text-[1.1875rem] font-semibold leading-[1.4] text-primary">
                  01 — Involve compliance earlier
                </h3>
                <p className="text-[1.0625rem] text-text-secondary leading-[1.75]">
                  We discovered regulatory constraints in week 8 that forced a full
                  re-architecture of the audit trail. Embedding a compliance review at the
                  prototype stage would have saved three weeks.
                </p>
              </li>
              <li className="flex flex-col gap-1">
                <h3 className="text-[1.1875rem] font-semibold leading-[1.4] text-primary">
                  02 — Ship a narrower MVP, faster
                </h3>
                <p className="text-[1.0625rem] text-text-secondary leading-[1.75]">
                  We tried to solve every edge case before launch. A narrower scope targeting
                  only auto claims would have given us real usage data six weeks earlier and
                  made the exception-handling design far more grounded.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 10. NEXT PROJECT CARD ────────────────── */}
      <section className="case-mt case-x-gutter">
        <a
          href="#"
          className="group relative w-full aspect-[2/1] overflow-hidden rounded-sm flex items-end block focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {/* Background video / placeholder */}
          <div className="absolute inset-0 bg-[#1c1c1e]">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#555] text-sm">Next project background video</span>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/60 transition-colors duration-[450ms] ease-in-out" />

          {/* Text overlay */}
          <div className="relative z-10 p-6 md:p-10 flex flex-col gap-2 w-full">
            <p className="text-xs uppercase tracking-[0.08em] text-white/60">Next project</p>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white">
              Forma Design System
            </h2>
            <p className="text-sm text-white/60 mt-1 group-hover:text-white/80 transition-colors duration-[450ms] ease-in-out">
              Building a shared language across 6 product teams →
            </p>
          </div>
        </a>
      </section>

    </main>
  )
}
