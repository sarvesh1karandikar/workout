# Workout

Personal workout PWA. Dark, phone-first, installable. No backend.

**Live:** https://sarvesh1karandikar.github.io/workout/

## Install on your phone

1. Open the URL in **Safari** (iPhone) or **Chrome** (Android).
2. Share → **Add to Home Screen**.
3. Tap the icon → fullscreen app, works offline.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173/workout/
npm run build      # production build into dist/
npm run preview    # serve the build
```

## Edit the workouts

`src/data/workouts.ts` is the source of truth. Change sets, reps, exercise names, or accent colors there; commit and push; GitHub Actions rebuilds and deploys to Pages.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS for styling
- Framer Motion for transitions and micro-interactions
- canvas-confetti for the completion celebration
- vite-plugin-pwa for the installable / offline bits
- @fontsource/anton (display) + @fontsource/inter (body)
