# Production profiles — selective agent router

The new profiles generate PROMPTS and JSON, not actual Flow/Veo clips. Select ONE workflow; do not conflate the different "start" instructions.

| Mode | Intake gates | Output |
|---|---|---|
| stickman | existing image yes/no + Paper or Real background + genre 1–6 together | 5 IMAGE + VIDEO motion prompt pairs, 6–8s, exact character/background blocks |
| character-romance | optional direction | 2 original stylized character locks, 5 scenes and ≥2 images each, narration |
| fitness | choose muscle group (10 choices) | 5 × 6s, 0–4s form then 4–6s muscle visualization and short coach cue |
| car-exploded | brand (~47) → model → year/trim/color | exactly three prompts: complete car, exploded image-to-image, dual-reference animation |
| vox-history | topic → custom subject when needed → number of clips | N × 10s archival collage, 4–6 elements per beat, locked narrator voice, history fact check flag |
| food-flow | food or custom choice → number of clips | N × 10s action-specific foley, locked chef/kitchen/camera, final eating shot |
| kinetic-flow | A–S style/theme and 6 options → custom/reference DNA if needed → script | 8/10s prompts with exact original words, identical STYLE, 3–5 beats, optional explicit clean plate |
| viral-editorial-3d | ideas → script → palette → posters → motion prompts | stage-gated mixed-media original Canvas 2.5D preview (see own skill) |
| generic video | missing brief questions → storyboard → preview approval | editable animation source; Native Canvas render available |

A bare 'start' must be interpreted within the already selected mode; when not selected, show mode chooser. Content supplied by the user about the project is NOT an automatic trigger to generate all its example films.

Stage behavior is enforced by scripts/profiles-cli.mjs and scripts/profiles/*.mjs. CLI stores per-profile session.json, prompts.txt and artifacts.json in ignored projects/profiles/<mode> folder. External Flow model support can change: verify current model lengths and access in actual provider interface. Do not invent media files, render receipts, image analysis or API connectivity.

Reference-media imitation: learn general style and choreography, not protected words/logos/characters. Stickman existing image requires actual reference-accepting generator and the unchanged instruction in all prompts; reference failures must be disclosed. Historical documentary requires independent factual verification and authentic imagery source research before release. Any paid model run, external upload or final MP4 export requires separate user authorization.
