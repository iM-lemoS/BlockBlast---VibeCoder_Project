import { forwardRef } from 'react';
import Cell from './Cell';
import { GRID_SIZE } from '../context/GameContext';

const Grid = forwardRef(function Grid(
  {
    grid,
    previewCells  = new Set(),
    isInvalidDrop = false,
    previewColor  = null,
    placedCells   = new Set(), // newly placed — scale-in animation
    clearingCells = new Set(), // about to clear — fade-out animation
  },
  ref
) {
  return (
    <div
      ref={ref}
      role="grid"
      aria-label="Game board"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows:    `repeat(${GRID_SIZE}, 1fr)`,
        gap: '4px',
        padding: '12px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        width:  'min(80vw, 360px)',
        height: 'min(80vw, 360px)',
      }}
    >
      {grid.map((row, r) =>
        row.map((cellColor, c) => {
          const key       = `${r}-${c}`;
          const isPreview  = previewCells.has(key);
          const isPlaced   = placedCells.has(key);
          const isClearing = clearingCells.has(key);

          return (
            <Cell
              key={key}
              color={cellColor}
              isPreview={isPreview && !cellColor}
              isInvalid={isPreview && isInvalidDrop}
              previewColor={previewColor}
              isPlaced={isPlaced}
              isClearing={isClearing}
            />
          );
        })
      )}
    </div>
  );
});

export default Grid;
