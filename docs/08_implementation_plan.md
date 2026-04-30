# 08. Implementation Plan

**Phase 1: Foundation (Days 1-2)**
- Initialize project with Vite and React.
- Set up Tailwind CSS.
- Configure `HashRouter` and basic page skeletons.

**Phase 2: The Grid & Shapes (Days 3-4)**
- Build the `Grid` and `Cell` components.
- Create a data structure for the shapes (arrays of coordinates).
- Implement the `ShapeTray` and render static shapes.

**Phase 3: Interaction & Logic (Days 5-7)**
- Integrate `@dnd-kit/core` to allow dragging shapes from the tray to the grid.
- Implement collision detection (shapes can't overlap existing blocks).
- Implement line-clearing logic and scoring calculations.

**Phase 4: Game Loop & Polish (Days 8-9)**
- Implement "Game Over" detection (checking if available shapes fit).
- Add local storage for high scores.
- Integrate sound effects using the HTML5 Audio API.
- Add CSS transitions for placing blocks and clearing lines (fade-outs).

**Phase 5: Deployment (Day 10)**
- Test thoroughly on mobile browser views (touch events for drag-and-drop).
- Configure the `vite.config.js` base path for GitHub Pages.
- Deploy using the `gh-pages` CLI tool.