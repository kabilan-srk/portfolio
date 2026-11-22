# Skills section: tiers instead of percentages

## Intent
Make the skills claims on the portfolio true and checkable. The current section mixes percentage bars (`skills.sre`) with an unrated toolkit list (`sreToolkit`), and the two disagree. Owner confirmed what they actually use; commit history in the work repos backs the IAM, Jenkins, Helm and GCP claims.

## Goals
- Every listed tool sits in a tier the owner confirmed.
- One source of truth for skills; no numbers.
- Terminal `skills` command shows the same tiers.

## Non-goals
- Per-tool context lines (approach C), IAM case study, new projects. Separate steps later.

## Anti-goals
- Any tool listed higher than the owner's confirmed usage.
- Internal repo names or company details on the public site.

## Approaches considered
- A. Tiers, no numbers (chosen by owner).
- B. Recalibrated bars: still guesses, invites unanswerable questions.
- C. Tiers plus one-line context: more evidence, needs owner-written lines. Possible later.

## Design
Tiers, as confirmed by the owner:
- DAILY: GCP, Cloud Logging, Cloud Monitoring, IAM
- USED AT WORK: Jenkins, Rundeck, Atlantis, Helm, Kubernetes, Snowflake, MongoDB Atlas, Make
- LEARNING: Terraform, Docker, Python, Bash, JavaScript, GitHub Actions

Assumptions to confirm (my calls, not the owner's words): Terraform, Docker, Linux, and the four languages/GitHub Actions go under LEARNING because the owner said they are not daily and did not list them as used at work. Linux is dropped from the bars unless the owner wants it under USED AT WORK.

Code touched:
- `data/portfolioData.js`: replace `skills.sre` and `sreToolkit` with `skills.tiers`.
- `components/Skills.jsx`, `components/SREToolkit.jsx`, `components/Dashboard.jsx`: render one tiered section.
- `lib/terminalCommands.js:91-93`: print tiers.
- Tests in `lib/__tests__` that reference these updated; section ids and `toolkit` alias stay.

## Left to the builder
Visual layout of the three tiers, using the existing theme.
