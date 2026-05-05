# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Typography Classes

### Heading classes
| Class   | font-weight | letter-spacing | line-height | color   | font-size      | Use for |
|---------|-------------|----------------|-------------|---------|----------------|---------|
| H1-700  | 700         | -0.03em        | 1.06        | #1c1c1e | var(--h1-size) | Page/section titles |
| H2-600  | 600         | -0.0022em      | 1.20        | #1c1c1e | var(--h2-size) | Sub-section headings |
| H3-500  | 500         | -0.0022em      | 1.40        | #1c1c1e | var(--h3-size) | `intro-dark-logo`, `a.global-nav-link` |
| H3-600  | 600         | -0.01em        | 1.40        | #1c1c1e | var(--h3-size) | `cta-title`, `reflection-heading`, `feat-title`, `stat-label`, `bento-footer-title` |

H1-700 mb: 2rem. H2-600 mb: 1.5rem. H3-500 mb: 1rem. H3-600 mb: var(--space-2).

### Typography tokens (CSS variables)
```css
--h1-size: clamp(2.5rem, 5vw, 2.5rem);
--h2-size: clamp(1.625rem, 3.2vw, 2.25rem);
--h3-size: clamp(1.0625rem, 1.8vw, 1.1875rem);
--p-size:  1.0625rem;   /* P-400-B, P-400-G, P-400-G-List, P-400-P */
--ui-size: 1rem;        /* P-400-SP, P-400-SG */
--cap-size: 0.75rem;
```

### Paragraph classes
| Class     | font-weight | letter-spacing | line-height | margin-bottom | color   | font-size | Use for |
|-----------|-------------|----------------|-------------|---------------|---------|-----------|---------|
| P-400-B   | 400         | 0.02em         | 1.75        | 1rem          | #1c1c1e | --p-size  | Body text dark — `t-author-name`, `intro-meta-value`, `intro-dark-desc` |
| P-400-G   | 400         | 0.02em         | 1.2         | 1rem          | #58534D | --p-size  | Body text gray — `wc-desc`, `section-body`, `feat-desc`, `bento-footer-desc`, `reflection-list` |
| P-400-P   | 400         | 0em            | 1.2         | 1rem          | #4E008E | --p-size  | Body text purple — `wc-tag` |
| P-400-SP  | 400         | 0.02em         | 1.5         | 0.5rem        | #4E008E | --ui-size | Small uppercase purple — `wc-cta`, `section-tag`, `cta-eyebrow`, `bento-cta` |
| P-400-SG  | 400         | 0.02em         | 1.5         | 0.5rem        | #808080 | --ui-size | Small uppercase gray — `t-author-role`, `t-hint`, `subsection-tag` |

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- All HTML files must `<link rel="stylesheet" href="base.css">` in `<head>`. Never duplicate `:root` variables or typography classes inline.

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
