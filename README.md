# A Groovy and Stupid Trip to Osaka

A private, mobile-first Osaka travel command center built with Vinext for Sites.

The app is designed to stay friendly on roaming data: no remote fonts, no heavy
hero images, and no tracking scripts. The Osaka-at-night hero is CSS-generated,
while editable starter content lives in `public/data`.

## What Is Included

- Mobile launchpad for map, phrases, weather, food, sumo, budget, packing,
  journal, and emergency tools
- Saved Google Map and direction launcher
- Searchable phrasebook with 100+ starter Japanese phrases
- Local-device saving for favorites, checklists, budget, and journal entries
- Dark dashboard styling with teal and warm orange accents

## Commands

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run lint
```

## Source Shape

- `app/page.tsx`: travel app UI and client-side interactions
- `app/globals.css`: mobile-first visual system
- `public/data/phrases.json`: editable Japanese phrasebook
- `public/data/places.json`: editable Osaka destination buttons
- `public/favicon.svg`: tiny local favicon
