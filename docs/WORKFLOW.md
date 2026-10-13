# Workflow
Intake → reference/media analysis → single round of missing questions → creative brief → style bible → timestamped script/Storyboard → tool/environment verification → scene implementation → playable browser preview → review and revisions → explicit approval → local render → FFprobe QA + human visual/audio review → MP4 + editable assets.
Example commands:
npm run intake
npm run plan
npm run preview
npm test
python -m pip install -r requirements-render.txt
python -m playwright install chromium
python scripts/render.py --smoke --seconds 2 --height 360 --fps 10 --output output/smoke.mp4
python scripts/render.py --approved --height 1920 --fps 30 --output output/final.mp4
python scripts/qa.py output/final.mp4
Project files: project/brief.json, project/storyboard.json, project/STYLE.md and project/PLAN.md.
Each scene must contain explicit visual actions and moving elements, not static slides with fades.
