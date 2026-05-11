# Workout

Personal workout plan. Dark, phone-first, installable PWA. Zero backend.

Live: https://sarvesh1karandikar.github.io/workout/

## How to use on your phone

1. Open the URL above in Safari (iPhone) or Chrome (Android).
2. Share → **Add to Home Screen**. Tap the icon anytime.
3. Tap Push / Pull / Legs+Core → tap set circles to check them off.
4. Checks auto-reset at midnight (local time).

Works offline after first load.

## Editing the plan

Open `workouts.js`, change names / sets / reps, commit, push.
If you change any *structure* of the app (not just the workout data), bump `CACHE` in `sw.js` (`workout-v1` → `workout-v2`) so phones pick up the update.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app (markup, CSS, JS inline) |
| `workouts.js` | Workout data — edit here |
| `manifest.webmanifest` | PWA metadata |
| `sw.js` | Service worker (offline cache) |
| `icon-192.png` / `icon-512.png` | Home-screen icons |
