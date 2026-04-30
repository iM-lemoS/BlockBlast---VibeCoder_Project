# 05. Routing Strategy

Because this is a single, focused casual game, deep routing is unnecessary. However, to maintain a clean architecture, we will use **React Router**.

- `/` : The splash/menu screen. A simple title and a "Play" button.
- `/play` : The main game board.

## GitHub Pages Consideration
Since standard `BrowserRouter` can cause 404 issues on GitHub Pages upon hard refreshes, we will use **`HashRouter`** (`react-router-dom`). This ensures routes like `user.github.io/block-blast/#/play` resolve perfectly without server-side configuration.