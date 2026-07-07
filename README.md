# A Groovy and Stupid Trip to Osaka

A private, mobile-first Osaka travel command center built as a standard Next.js app for Vercel.

The app is designed to stay friendly on roaming data: no remote fonts, no heavy
hero images, and no tracking scripts. The Osaka-at-night hero is CSS-generated,
while editable starter content lives in `public/data`.

## What Is Included

- Mobile launchpad for map, phrases, weather, food, sumo, budget, packing,
  journal, and emergency tools
- Saved Google Map and direction launcher
- Searchable phrasebook with 100+ starter Japanese phrases
- Local-device saving for favorites, checklists, budget, and journal entries
- Separate `/packing` checklist route for pre-flight packing
- Dark dashboard styling with teal and warm orange accents

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

The local dev server will print a localhost URL, usually `http://localhost:3000`.

## Source Shape

- `app/page.tsx`: travel app UI and client-side interactions
- `app/packing/page.tsx`: separate packing checklist route
- `app/globals.css`: mobile-first visual system
- `public/data/phrases.json`: editable Japanese phrasebook
- `public/data/places.json`: editable Osaka destination buttons
- `public/favicon.svg`: tiny local favicon

## Vercel Settings

- Framework Preset: Next.js
- Root Directory: `.`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave blank / Next.js default
- Development Command: `npm run dev`
- Node.js Version: 22.x
