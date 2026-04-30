# 07. Assets and External APIs

## APIs
- **None required.** The game logic is entirely client-side, ensuring privacy and offline capability once loaded.
- High scores are saved locally using `window.localStorage`.

## Audio Assets (`public/sounds/`)
Audio is crucial for the "Zen" feel. Sounds should be organic, soft, and satisfying.
- `pickup.mp3`: A soft click or wooden tap when lifting a shape.
- `place.mp3`: A low-pitch, gentle "thud" or marimba note when a shape is dropped onto the grid.
- `clear.mp3`: A melodic wind chime or soft bell that scales up slightly if multiple lines are cleared.
- `end.mp3`: A soft acoustic fade-out (no harsh buzzers).

## Visual Assets
- Minimalist palette (e.g., `#F4F4F5` background, `#A78BFA` for blocks, `#E4E4E7` for empty grid cells).
- Use native CSS styling (border-radius, box-shadow) instead of heavy image assets.