# Native Canvas studio
Start: npm run plan && npm run preview.
The page loads project/storyboard.json; moving vector scenes are driven by wall-clock time in preview and deterministic time in window.renderFrame(t).
Renderer: python scripts/render.py --smoke --seconds 2 --height 360 --fps 10 --output output/smoke.mp4
No live web server is needed for rendering: Playwright fulfills local web/ and project/ requests.
This implementation produces demo vector scenes, not full photorealistic cartoons, hand-drawn character rigs or per-word synced dialogue.
