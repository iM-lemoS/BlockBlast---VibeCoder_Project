# 03. React Component Architecture

The UI is broken down into modular, functional React components:

- `<App />`: The root wrapper. Manages the overall theme and layout container.
- `<GameScreen />`: The main gameplay view.
  - `<Header />`: Displays the current score and high score.
  - `<Grid />`: Renders the 8x8 board.
    - `<Cell />`: Individual squares on the board. Changes state based on hover and placement.
  - `<ShapeTray />`: The area holding the 3 available shapes.
    - `<DraggableShape />`: The individual shape components that the user interacts with.
- `<PauseMenu />` / `<EndScreen />`: Minimalist overlays for pausing or restarting the session.

*Note: Drag-and-drop can be handled via a library like `dnd-kit` or native HTML5 Drag and Drop API depending on mobile support needs.*