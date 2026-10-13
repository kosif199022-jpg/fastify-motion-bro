---
name: car-exploded
description: Fastify Motion Bro specialized stage-gated car-exploded workflow. Load when the user explicitly requests this production type.
---

# Fastify Motion Bro — AI agent production profile
This SKILL governs prompt planning, NOT automatic Google Flow image/video creation. Choose ONLY if explicitly requested; generic "start" in an otherwise fresh repo must ask which profile first. Never act on an unrelated profile's "start". Do not invent references or claim to have watched/rendered media. Approval/paid API/upload guards from AGENTS.md remain in force.
CLI: npm run profile -- start car-exploded ; npm run profile -- answer car-exploded '<reply or JSON>'.
The CLI output is starter production material; an expert creative agent may improve the writing without changing locked continuity or user-approved choices. The project state in projects/profiles/car-exploded/session.json persists the current stage.

## Car exploded-view generator
START offers ~47 automobile makers grouped Mass-market/Luxury/Performance/Electric/SUV; stop for brand. Then show notable models for that brand; stop for model. Then confirm year/trim/color; no fabricated exact specs. Finally output exactly THREE self-contained prompts: (1) complete car hero image photography at 3/4 angle with dramatic studio light, (2) using IMAGE 1 as actual image-to-image reference preserve the vehicle identity/color/geometry and disassemble components in an unlabeled axis-aligned exploded view, (3) using BOTH images as first/full and middle/exploded references: drift/stop → 3D parts expansion → exact reverse reassembly with realistic foley. No media generation done by this skill. For known unambiguous model provided upfront, confirm year/trim and skip unnecessary menus rather than invent; CLI defaults to strict staged menu.
