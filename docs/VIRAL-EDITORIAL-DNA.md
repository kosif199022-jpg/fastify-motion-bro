# Viral Editorial 3D v0.2 — Stage-gated mixed-media production

## Scope
Optional director profile activated by "viral editorial", "mixed-media editorial" or "viral 3D". Generic Motion Bro commands and existing templates remain available.
Niche: psychology, motivation, finance, IT, education, marketing, behavioral design. 10–30 second narrated-style explainers; 30 second reference default.

## Workflow (no skipping)
1. IDEA: show precisely 5 topic titles. Wait for selection 1–5.
2. SCRIPT: one cinematic short-line voice narration (text only), Hook → obvious misconception → underlying mechanism → practical insight → echoing ending; stop for NEXT.
3. PALETTE: 1 warm off-white / purple, 2 dark slate / teal, 3 cream / terracotta; stop for 1–3.
4. POSTERS: **TEXT PROMPTS**, one per sentence, one hero asset only, maximum two vector accents, premium 2.5D halftone mixed-media; 9:16. Stop for NEXT.
5. MOTION: **TEXT PROMPTS** each exactly 6 seconds: .0–.5 base; .5–3.5 dynamic entrance; 3.5–4.7 micro-motion hold; 4.7–6 geometric exit. No narration/no music in generated motion prompts; only optional SFX cues.

Poster/image prompts must not be described as already generated, and "8K" is a requested quality target rather than measured output. The Native Canvas editor currently renders original 2.5D/vector approximations, not photorealistic 3D models.

## Visual invariants
- Output 9:16, target 1080x1920, phone-safe center composition and 10% side margins.
- Exactly **two** soft translucent independent diagonal lines as **environmental background**, never three. Colors derive from the locked base palette.
- 80% neutral layout with 20% dominant accent in each sequence.
- Fine modular low contrast dot/dash grid; large soft corner organic accent; clean negative space.
- Hero object, halftone cutout and directional drop shadow, slight parallax Z-axis; no unnecessary clutter.
- One-to-four-word kinetic headline, editorial serif accent, giant ghost type, masked word reveals.
- Ease-out with 5–10% spring settle; restrained locked camera optical push; continuous micro movement.
- Optional UI cursors, starbursts, tracking dot.

## Timing constraint
Five spoken narration sentences each assigned to one 6-sec clip = exactly 30 sec. A shorter duration can only be 12, 18, or 24 seconds when every scene must remain exactly 6 sec. Never claim 10 seconds with 6 second scenes, unless the user changes the fixed duration rule. Stage 2 narration script does not mean the motion prompt should generate audio; Stage 5 explicitly forbids voiceover and music.

## Commands
npm run viral -- start
npm run viral -- reply 2
npm run viral -- reply NEXT
npm run viral -- reply 1
npm run viral -- reply NEXT
npm run viral -- compile
npm run viral -- preview-project
npm run preview
npm test

Use npm run viral -- status at any time. Compile/export cannot bypass creative stage approvals. Final MP4 additionally requires user review and explicit permission. SFX cue descriptions are not generated SFX audio files.

## Integration notes
- The editable vector renderer web/editorial.js is connected to web/player.js by storyboard.profile. It generates animation frame-by-frame via a time argument; no still frames stitched and called motion.
- Native MP4 pipeline uses scripts/render.py and FFmpeg; no premium image/video engines are magically available without explicit API connections and asset rights.
- The ordinary project pipeline is not overwritten until the user runs "preview-project".

## Final render approval gate
After the user reviews the browser preview and completes Stage 5, run npm run viral -- approve-render and have the user explicitly type APPROVE FINAL RENDER at the confirmation prompt. This sets storyboard.approval.final_render=true. The MP4 renderer refuses --approved for this profile unless that field is true. Earlier stage approvals do not count as final export permission.
