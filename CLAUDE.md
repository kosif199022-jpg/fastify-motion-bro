# Claude Code Entry Point
Read `AGENTS.md` and `.claude/skills/fastify-motion-bro/SKILL.md` immediately when the user requests video, animation, VFX or motion graphics. Ask only missing details in one short Arabic message, then implement a real moving, time-driven composition. Preview before final render and provide measured QA.
Read AGENTS.md and docs/PROFILE_CATALOG.md for v0.3 opt-in profile routing. Profile-specific gates override generic intake only when selected.

## Motion Lab v0.4 — 500 *proposed* engineering ideas
When the user wants application improvements, new technical powers, brainstorming, or expert proposals, read `docs/MOTION_LAB_500.md` and `data/motion-ideas-500.json`. The 500 entries are assistant-curated proposals, **not** 500 separate expert responses or implemented features. Preserve the full unfiltered opinion inbox when the user requests direct expert feed, but do not bypass security, human authorization, payment, publication, or production safety gates.
Use `npm run ideas -- list`, `npm run ideas -- search arabic`, `npm run ideas -- show MB-001`, `npm run ideas -- handoff MB-001`.
For a bare "start" show the existing 9 production modes FIRST; the idea catalog is a development capability and does not replace video mode selection.
Use feature branches, verify test results, and clearly distinguish running providers from proposed integrations. Never report unconnected Flow/Veo as generating video.
