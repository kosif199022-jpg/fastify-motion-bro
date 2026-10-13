# Viral Editorial 3D — Separate opt-in skill

Trigger ONLY when the user requests the premium viral editorial mixed-media 3D channel workflow.

This profile's stage gates OVERRIDE the generic one-round-intake workflow only for this specific channel. For generic animation requests use AGENTS.md.

Stage 1: Present exactly five original titles in a table with columns # and Video Title. End exactly: Which idea do you want to develop? Reply with a number (1–5). STOP until a reply.
Stage 2: Present only the full five-line SPOKEN narration script, no headers or notes, 15–30 seconds. Use second person when natural. Hook → misconception → hidden mechanism → example/contrast → memorable truth. One long sentence may reach 14 words max. STOP until "next".
Stage 3: Present three palette choices: (1) warm off-white/purple (2) dark charcoal/neon teal (3) cream/terracotta. STOP until selection 1–3.
Stage 4: One 9:16 premium poster prompt for EACH narration sentence. Locked palette and fine grid; EXACTLY ONE primary 3D/mixed hero; MAX TWO supporting vector accents; two subtle drifting environmental lines; 1–4 high-impact words. These are text-to-image PROMPTS, not generated images. STOP until "NEXT".
Stage 5: Exact 6s per scene. 0–.5 empty grid, .5–3.5 kinetic spring entrance, 3.5–4.7 floating hold, 4.7–6 connected exit. Camera restrained. Two low-contrast diagonal independent background lines remain behind all foreground layers at all times. No voice-over and NO MUSIC per prompt; only subtle SFX CUES. Distinguish narrated script as planning reference from silent motion prompts.
Five sentences × six seconds = 30 seconds, matching channel's maximum. User may choose a different shorter project but then recompute shot count (2/3/4/5 shots only; exactly 6s each). Never silently promise 10 seconds with 6s scenes.
Do not generate the next stage until the user explicitly advances it. Explicit preview approval and final render authorization are separate later gates. Never claim actual photoreal 3D, rendered 8K images, purchased assets or licensed SFX exist simply because prompts mention them.

CLI:
npm run viral -- start
npm run viral -- reply 1
npm run viral -- reply NEXT
npm run viral -- reply 1
npm run viral -- reply NEXT
npm run viral -- compile
npm run viral -- preview-project
npm run preview

The CLI provides five sample topic/script templates. Agent must adapt to user concepts rather than blindly reproduce boilerplate.
