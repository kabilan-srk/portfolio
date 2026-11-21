# Portfolio redesign: ops console with terminal view

Date: 2026-11-21. Status: draft, awaiting owner approval. Repo: kabilan-srk/portfolio, site: kabilansrk.me (GitHub Pages).

## Intent and why

Kabilan is an Associate SRE at Kissflow with one flagship open-source contribution (the Build Sound Jenkins plugin, hosting request jenkins-infra/repository-permissions-updater#5450). The site should read as the work of an SRE: a monitoring-console feel, real live data, and a terminal for people who like terminals. A reference portfolio (msrishav, found via Peerlist) was liked for its structure: boot sequence, GUI/CLI mode switch, bento-style panels. The look is to be adapted to this use case, not copied.

Audience: recruiters and hiring managers first, other engineers second, open-source maintainers third. (Kabilan was asked and has not ranked these; this order is the designer's call.)

## Goals

- Dashboard is the default view: a bento grid of panels (hero, system status, projects, skills, experience, toolkit, learning, contact).
- A full-page terminal view that replaces the dashboard, toggled by a nav button, Ctrl+`, and the command palette. Existing terminal commands carry over.
- A short boot sequence that is skippable and shown once per browser session.
- Amber on dark charcoal palette, monospace type.
- Real data only in status panels (see Anti-goals).
- Works on phones, keyboard-navigable, respects prefers-reduced-motion.

## Non-goals

- No AI chat ("Oracle"), no 3D scenes, no sound, no backend. Each would add cost or a server; revisit later.
- No framework change.
- No contact-form backend work in this task (the form still simulates success; VITE_FORM_ENDPOINT is unset and tracked separately).
- No move of the 24years or api subdomains.

## Anti-goals (failure even if it works)

- Fabricated metrics. The mockups showed "uptime 99.9%"; that was a wireframe placeholder. No panel may show a number or status that is not backed by real data or by facts in portfolioData.js.
- Looking like a copy of the reference site (no Matrix green, no copied text or code).
- Low-contrast amber text that fails WCAG AA on charcoal.
- A boot sequence that blocks or annoys: it must be skippable by click or key, and must never delay access beyond about 2 seconds.

## Constraints

- Stack stays React 19 + Vite + framer-motion + lucide-react, built with bun, deployed by .github/workflows/pages.yml. Relative asset base (`base: './'`) must stay.
- Static site: only unauthenticated public APIs from the browser (GitHub API, 60 requests/hour/IP; existing 5-minute sessionStorage cache in src/lib/issueStatus.js).
- Existing content in src/data/portfolioData.js is the single source for both views.
- BucketList.jsx exists but is not rendered in App.jsx; it stays out unless asked.

## Approaches considered

1. **Dashboard default, terminal as a switch (chosen by Kabilan).** Familiar landing for recruiters, terminal is a bonus. Builds on the existing Terminal.jsx, command palette and data module.
2. Terminal default, dashboard as a switch. More memorable, but a visitor who does not want a terminal must find the button first; risky for the recruiter audience. Not chosen.
3. Rebuild in Next.js or Astro. No benefit for a static single page; not chosen.

## Decided design

Palette (tokens in src/index.css; values are the designer's starting point, builder may tune for contrast):
- bg-primary #15171a, bg-secondary #1a1c20, bg-tertiary #22252a
- accent (amber) #ffb000, accent-2 (orange) #ff7a1a
- text-primary #f2ecde, text-muted #7d7a72 (check contrast), border #2a2d33
- status colours: ok green (kept), warn amber, error red
- font: JetBrains Mono (already loaded)

Dashboard view (default):
- Top bar: logo, section links, [TERMINAL] toggle, Cmd+K hint.
- Bento panels: hero ("whoami", name, title, one-line intro, resume link), system-status strip, Build Sound project panel (live issue status badge and meta, already built), skills gauges, experience timeline, SRE toolkit, learning, contact.
- Collapses to a single column on narrow screens.

System-status strip: shows only real signals. Candidates: Build Sound hosting request state from the GitHub API, time since last commit to this repo from the GitHub API, and the deployed commit. If a fetch fails the strip shows "status unavailable", never a default "OK".

Terminal view: full-screen takeover with a [GUI] button back to the dashboard. Reuses Terminal.jsx commands (help, whoami, ls, goto, cat, projects, status, skills, contact, open, clear). The view choice is not persisted across visits.

Boot sequence: 1 to 2 seconds, lines such as "checking cluster ... ok" only if they correspond to something real or are clearly decorative; shown once per session (sessionStorage), skippable by click or any key, skipped entirely under prefers-reduced-motion.

Section naming: About, Experience, Projects, Open Source (Build Sound), Skills, Learning, Contact.

Motion: subtle fade/slide on scroll via existing framer-motion; hover states on panels; nothing continuous except the terminal cursor.

## Open item

Kabilan mentioned "the ppt design" and has not attached or described it. If a deck or images are supplied, palette, type and layout cues from it override the starting values above.

## Calls made after the builder check (designer's calls, flagged for review)

- **Skill gauges.** Gauges show the self-rated `level` values already in portfolioData.js (for example LINUX 50). The panel is labelled "self-rated"; no numbers are added.
- **Status strip signals.** Three ship: (1) Build Sound hosting request state, runtime fetch, existing cache; (2) time since last commit to this repo, one extra runtime GitHub API call, cached 5 minutes in sessionStorage; (3) deployed build, injected at build time by passing `GITHUB_SHA` and the build date to Vite in pages.yml (short SHA plus date). Any failed fetch shows "unavailable", never a default OK. Pages.yml changes are in scope for (3).
- **Boot lines.** Lines describe actions ("loading profile ... done", "fetching hosting status ... <real result>"). Only lines tied to a real fetch show a status word from the actual result; decorative lines never say "ok".
- **Sections and nav.** Nav is About (hero), Experience, Projects, Skills, Learning, Contact. Build Sound is the Projects panel (no separate "Open Source" section). The SRE toolkit sits inside the Skills area. In the terminal view, `goto <section>` switches back to the dashboard and scrolls to that section; `cat` stays in the terminal.

## Left to the builder

Component breakdown, exact grid spans, responsive breakpoints, exact boot copy, animation timings, how the two views share state, and any contrast adjustments to the palette.
