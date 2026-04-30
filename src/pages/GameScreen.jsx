import { useState, useRef, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  GameProvider,
  useGame,
  canPlace,
  simulatePlacement,
  computeClearingCells,
  GRID_SIZE,
} from '../context/GameContext';
import Header from '../components/Header';
import Grid from '../components/Grid';
import ShapeTray from '../components/ShapeTray';
import { playPickup, playPlace, playClear, playEnd } from '../utils/sounds';

const GRID_PADDING = 12;
const CELL_GAP = 4;

export default function GameScreen() {
  return (
    <GameProvider>
      <GameView />
    </GameProvider>
  );
}

function GameView() {
  const { state, dispatch } = useGame();
  const { grid, score, highScore, availableShapes, status, soundEnabled } = state;

  const [draggingShapeId, setDraggingShapeId] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);

  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [placedCells, setPlacedCells] = useState(new Set());
  const [clearingCells, setClearingCells] = useState(new Set());

  const gridRef = useRef(null);
  const prevStatusRef = useRef(status);

  // ── Trigger Game Over sound ──
  useEffect(() => {
    if (status === 'GAME_OVER' && prevStatusRef.current !== 'GAME_OVER') {
      if (soundEnabled) playEnd();
    }
    prevStatusRef.current = status;
  }, [status, soundEnabled]);

  const draggingShape =
    availableShapes.find((s) => s?.id === draggingShapeId) ?? null;

  const getCellMetrics = useCallback(() => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const innerW = rect.width - GRID_PADDING * 2;
    const cellSize = (innerW - (GRID_SIZE - 1) * CELL_GAP) / GRID_SIZE;
    return { rect, cellSize };
  }, []);

  useEffect(() => {
    if (!draggingShapeId || isAnimating) {
      setHoverCell(null);
      return;
    }

    const onPointerMove = (e) => {
      const metrics = getCellMetrics();
      if (!metrics) return;
      const { rect, cellSize } = metrics;
      const step = cellSize + CELL_GAP;

      const col = Math.floor((e.clientX - rect.left - GRID_PADDING) / step);
      const row = Math.floor((e.clientY - rect.top - GRID_PADDING) / step);

      if (col >= 0 && col < GRID_SIZE && row >= 0 && row < GRID_SIZE) {
        setHoverCell({ row, col });
      } else {
        setHoverCell(null);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [draggingShapeId, getCellMetrics, isAnimating]);

  const { previewCells, isInvalidDrop } = (() => {
    if (!draggingShape || !hoverCell || isAnimating) {
      return { previewCells: new Set(), isInvalidDrop: false };
    }
    const keys = draggingShape.cells.map(
      ([dr, dc]) => `${hoverCell.row + dr}-${hoverCell.col + dc}`
    );
    return {
      previewCells: new Set(keys),
      isInvalidDrop: !canPlace(grid, draggingShape.cells, hoverCell.row, hoverCell.col),
    };
  })();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 80, tolerance: 8 } })
  );

  function handleDragStart({ active }) {
    if (isAnimating) return;
    setDraggingShapeId(active.id);
    if (soundEnabled) playPickup();
  }

  function handleDragEnd({ active }) {
    if (!hoverCell || !draggingShape || isInvalidDrop || isAnimating) {
      setDraggingShapeId(null);
      setHoverCell(null);
      return;
    }

    const row = hoverCell.row;
    const col = hoverCell.col;
    const blockCount = draggingShape.cells.length;

    // 1. Lock interactions
    setIsAnimating(true);
    setDraggingShapeId(null);
    setHoverCell(null);

    if (soundEnabled) playPlace();

    // 2. Compute animation targets based on current state + placement
    const placedGrid = simulatePlacement(grid, draggingShape.cells, row, col, draggingShape.color);
    const cellsToClear = computeClearingCells(placedGrid);
    const placedKeys = new Set(
      draggingShape.cells.map(([dr, dc]) => `${row + dr}-${col + dc}`)
    );

    // 3. Dispatch placement to update UI immediately
    dispatch({
      type: 'PLACE_SHAPE',
      payload: { shapeId: active.id, row, col },
    });

    setPlacedCells(placedKeys);

    // 4. Sequence animations
    setTimeout(() => {
      // Clear placed bounce state
      setPlacedCells(new Set());

      if (cellsToClear.size > 0) {
        // Trigger clear animation
        setClearingCells(cellsToClear);
        
        // Calculate number of lines for sound scaling
        // This is a rough estimation based on size, could be improved but works well enough
        const estimatedLines = Math.floor(cellsToClear.size / GRID_SIZE);
        if (soundEnabled) playClear(estimatedLines);

        setTimeout(() => {
          // Finish clearing
          setClearingCells(new Set());
          dispatch({ type: 'COMMIT_CLEAR', payload: { blockCount } });
          setIsAnimating(false);
        }, 400); // 400ms matches CSS cellClear animation duration
      } else {
        // No lines to clear, just commit
        dispatch({ type: 'COMMIT_CLEAR', payload: { blockCount } });
        setIsAnimating(false);
      }
    }, 300); // 300ms matches CSS cellAppear animation duration
  }

  function handleDragCancel() {
    setDraggingShapeId(null);
    setHoverCell(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-bg)',
        }}
      >
        <Header score={score} highScore={highScore} />

        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            padding: '16px 12px',
          }}
        >
          <Grid
            ref={gridRef}
            grid={grid}
            previewCells={previewCells}
            isInvalidDrop={isInvalidDrop}
            previewColor={draggingShape?.color ?? null}
            placedCells={placedCells}
            clearingCells={clearingCells}
          />
          <ShapeTray shapes={availableShapes} isAnimating={isAnimating} />
        </main>

        {status === 'GAME_OVER' && (
          <GameOverOverlay
            score={score}
            highScore={highScore}
            onNewGame={() => dispatch({ type: 'NEW_GAME' })}
          />
        )}
      </div>

      <DragOverlay dropAnimation={null}>
        {draggingShape ? <ShapeOverlay shape={draggingShape} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

const OVERLAY_CELL = 38;
const OVERLAY_GAP = 4;

function ShapeOverlay({ shape }) {
  const { cells, color } = shape;
  const maxRow = Math.max(...cells.map(([r]) => r));
  const maxCol = Math.max(...cells.map(([, c]) => c));
  const rows = maxRow + 1;
  const cols = maxCol + 1;
  const cellSet = new Set(cells.map(([r, c]) => `${r}-${c}`));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, ${OVERLAY_CELL}px)`,
        gridTemplateColumns: `repeat(${cols}, ${OVERLAY_CELL}px)`,
        gap: OVERLAY_GAP,
        opacity: 0.88,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.18))',
      }}
    >
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const filled = cellSet.has(`${r}-${c}`);
          return (
            <div
              key={`${r}-${c}`}
              style={{
                width: OVERLAY_CELL,
                height: OVERLAY_CELL,
                borderRadius: 6,
                background: filled ? color : 'transparent',
                boxShadow: filled
                  ? `inset 0 -3px 0 rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.28)`
                  : 'none',
              }}
            />
          );
        })
      )}
    </div>
  );
}

function GameOverOverlay({ score, highScore, onNewGame }) {
  const isNewRecord = score > 0 && score >= highScore;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(244, 244, 245, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        animation: 'zenFadeIn 0.4s ease',
      }}
    >
      <style>{`
        @keyframes zenFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 24,
          boxShadow: 'var(--shadow-card)',
          padding: '40px 36px',
          maxWidth: 320,
          width: '88%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 40 }}>🌿</span>

        <div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 6px' }}>
            Take a breath.
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0, fontWeight: 300 }}>
            No more moves — but that was a lovely session.
          </p>
        </div>

        <div
          style={{
            background: 'var(--color-bg)',
            borderRadius: 14,
            padding: '12px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {isNewRecord && (
            <span style={{ fontSize: 11, color: 'var(--color-block)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ✨ New High Score
            </span>
          )}
          <span style={{ fontSize: 34, fontWeight: 700, color: 'var(--color-block)', lineHeight: 1 }}>
            {score.toLocaleString()}
          </span>
          {!isNewRecord && (
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              Best: {highScore.toLocaleString()}
            </span>
          )}
        </div>

        <button
          id="btn-try-again"
          onClick={onNewGame}
          style={{
            width: '100%',
            padding: '13px 0',
            borderRadius: 16,
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, var(--color-block) 0%, var(--color-block-dark) 100%)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 500,
            boxShadow: '0 4px 16px rgba(167,139,250,0.35)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
