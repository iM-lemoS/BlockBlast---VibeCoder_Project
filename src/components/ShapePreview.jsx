/**
 * ShapePreview — renders a shape as a mini grid preview inside the tray.
 *
 * The shape is auto-scaled to fit within a fixed bounding box so small shapes
 * and large shapes both look balanced side-by-side.
 *
 * Props:
 *  - shape:   { cells: [[row,col], ...], color: string } | null
 *  - used:    whether this slot has already been played (fades it out)
 *  - cellSize: override cell size in px (default auto-scales by shape size)
 */

const TRAY_BOX = 72; // bounding box size (px) for the preview
const GAP = 3;

function getCellSize() {
  // Use a fixed size so all blocks are uniform across different shapes
  return 15;
}

export default function ShapePreview({ shape, used = false, dragging = false }) {
  if (!shape) {
    return <div style={{ width: TRAY_BOX, height: TRAY_BOX }} />;
  }

  const { cells, color } = shape;

  // Bounding box of the shape
  const maxRow = Math.max(...cells.map(([r]) => r));
  const maxCol = Math.max(...cells.map(([, c]) => c));
  const rows = maxRow + 1;
  const cols = maxCol + 1;

  const cellSize = getCellSize();
  const cellSet = new Set(cells.map(([r, c]) => `${r}-${c}`));

  // Actual rendered dimensions (may be smaller than TRAY_BOX for non-square shapes)
  const renderedW = cols * cellSize + (cols - 1) * GAP;
  const renderedH = rows * cellSize + (rows - 1) * GAP;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: used ? 0.2 : dragging ? 0.4 : 1,
        transition: 'opacity 0.3s ease, transform 0.2s ease',
        transform: dragging ? 'scale(0.85)' : 'scale(1)',
        cursor: used ? 'default' : 'grab',
      }}
    >
      {/* Shape mini-grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gap: GAP,
          width: renderedW,
          height: renderedH,
        }}
      >
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const filled = cellSet.has(`${r}-${c}`);
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: Math.max(2, cellSize * 0.18),
                  backgroundColor: filled ? color : 'transparent',
                  backgroundImage: filled ? 'url(/BlockBlast---VibeCoder_Project/assets/fur-texture.png)' : 'none',
                  backgroundSize: '180%',
                  backgroundBlendMode: filled ? 'multiply' : 'normal',
                  boxShadow: filled
                    ? `inset 0 -2px 4px rgba(0,0,0,0.25),
                       inset 0 2px 4px rgba(255,255,255,0.4),
                       0 1px 3px rgba(0,0,0,0.1)`
                    : 'none',
                  animation: filled ? 'furSway 15s ease-in-out infinite' : 'none',
                  transition: 'background 0.2s ease',
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
