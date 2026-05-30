# 🌐 Hologram Engine

> Interactive 3D holographic particle visualizer — inspired by wireframe hologram projection art.

![Hologram Engine](https://img.shields.io/badge/built%20with-Next.js%2015-black?style=flat-square)
![Three.js](https://img.shields.io/badge/3D-Three.js-049ef4?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)
![Vercel](https://img.shields.io/badge/deploy-Vercel-black?style=flat-square)

---

## ✨ Features

- **5 Morphable Shapes** — Cube, Sphere, Torus, Vortex, DNA double-helix
- **Smooth Morphing** — Particles interpolate with eased animation between shapes
- **Full Mouse/Touch Drag Control** — Drag to rotate the hologram in 3D
- **Falling Light Streaks** — Vertical particle rain effect as seen in the reference video
- **Central Glow Core** — Pulsing ambient light at the center
- **4 Color Schemes** — Cyan, Blue, White, Rainbow
- **Live HUD** — FPS counter, live clock, particle count, system stats
- **5 Presets** — One-click configuration presets fetched from API
- **REST API** — `/api/config`, `/api/presets`, `/api/snapshot`
- **Vercel-ready** — Zero config deployment

---

## 🗂️ Project Structure

```
hologram-app/
├── app/
│   ├── api/
│   │   ├── config/route.ts       # GET engine config & limits
│   │   ├── presets/route.ts      # GET preset configurations
│   │   └── snapshot/route.ts     # POST save current config snapshot
│   ├── globals.css               # Design tokens, animations, scanlines
│   ├── layout.tsx
│   └── page.tsx                  # Main page
│
├── components/
│   ├── HologramCanvas.tsx        # Three.js WebGL renderer + drag controls
│   ├── ControlPanel.tsx          # Bottom control bar (shape, speed, color, etc.)
│   ├── HUD.tsx                   # Heads-up display overlay
│   └── PresetPanel.tsx           # Preset configs from API
│
├── lib/
│   ├── store.ts                  # Zustand global state
│   └── geometries.ts             # Shape position generators + lerp
│
├── vercel.json                   # Vercel deployment config
└── README.md
```

---

## 🚀 Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open browser
open http://localhost:3000
```

---

## ☁️ Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
# Install Vercel CLI
npm i -g vercel

# From the project root:
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? hologram-engine (or anything)
# - Root directory? ./  (press Enter)
# - Override settings? No
```

### Option B — Vercel Dashboard (GUI)

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "initial: hologram engine"
   git remote add origin https://github.com/YOUR_USER/hologram-engine.git
   git push -u origin main
   ```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. Framework detected automatically as **Next.js**
5. Click **Deploy** — live in ~60 seconds ✅

---

## 🎮 Controls

| Action | Result |
|--------|--------|
| **Drag** (mouse or touch) | Rotate hologram freely in 3D |
| **Shape buttons** | Morph particles to new shape |
| **Velocity slider** | Control rotation + animation speed |
| **Particle Size slider** | Adjust particle dot size |
| **Glow slider** | Adjust central glow intensity |
| **Color buttons** | Switch emission color |
| **Play/Pause** | Freeze animation |
| **Presets** | Load preset configurations |

---

## 🔌 REST API

### `GET /api/config`
Returns engine configuration, shape list, and parameter limits.

```json
{
  "shapes": ["cube", "sphere", "torus", "vortex", "dna"],
  "colorSchemes": ["cyan", "blue", "white", "rainbow"],
  "defaults": { "shape": "cube", "particleCount": 4000, "speed": 1.0, ... },
  "limits": { "particleCount": { "min": 500, "max": 10000 }, ... }
}
```

### `GET /api/presets`
Returns preset configurations.

```json
{
  "presets": [
    { "id": "holographic-cube", "name": "Holographic Cube", "config": { ... } },
    ...
  ]
}
```

### `POST /api/snapshot`
Save a config snapshot.

```json
// Request body
{ "shape": "sphere", "speed": 1.5, "colorScheme": "cyan", ... }

// Response
{ "snapshot": { "id": "snap_1748123456", "createdAt": "...", "shareUrl": "/share/..." } }
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| 3D Engine | Three.js |
| State | Zustand |
| Styling | Tailwind CSS v4 |
| Fonts | Orbitron + Share Tech Mono |
| Deploy | Vercel |

---

## 📐 How It Works

### Particle Morphing
Each shape (cube, sphere, torus, vortex, DNA) is defined as a set of 3D point positions in `lib/geometries.ts`. When you switch shapes, the current positions are linearly interpolated (`lerp`) toward the target positions with an ease-in-out function over ~40 frames — creating a smooth morph effect.

### Drag Rotation
Mouse/touch events update `targetRotX/Y` values. The actual rotation smoothly follows via `lerp` each frame (`rotX += (target - rotX) * 0.08`), giving a spring-like feel. Auto-rotation accumulates in `autoRotY` but pauses while dragging.

### Falling Streaks
A second `THREE.Points` object with ~300 particles animates independently, with each Y position decremented each frame and reset when it goes below the scene floor — mimicking the falling light stream effect from the reference video.

---

## 📄 License
MIT — use freely, credit appreciated.
