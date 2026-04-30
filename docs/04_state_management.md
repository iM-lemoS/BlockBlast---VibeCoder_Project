# 04. State Management

Given the simplicity of the game, we will avoid heavy libraries like Redux. **React Context API combined with `useReducer`** is the perfect middle-ground for managing the game loop.

## Global Game State (`GameStateContext`)
```javascript
{
  grid: Array(8).fill(Array(8).fill(null)), // 2D array representing the board
  score: 0,
  highScore: 0, // Persisted to localStorage
  availableShapes: [], // Array of 3 shape objects
  status: 'PLAYING', // 'MENU', 'PLAYING', 'GAME_OVER'
  soundEnabled: true
}