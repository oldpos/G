# THE LAST MIND — Playable Prototype 01

A browser-based first-person psychological-horror puzzle prototype built with HTML, CSS, JavaScript modules and Three.js.

## What is implemented

- Three.js 3D room with concrete walls, floor, ceiling, pipes, desk, terminal, wall clock, emergency lighting and fog.
- First-person camera and movement.
- PC controls: WASD / arrow keys to move, mouse to look (click the scene to capture the mouse).
- Touch controls: left virtual joystick to move; drag the right side of the screen to look.
- Flashlight with a slowly draining battery.
- Interactable desk note, wall clock, security terminal and exit door.
- A two-stage puzzle: solve the number sequence (`32`), then use the room clue to enter the access code (`417`).
- The exit unlocks only after both stages are solved.
- Level completion state and local save/resume using `localStorage`.
- Responsive HUD, main menu, pause, notes, help and puzzle dialogs.

## Run locally

This project uses JavaScript ES modules, so serve it over HTTP (do not open `index.html` directly as a `file://` URL).

### Option A: Python

```bash
cd the-last-mind
python -m http.server 8000
```

Open `http://localhost:8000` in a modern browser.

### Option B: Node.js

```bash
npx serve .
```

Open the local URL printed by the server.

## Controls

| Action | PC | Mobile |
|---|---|---|
| Move | WASD / arrow keys | Left virtual joystick |
| Look | Mouse | Drag right side of screen |
| Interact | E or click target | Tap E when target prompt appears |
| Flashlight | F / HUD button | Light button |
| Notes | N / HUD button | Notes HUD button |
| Pause | Esc / HUD button | Pause HUD button |

## Puzzle walkthrough (for testing)

1. Start a new game.
2. Aim at the desk note and press E (or tap it). It reveals the order clue.
3. Inspect the wall clock; it reveals `4 — 1 — 7`.
4. Aim at the security terminal and interact.
5. Stage 1: the sequence doubles each time: `2, 4, 8, 16, 32`. Submit `32`.
6. Stage 2: submit the three-digit code `417`.
7. The terminal unlocks the exit. Walk to the door and interact, or walk through the open doorway to trigger completion.

## Save data

Progress is stored in browser `localStorage` under `the-last-mind-prototype-v1`. Use **New Game** to reset the saved run. **Save & Main Menu** stores the current run and returns to the menu.

## Deployment

Upload the complete `the-last-mind` folder to any static host that serves HTML, CSS and JavaScript files (for example GitHub Pages, Netlify, Vercel static hosting or a normal web server). Keep the folder structure intact.

## Dependencies and asset notes

- Three.js is loaded as an ES module from jsDelivr (`three@0.160.0`). An internet connection is required for the CDN dependency.
- Google Fonts and the optional menu background are loaded remotely. The 3D room itself is procedurally built from Three.js geometry; no external 3D model files are required for this prototype.
- Replace the procedural room and remote decorative background with original/licensed GLB models, textures and sound assets during production.

## Verification status and known limitations

The source has been checked for module/file structure and the intended gameplay flow. This execution environment does not provide a real Android/PC browser with WebGL input simulation, so an actual end-to-end browser playtest and measured FPS verification have **not** been performed here. Please verify on target devices after serving the project.

Prototype limitations:
- The room is stylized procedural 3D, not yet photorealistic production art.
- Enemy AI, spatial sound, full 20-level campaign, cloud saves, and production-grade animations are not included in this first prototype.
- Flashlight battery is a gameplay prototype value; there is no recharge mechanic yet.
- The access code is deliberately fixed for this prototype.
