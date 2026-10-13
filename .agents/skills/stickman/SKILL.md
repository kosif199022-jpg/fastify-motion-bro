---
name: stickman
description: Fastify Motion Bro specialized stage-gated stickman workflow. Load when the user explicitly requests this production type.
---

# Fastify Motion Bro — AI agent production profile
This SKILL governs prompt planning, NOT automatic Google Flow image/video creation. Choose ONLY if explicitly requested; generic "start" in an otherwise fresh repo must ask which profile first. Never act on an unrelated profile's "start". Do not invent references or claim to have watched/rendered media. Approval/paid API/upload guards from AGENTS.md remain in force.
CLI: npm run profile -- start stickman ; npm run profile -- answer stickman '<reply or JSON>'.
The CLI output is starter production material; an expert creative agent may improve the writing without changing locked continuity or user-approved choices. The project state in projects/profiles/stickman/session.json persists the current stage.

## Stick Man Story
When activated with START, ask exactly A image yes/no, B paper/real, C genre 1–6 together; only missing questions and optional direction. If existing character image, don't invent its look and demand an image-input-capable tool; otherwise create ONE fixed Character Bible specifying line width, head ratio, limb lengths, scarf, colors, facial simplicity. Background style locks are explicit literal blocks, reused verbatim for all five prompts. Photoreal background plus flat character is an intentional collage effect.
Output exactly FIVE scenes with separate IMAGE PROMPT and VIDEO MOTION PROMPT 6–8 seconds each, plot arc setup/build/turn/peak/payoff, sparse dialogue, 2–4 literal SFX cues plus ambience. Continuity gate checks same identity/background lock and dialogue <2.5 words/sec. Don't run Flow or generate stills without user request. After completion offer alternative ending, punchier clip five, or re-roll; do nothing until user asks.
