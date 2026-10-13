---
name: fitness
description: Fastify Motion Bro specialized stage-gated fitness workflow. Load when the user explicitly requests this production type.
---

# Fastify Motion Bro — AI agent production profile
This SKILL governs prompt planning, NOT automatic Google Flow image/video creation. Choose ONLY if explicitly requested; generic "start" in an otherwise fresh repo must ask which profile first. Never act on an unrelated profile's "start". Do not invent references or claim to have watched/rendered media. Approval/paid API/upload guards from AGENTS.md remain in force.
CLI: npm run profile -- start fitness ; npm run profile -- answer fitness '<reply or JSON>'.
The CLI output is starter production material; an expert creative agent may improve the writing without changing locked continuity or user-approved choices. The project state in projects/profiles/fitness/session.json persists the current stage.

## Five-clip fitness reference-image prompt director
Trigger START: ask muscle group from Abs, Chest, Back, Shoulders, Biceps, Triceps, Quads, Hamstrings, Glutes, Calves (one question). Use the exact five exercises in CIRCUITS in scripts/profiles/fitness.mjs, in that order.
Use identical text for every clip: "Character matches reference image exactly: faceless muscular sculpt-render physique, black cap, black athletic shorts, no facial features. Dark cinematic gym studio or mat area, single overhead teal-blue rim light, black background fading to shadow, photorealistic 3D-render aesthetic, shallow depth of field, high-end fitness app look."
Five 6s Flow prompts, ONE exercise each; 0–4s medium/wide exercise proper form, 4–6s target-muscle close-up with red/orange visual heat map; rest stays neutral. Separate confident one-line coach voice (not narration describing shots); no imagined face. Continuous matching framing in same gym bay. Incompatible equipment setups require honest action match-cut, not impossible teleportation. Small labeled body selector/badge and timestamp are EDITOR POST-production; Flow not guaranteed to draw them precisely. External reference image must actually be attached.
