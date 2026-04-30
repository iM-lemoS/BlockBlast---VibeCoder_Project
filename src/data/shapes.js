/**
 * Shape definitions — cells are [row, col] offsets from top-left origin.
 * Sizes range from 1 to 5 blocks, matching the Block Blast spec.
 * Colors are muted pastels as per the Zen visual style.
 */

// ─── Zen Pastel Color Palette ─────────────────────────────────────────────────
export const SHAPE_COLORS = [
  '#A78BFA', // lavender (primary brand)
  '#93C5FD', // sky blue
  '#6EE7B7', // mint green
  '#FCA5A5', // soft rose
  '#FCD34D', // soft gold
  '#F0ABFC', // soft orchid
  '#7DD3FC', // pale azure
  '#86EFAC', // sage green
];

// ─── Shape Templates ──────────────────────────────────────────────────────────
export const SHAPE_TEMPLATES = [
  // ── Singles (1) ──────────────────────────────────────────────────────────
  { id: 's1', label: 'Dot',         cells: [[0,0]] },

  // ── Dominoes (2) ─────────────────────────────────────────────────────────
  { id: 'd1', label: 'Pair-H',      cells: [[0,0],[0,1]] },
  { id: 'd2', label: 'Pair-V',      cells: [[0,0],[1,0]] },

  // ── Triominoes (3) ───────────────────────────────────────────────────────
  { id: 't1', label: 'Line-3H',     cells: [[0,0],[0,1],[0,2]] },
  { id: 't2', label: 'Line-3V',     cells: [[0,0],[1,0],[2,0]] },
  { id: 't3', label: 'Corner-TL',   cells: [[0,0],[0,1],[1,0]] },
  { id: 't4', label: 'Corner-TR',   cells: [[0,0],[0,1],[1,1]] },
  { id: 't5', label: 'Corner-BL',   cells: [[0,0],[1,0],[1,1]] },
  { id: 't6', label: 'Corner-BR',   cells: [[0,1],[1,0],[1,1]] },

  // ── Tetrominoes (4) ──────────────────────────────────────────────────────
  { id: 'q1', label: 'Square-2x2',  cells: [[0,0],[0,1],[1,0],[1,1]] },
  { id: 'q2', label: 'Line-4H',     cells: [[0,0],[0,1],[0,2],[0,3]] },
  { id: 'q3', label: 'Line-4V',     cells: [[0,0],[1,0],[2,0],[3,0]] },
  { id: 'q4', label: 'L-shape',     cells: [[0,0],[1,0],[2,0],[2,1]] },
  { id: 'q5', label: 'J-shape',     cells: [[0,1],[1,1],[2,0],[2,1]] },
  { id: 'q6', label: 'T-shape',     cells: [[0,1],[1,0],[1,1],[1,2]] },
  { id: 'q7', label: 'S-shape',     cells: [[0,1],[0,2],[1,0],[1,1]] },
  { id: 'q8', label: 'Z-shape',     cells: [[0,0],[0,1],[1,1],[1,2]] },

  // ── Pentominoes (5) ──────────────────────────────────────────────────────
  { id: 'p1', label: 'Line-5H',     cells: [[0,0],[0,1],[0,2],[0,3],[0,4]] },
  { id: 'p2', label: 'Line-5V',     cells: [[0,0],[1,0],[2,0],[3,0],[4,0]] },
  { id: 'p3', label: 'Square-3x3',  cells: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]] },
  { id: 'p4', label: 'BigL',        cells: [[0,0],[1,0],[2,0],[2,1],[2,2]] },
  { id: 'p5', label: 'BigJ',        cells: [[0,2],[1,2],[2,0],[2,1],[2,2]] },
  { id: 'p6', label: 'Plus',        cells: [[0,1],[1,0],[1,1],[1,2],[2,1]] },
];

// ─── Generator ────────────────────────────────────────────────────────────────
let _colorIndex = 0;

/**
 * Pick N distinct random shapes, each with a unique assigned color.
 * Colors cycle through the palette to ensure variety per set.
 */
export function generateShapes(count = 3) {
  // Shuffle a copy of the template pool
  const pool = [...SHAPE_TEMPLATES].sort(() => Math.random() - 0.5);

  return pool.slice(0, count).map((template, i) => {
    const color = SHAPE_COLORS[(_colorIndex + i) % SHAPE_COLORS.length];
    return {
      ...template,
      // Make each instance unique so React keys don't collide across re-rolls
      id: `${template.id}_${Date.now()}_${i}`,
      color,
    };
  });
}
