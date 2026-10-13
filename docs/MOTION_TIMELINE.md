# Editable Native Motion Timeline — experimental v0.4

Fastify Motion Bro now accepts optional per-scene **frame-independent**, time-driven motion tracks for the native Canvas hero geometry. This is a real, deterministic interpolation engine, **not** a full GUI nonlinear editor and not a provider integration. It preserves legacy scenes when no keyframes are present.

## Add tracks to an existing storyboard scene

```json
{
  "id": "scene-01",
  "start": 0,
  "end": 5,
  "title": "رحلة المنتج",
  "text": "تصميم متحرك احترافي",
  "motion": {
    "tracks": {
      "x": [
        {"time": 0, "value": -0.22, "easing": "smooth"},
        {"time": 2.5, "value": 0.12}
      ],
      "y": [
        {"time": 0, "value": 0},
        {"time": 2.5, "value": -0.06}
      ],
      "rotation": [
        {"time": 0, "value": -0.3, "easing": "spring"},
        {"time": 2.5, "value": 0.12}
      ],
      "scale": [
        {"time": 0, "value": 0.85, "easing": "ease-out-cubic"},
        {"time": 2.5, "value": 1.12}
      ]
    }
  }
}
```

Times are seconds **relative to the selected scene start**, not global project time. x and y are normalized fractions of canvas dimensions (clamped ±0.35); rotation is in radians (clamped ±π), scale in multipliers (clamped to 0.25–3). Frames must have strictly increasing, finite time values and finite numeric values. Supported easing: linear, hold, ease-in, ease-out, smooth, ease-out-cubic, and critically damped spring.

The engine is implemented in `web/timeline.js`; `web/motion.js` applies it. `frameToSeconds(index, numerator, denominator)` supports integer and rational FPS calculations, although the current Python exporter accepts integer FPS and does not yet expose rational export.

## Usage and validation

1. Generate a storyboard with `npm run plan` or prepare a valid `project/storyboard.json`.
2. Add `motion.tracks` manually to one or more scenes. Do not run `npm run plan` afterward without saving your custom storyboard edits.
3. Run `npm run preview` to observe motion and `npm test` to verify deterministic interpolation.
4. Use `python scripts/render.py --smoke --seconds 2 --height 360 --fps 10 --output output/timeline-smoke.mp4` for a local technical check (not a final deliverable).
5. Request explicit approval before a full final export, any cloud media upload, or a paid provider.

## Current limits

Only the central hero geometry of the **generic native Canvas** profile follows custom scene tracks, not every particle, camera or text layer. Viral Editorial 3D continues to use its separate renderer and preserves its stage approvals. A timeline editing UI, auto-keyframing, audio timeline syncing and 3D orbit camera are separate proposals, **not implemented**.
