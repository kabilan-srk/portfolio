# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the portfolio into an amber-on-charcoal ops-console dashboard with a full-page terminal view, a skippable once-per-session boot, and a status strip backed only by real data.

**Architecture:** Pure logic lives in small tested modules under `portfolio/src/lib/`; React components consume them. `App.jsx` owns a `view` state (`'dashboard' | 'terminal'`). `portfolioData.js` stays the single content source for both views.

**Tech Stack:** React 19, Vite 7, framer-motion, lucide-react, bun. New dev deps: `vitest`, `jsdom`.

**Spec:** `docs/superpowers/specs/2026-11-21-portfolio-redesign-design.md`

All paths below are relative to `portfolio/` (the app root inside the repo) unless they start with `.github/` or `docs/`.

## Global Constraints

- Keep `base: './'` in `vite.config.js`.
- Palette tokens: bg-primary `#15171a`, bg-secondary `#1a1c20`, bg-tertiary `#22252a`, accent `#ffb000`, accent-2 `#ff7a1a`, text-primary `#f2ecde`, text-muted `#7d7a72` (raise if contrast < 4.5:1 on bg-primary), border `#2a2d33`.
- Font: JetBrains Mono (already loaded).
- No fabricated metrics. A failed fetch shows `unavailable`, never an OK state.
- Nav sections, in order: About (`home`), Experience (`experience`), Projects (`projects`), Skills (`skills`), Learning (`learning`), Contact (`contact`). The SRE toolkit renders inside the Skills section.
- Boot: at most about 2 seconds, once per browser session, skippable by click or any key, skipped under `prefers-reduced-motion`.
- No AI chat, 3D, sound, backend, or framework change. Do not touch `.env*`, `24years`, or `api` DNS.
- Commit email/author for this repo: `kabilan-srk <kabilan-srk@users.noreply.github.com>`.

## Review Focus

1. GitHub API 403 (rate limit), network error, or malformed JSON: every status signal shows `unavailable`, no exception, no OK tone.
2. `sessionStorage` throws (private mode): boot still shows once per page load, fetch cache falls back to network, nothing crashes.
3. `prefers-reduced-motion: reduce`: boot never renders; no continuous animation except the terminal cursor.
4. Terminal `goto <unknown>` or `open <unknown>` prints an error line and stays in the terminal view; `goto <known>` switches to the dashboard and scrolls to that section.
5. 390px-wide viewport: no horizontal page scroll; bento collapses to one column.

---

### Task 1: Test harness and palette tokens

**Files:**
- Modify: `package.json`, `vite.config.js`, `src/index.css`, `src/components/Terminal.jsx`, `src/components/Navigation.jsx`, `src/components/Skills.jsx`, `src/components/Contact.jsx`, `src/components/Home.jsx`
- Create: `src/lib/__tests__/tokens.test.js`

**Interfaces:**
- Produces: `bun run test` runs vitest (jsdom); all colours come from CSS variables, no hardcoded red remains.

- [ ] **Step 1:** Add dev deps `vitest`, `jsdom`; add script `"test": "vitest run"`; add `test: { environment: 'jsdom' }` to `vite.config.js`.
- [ ] **Step 2:** Write `tokens.test.js`: parses `src/index.css` `:root` custom properties and asserts the contrast ratio (WCAG relative luminance) of `--text-primary`, `--text-muted`, and `--accent` against `--bg-primary` is >= 4.5; also asserts no file under `src` matches `/rgba\(255, ?0, ?0|#ff0000/i`.
- [ ] **Step 3:** Run `bun run test`; expect FAIL (old red tokens, hardcoded red in the five component files).
- [ ] **Step 4:** Replace the `:root` tokens with the Global Constraints palette (add `--accent-2`; set `--accent-dim`, `--accent-glow`, `--border-accent` from amber). Replace each hardcoded red value in the listed files with `var(--accent)` or an amber rgba. Rename `@keyframes pulse-red` to `pulse-accent`, amber glow. Add an `@media (prefers-reduced-motion: reduce)` block in `index.css` that sets `animation: none !important; transition: none !important` on `*` except `.cursor` (the terminal cursor).
- [ ] **Step 5:** Run `bun run test` and `bun run build`; expect PASS and build success.
- [ ] **Step 6:** Commit `feat: amber on charcoal palette and test harness`.

### Task 2: Shared sections module

**Files:**
- Create: `src/lib/sections.js`, `src/lib/__tests__/sections.test.js`
- Modify: `src/hooks/useScrollSpy.js`, `src/components/Navigation.jsx`

**Interfaces:**
- Produces: `SECTIONS: { id: string, label: string, aliases: string[] }[]` in nav order; `resolveSection(name: string): string | null` (case-insensitive, trims, matches id, label, or alias).
- Consumes by later tasks: Navigation, scroll spy, terminal `goto`, command palette.

- [ ] **Step 1:** Write tests: `resolveSection('exp') === 'experience'`, `resolveSection('ABOUT') === 'home'`, `resolveSection('toolkit') === 'skills'`, `resolveSection('nope') === null`, `resolveSection('') === null`; `SECTIONS.map(s => s.id)` equals `['home','experience','projects','skills','learning','contact']`.
- [ ] **Step 2:** Run; expect FAIL (module missing).
- [ ] **Step 3:** Implement `sections.js` with labels `ABOUT, EXPERIENCE, PROJECTS, SKILLS, LEARNING, CONTACT`; aliases include `exp`, `sre-toolkit`, `toolkit`.
- [ ] **Step 4:** Make `useScrollSpy` iterate `SECTIONS` ids and `Navigation` render its links from `SECTIONS`.
- [ ] **Step 5:** Run tests and build; expect PASS.
- [ ] **Step 6:** Commit `feat: shared sections module`.

### Task 3: Real-data libraries

**Files:**
- Create: `src/lib/repoStatus.js`, `src/lib/buildInfo.js`, `src/lib/statusSignals.js`, `src/lib/__tests__/repoStatus.test.js`, `src/lib/__tests__/statusSignals.test.js`
- Modify: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: `fetchIssue`, `deriveStatus`, `timeAgo` from `src/lib/issueStatus.js` (existing).
- Produces:
  - `fetchLastCommit(repo: string): Promise<{ sha: string, date: string }>` (5-minute sessionStorage cache, same pattern as `fetchIssue`; throws on non-OK).
  - `useLastCommit(repo: string): { commit: {sha,date} | null, error: boolean }`.
  - `getBuildInfo(): { sha: string, date: string } | null` from `import.meta.env.VITE_BUILD_SHA` / `VITE_BUILD_DATE` (null when either is empty).
  - `describeSignals(input: { issue, issueError, commit, commitError, build }): { id: 'hosting'|'commit'|'build', label: string, value: string, tone: 'ok'|'warn'|'unknown' }[]` (always three entries, in that order).

- [ ] **Step 1:** Write `repoStatus.test.js` with mocked `fetch`/`sessionStorage`: returns sha and date; second call within 5 minutes does not call fetch; 403 response rejects; `sessionStorage.getItem` throwing still fetches without throwing.
- [ ] **Step 2:** Write `statusSignals.test.js`: open issue gives hosting value `HOSTING REQUESTED` tone `warn`; closed-completed gives `HOSTED` tone `ok`; `issueError: true` gives `unavailable` tone `unknown`; `commit: null` with `commitError: true` gives `unavailable`; `build: null` gives `unavailable`; no input combination containing an error yields tone `ok`.
- [ ] **Step 3:** Run; expect FAIL.
- [ ] **Step 4:** Implement the three modules per the signatures. In `pages.yml` build step add env `VITE_BUILD_SHA: ${{ github.sha }}` and `VITE_BUILD_DATE` (UTC date from the runner, e.g. via a prior step writing to `$GITHUB_ENV`).
- [ ] **Step 5:** Run tests; expect PASS.
- [ ] **Step 6:** Commit `feat: real-data status libraries and build info`.

### Task 4: Boot sequence

**Files:**
- Create: `src/lib/bootGate.js`, `src/lib/bootLines.js`, `src/components/Boot.jsx`, `src/lib/__tests__/boot.test.js`

**Interfaces:**
- Produces:
  - `shouldShowBoot(opts: { storage: Storage, reducedMotion: boolean }): boolean` (true on first visit, false after `markBootShown`, false when `reducedMotion`, true when storage throws).
  - `markBootShown(storage: Storage): void` (never throws).
  - `buildBootLines(input: { issue, issueError }): string[]`.
  - `<Boot onDone={() => void} />`: renders lines progressively, calls `onDone` after about 2 seconds, on click, or on any keypress (once only).

- [ ] **Step 1:** Write tests: first call true, after `markBootShown` false; `reducedMotion: true` false; throwing storage true and `markBootShown` does not throw; `buildBootLines` with `issueError: true` contains a line ending `unavailable`; with an open issue contains `HOSTING REQUESTED`; no line matches `/\bok\b/i` unless produced from a real fetch result (decorative lines never contain it).
- [ ] **Step 2:** Run; expect FAIL.
- [ ] **Step 3:** Implement the libs, then `Boot.jsx` (full-screen charcoal overlay, mono text, amber cursor, "press any key to skip" hint). Use `useIssueStatus` for the hosting line.
- [ ] **Step 4:** Run tests and build; expect PASS.
- [ ] **Step 5:** Commit `feat: skippable boot sequence`.

### Task 5: Status strip and dashboard layout

**Files:**
- Create: `src/components/StatusStrip.jsx`, `src/components/Dashboard.jsx`
- Modify: `src/index.css` (bento grid classes with a single-column breakpoint at 768px), `src/components/Home.jsx`, `src/components/Skills.jsx`, `src/components/SREToolkit.jsx`, `src/components/Experience.jsx`, `src/components/LearningJourney.jsx`, `src/components/Projects.jsx`, `src/components/Contact.jsx`

**Interfaces:**
- Consumes: `describeSignals`, `useIssueStatus`, `useLastCommit`, `getBuildInfo`, `SECTIONS`.
- Produces: `<StatusStrip />` (no props; repo `kabilan-srk/portfolio` for the commit signal; hosting signal from `portfolioData.projects[0].statusSource`); `<Dashboard personal experience projects skills sreToolkit learning contact={...contactProps} />` rendering the six sections in `SECTIONS` order with the strip under the hero, the toolkit inside the Skills section, and a "self-rated" label on skill gauges.

- [ ] **Step 1:** Implement `StatusStrip` (three tone-coloured chips, tone `unknown` is muted, `warn` amber, `ok` green) and `Dashboard` composing the restyled sections in bento panels (border `--border`, bg `--bg-secondary`, amber section labels).
- [ ] **Step 2:** Restyle the listed section components to the new panel look (no layout logic changes beyond grid placement).
- [ ] **Step 3:** Run `bun run build`; expect success. Take headless Chrome screenshots at 1440 and 390 widths (command pattern from earlier work: `--headless=new --virtual-time-budget=15000 --window-size=W,H --screenshot=...`), view both, and confirm: six panels in order, strip shows real or `unavailable` values, no horizontal scroll at 390.
- [ ] **Step 4:** Commit `feat: ops console dashboard with live status strip`.

### Task 6: View switching and terminal takeover

**Files:**
- Modify: `src/App.jsx`, `src/components/Navigation.jsx`, `src/components/Terminal.jsx`
- Create: `src/lib/__tests__/terminalNav.test.js`

**Interfaces:**
- Consumes: `resolveSection`, `shouldShowBoot`, `markBootShown`, `<Boot>`, `<Dashboard>`.
- Produces: Terminal props become `{ onExit: () => void, goToSection: (id: string) => void, portfolioData }`; exported pure `runCommand(input, portfolioData, goToSection, onExit)` (already exists in `Terminal.jsx`; export it) returning line objects. In `App.jsx`, `goToSection(id)` sets view to `'dashboard'` then scrolls after the next frame.

- [ ] **Step 1:** Write `terminalNav.test.js`: `runCommand('goto exp', data, spy, noop)` calls `spy('experience')`; `runCommand('goto nope', ...)` returns an `error` line and does not call the spy; `runCommand('open nope', ...)` returns an `error` line; `runCommand('goto toolkit', ...)` calls `spy('skills')`.
- [ ] **Step 2:** Run; expect FAIL.
- [ ] **Step 3:** Export `runCommand`, switch its `goto` branch to `resolveSection`, and change `exit`/`q`/Esc to call `onExit`. Render Terminal full-screen (fixed inset 0, no backdrop) with a `[GUI]` button in the title bar.
- [ ] **Step 4:** In `App.jsx` add `view` state; Ctrl+` and a nav `[TERMINAL]`/`[GUI]` button toggle it; add palette items "Switch to terminal view" and "Switch to dashboard"; gate `<Boot>` with `shouldShowBoot` and call `markBootShown` on done.
- [ ] **Step 5:** Run tests and build; expect PASS. In headless Chrome confirm the dashboard is the default and the page loads without console errors.
- [ ] **Step 6:** Commit `feat: dashboard default with full-page terminal view`.

### Task 7: Lint, deploy, verify

**Files:**
- Modify: none expected (fixes only)

- [ ] **Step 1:** Run `bun run lint`; fix errors in files touched by this plan only (pre-existing `motion` unused flags in untouched files may remain; note them).
- [ ] **Step 2:** Run `bun run test` and `bun run build`; expect all pass.
- [ ] **Step 3:** Push `main`; wait for the Pages run; expect `completed success`.
- [ ] **Step 4:** Verify live: `curl -s https://kabilansrk.me/` references the new bundle; headless screenshots at 1440 and 390 show the new design; the status strip's build chip shows a real build SHA matching `git rev-parse --short HEAD`.
- [ ] **Step 5:** Stop the visual companion server with `scripts/stop-server.sh <session dir>`.
