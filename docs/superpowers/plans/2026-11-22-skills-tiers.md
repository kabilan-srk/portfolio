# Skills Tiers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the percentage skill bars and the unrated toolkit list with one tiered skills section (Daily / Used at work / Learning) that matches what the owner confirmed.

**Architecture:** One data shape, `portfolioData.skills.tiers`, feeds both the `Skills` component and the terminal `skills` command. `sreToolkit` data and the `SREToolkit` component are retired. Section ids and the `toolkit` alias are unchanged.

**Tech Stack:** React, Vite, Vitest (existing tests under `portfolio/src/lib/__tests__`).

**Spec:** `docs/superpowers/specs/2026-11-22-skills-tiers-design.md`

## Global Constraints

- Tiers and members exactly as in the spec: DAILY = GCP, CLOUD LOGGING, CLOUD MONITORING, IAM; USED AT WORK = JENKINS, RUNDECK, ATLANTIS, HELM, KUBERNETES, SNOWFLAKE, MONGODB ATLAS, MAKE; LEARNING = TERRAFORM, DOCKER, PYTHON, BASH, JAVASCRIPT, GITHUB ACTIONS.
- No percentages or numeric levels anywhere on the site or in terminal output.
- Uppercase tool names, matching the rest of `portfolioData.js`.
- No internal repo or company details in any copy.
- Section ids stay `skills`; `lib/sections.js` and its tests are not modified.
- Do not commit unless the owner asks; do not delete files without announcing and getting approval.

## Review Focus

- A tool listed in two tiers would overstate usage; test that every tool name is unique across tiers.
- Leftover `level` fields or `%` in terminal output would reintroduce numbers; test the output has no `%`.
- A tier with no items must not render an empty card or crash.
- `goto toolkit` and `goto skills` must still land on an element with id `skills` (the old `sre-toolkit` id disappears with the component).
- Long tier lists must wrap at phone width instead of overflowing.

---

### Task 1: Tier data and terminal command

**Files:**
- Modify: `portfolio/src/data/portfolioData.js` (replace `skills` and delete `sreToolkit`)
- Modify: `portfolio/src/lib/terminalCommands.js:91-99` (the `skills` command)
- Test: `portfolio/src/lib/__tests__/skillsTiers.test.js`

**Interfaces:**
- Produces: `portfolioData.skills.tiers: Array<{ id: 'daily' | 'work' | 'learning', label: string, items: string[] }>`, in that order, labels `DAILY`, `USED AT WORK`, `LEARNING`.

- [ ] **Step 1: Write the failing tests** in `skillsTiers.test.js`
  - `tiers are daily, work, learning in order` asserts ids and labels.
  - `tier members match the approved lists` asserts `items` equal the Global Constraints lists exactly, in the order given there.
  - `no tool appears in two tiers` flattens items and asserts `new Set(all).size === all.length`.
  - `skills command prints each tier and no percentages` calls `buildCommandMap(portfolioData, () => {}, () => {}).skills()`, joins `text`, asserts it contains `DAILY`, `GCP`, `LEARNING`, `TERRAFORM` and does not match `/%/`.

- [ ] **Step 2: Run** `npx vitest run src/lib/__tests__/skillsTiers.test.js` from `portfolio/`. Expected: FAIL (`tiers` undefined).

- [ ] **Step 3: Replace `skills` in `portfolioData.js`** with `skills: { tiers: [...] }` per the shape above, and delete the `sreToolkit` object.

- [ ] **Step 4: Rewrite the `skills` command** in `terminalCommands.js` to emit the existing `— SKILLS —` header line, then one `{ type: 'output', text }` per tier: two-space indent, label padded to 14 characters, then items joined by `, `.

- [ ] **Step 5: Run** `npx vitest run`. Expected: all tests PASS. (`npm run build` will fail until Task 2; that is expected here.)

### Task 2: Tiered Skills component, retire the toolkit

**Files:**
- Modify: `portfolio/src/components/Skills.jsx` (rewrite)
- Modify: `portfolio/src/components/Dashboard.jsx` (remove `SREToolkit` import and element)
- Retire: `portfolio/src/components/SREToolkit.jsx` (stop importing it; deletion needs the owner's approval, ask when this task finishes)

**Interfaces:**
- Consumes: `skills.tiers` from Task 1.
- Produces: `Skills({ skills })` renders `<section id="skills">` with one card per non-empty tier.

- [ ] **Step 1: Rewrite `Skills.jsx`** to map `skills.tiers`, skip tiers whose `items` is empty, and render each as a bordered card: label on top (reuse the lane label style), items as the chip style used in `SREToolkit.jsx`. Use `flexWrap: 'wrap'` so chips wrap at phone width. Keep the section header, but change the label text `CAPABILITY · SELF-RATED` to `WHAT I USE · BY FREQUENCY` and keep the `[SKILLS]` heading. Remove the bars, `inView` observer and `LANES`. Style DAILY with the accent border, the others with the plain border.

- [ ] **Step 2: Update `Dashboard.jsx`** to render only `<Skills skills={data.skills} />` in the `span-7` cell.

- [ ] **Step 3: Verify** `npm run build` passes and `npx vitest run` passes. Then run `npm run dev`, open the page, and check: three cards in the right order, DAILY accented, no percentages, chips wrap at 375px width, `goto skills` and `goto toolkit` in the terminal scroll to the section.

- [ ] **Step 4: Report** that `SREToolkit.jsx` is now unused and ask the owner whether to delete it.

---

## Self-review

- Spec coverage: tiers (Task 1 data), one source of truth (Task 1), terminal command (Task 1), component and dashboard (Task 2), tests (Task 1; section tests untouched).
- Review Focus mapping: duplicates and `%` covered in Task 1 tests; empty tier, wrapping, goto ids covered in Task 2 steps 1 and 3.
- Names consistent: `skills.tiers`, tier ids `daily`/`work`/`learning`, `Skills({ skills })`.
- Learning-section topics (`learning.current` lists Kubernetes and Terraform) are not changed in this plan; Kubernetes appears under USED AT WORK per the owner. Flag at review.
