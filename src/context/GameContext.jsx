import { createContext, useContext, useReducer, useEffect } from 'react';
import { generateShapes } from '../data/shapes';

export const GRID_SIZE = 8;
const LS_KEY = 'blockblast_highscore';

// ─── Helpers (exported for GameScreen to use) ─────────────────────────────────
export const createEmptyGrid = () =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

export function canPlace(grid, cells, row, col) {
  return cells.every(([dr, dc]) => {
    const r = row + dr, c = col + dc;
    return r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && grid[r][c] === null;
  });
}

export function anyShapeFits(grid, shapes) {
  return shapes.some((shape) => {
    if (!shape) return false;
    for (let r = 0; r < GRID_SIZE; r++)
      for (let c = 0; c < GRID_SIZE; c++)
        if (canPlace(grid, shape.cells, r, c)) return true;
    return false;
  });
}

/** Simulate placing a shape and return the resulting grid */
export function simulatePlacement(grid, cells, row, col, color) {
  const next = grid.map((r) => [...r]);
  cells.forEach(([dr, dc]) => { next[row + dr][col + dc] = color; });
  return next;
}

/** Return a Set of "row-col" keys for cells in full rows/columns */
export function computeClearingCells(grid) {
  const keys = new Set();
  for (let r = 0; r < GRID_SIZE; r++)
    if (grid[r].every((c) => c !== null))
      for (let c = 0; c < GRID_SIZE; c++) keys.add(`${r}-${c}`);
  for (let c = 0; c < GRID_SIZE; c++)
    if (grid.every((row) => row[c] !== null))
      for (let r = 0; r < GRID_SIZE; r++) keys.add(`${r}-${c}`);
  return keys;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────
function clearLines(grid) {
  const next = grid.map((r) => [...r]);
  const fullRows = [], fullCols = [];
  for (let r = 0; r < GRID_SIZE; r++)
    if (next[r].every((c) => c !== null)) fullRows.push(r);
  for (let c = 0; c < GRID_SIZE; c++)
    if (next.every((row) => row[c] !== null)) fullCols.push(c);
  fullRows.forEach((r) => { for (let c = 0; c < GRID_SIZE; c++) next[r][c] = null; });
  fullCols.forEach((c) => { for (let r = 0; r < GRID_SIZE; r++) next[r][c] = null; });
  return { newGrid: next, linesCleared: fullRows.length + fullCols.length };
}

function calcScore(blockCount, linesCleared) {
  return blockCount * 10 + (linesCleared > 0 ? linesCleared * 100 * linesCleared : 0);
}

// ─── State ────────────────────────────────────────────────────────────────────
function makeInitialState() {
  return {
    grid: createEmptyGrid(),
    score: 0,
    highScore: parseInt(localStorage.getItem(LS_KEY) || '0', 10),
    availableShapes: generateShapes(3),
    status: 'PLAYING',
    soundEnabled: true,
    theme: localStorage.getItem('blockblast_theme') || 'light',
  };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function gameReducer(state, action) {
  switch (action.type) {

    // Phase 4 two-step: PLACE_SHAPE just places blocks, COMMIT_CLEAR clears lines
    case 'PLACE_SHAPE': {
      const { shapeId, row, col } = action.payload;
      const idx = state.availableShapes.findIndex((s) => s?.id === shapeId);
      if (idx === -1) return state;
      const shape = state.availableShapes[idx];
      if (!canPlace(state.grid, shape.cells, row, col)) return state;

      // Place blocks (no line clear yet — animation happens in GameScreen)
      const placedGrid = simulatePlacement(state.grid, shape.cells, row, col, shape.color);

      // Remove used shape
      const nextShapes = [...state.availableShapes];
      nextShapes[idx] = null;

      return { ...state, grid: placedGrid, availableShapes: nextShapes };
    }

    case 'COMMIT_CLEAR': {
      // Called after the clearing animation finishes
      const { newGrid, linesCleared } = clearLines(state.grid);
      const gained = calcScore(action.payload.blockCount, linesCleared);
      const newScore = state.score + gained;
      const newHighScore = Math.max(state.highScore, newScore);

      let nextShapes = [...state.availableShapes];
      if (nextShapes.every((s) => s === null)) nextShapes = generateShapes(3);

      const active = nextShapes.filter(Boolean);
      const isGameOver = active.length > 0 && !anyShapeFits(newGrid, active);

      return {
        ...state,
        grid: newGrid,
        score: newScore,
        highScore: newHighScore,
        availableShapes: nextShapes,
        status: isGameOver ? 'GAME_OVER' : 'PLAYING',
      };
    }

    case 'NEW_GAME':
      return { ...makeInitialState(), highScore: state.highScore };

    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, makeInitialState);

  useEffect(() => {
    localStorage.setItem(LS_KEY, state.highScore.toString());
  }, [state.highScore]);

  useEffect(() => {
    localStorage.setItem('blockblast_theme', state.theme);
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within <GameProvider>');
  return ctx;
}
