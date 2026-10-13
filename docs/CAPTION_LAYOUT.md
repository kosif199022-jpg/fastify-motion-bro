# Captions: timing, layout, and visual review

Fastify Motion Bro v0.4 reads user-provided `.srt` files, validates cue order and duration, and renders each cue inside the same native Chromium Canvas used by preview and technical MP4 export. **It does not perform speech recognition, forced word-level sync, text OCR, or AI translation.** Captions retain their original words; long cues are split into successive pages rather than silently dropping the remainder.

```bash
npm run captions -- check my-captions.srt
npm run captions -- attach my-captions.srt project/storyboard.json
npm run preview
npm test
```

`attach` creates a backup of the original storyboard and adds a `captions` array. Avoid rerunning `npm run plan` after attaching captions without preserving manual storyboard changes.

## Safe caption placement for each scene

To prevent burned-in captions covering branded text or the hero object, configure the whole storyboard:

```json
"caption_layout": {"placement": "bottom", "offsetY": 0}
```

Or override a particular scene:

```json
"scenes": [
  {
    "id": "scene-01",
    "start": 0,
    "end": 5,
    "text": "أهلاً",
    "caption_layout": {"placement": "top", "offsetY": 0.03}
  }
]
```

`placement` accepts `top`, `center`, and `bottom`. `offsetY` is an additional normalized fraction of canvas height (clamped to −0.2…0.2). The resulting caption box is automatically clamped inside the overall vertical safe band. The engine does **not** automatically detect underlying labels or avoid all existing objects: select placement based on real preview frames, especially in Viral Editorial 3D layouts.

## Actual technical smoke

GitHub Actions generates a licensed text-only Arabic test fixture, attaches it to the storyboard, checks the Canvas pixel delta with and without captions, checks optional native keyframe motion and exports a low-resolution H.264 MP4. Unit tests also verify pagination without removing words. These automated checks do NOT replace a human visual review of legibility, alignment, occlusion and platform controls. Final project exports still require explicit user approval.
