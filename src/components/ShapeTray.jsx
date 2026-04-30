import DraggableShape from './DraggableShape';

export default function ShapeTray({ shapes, isAnimating = false }) {
  return (
    <div
      role="region"
      aria-label="Available shapes"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        gap: '8px',
        padding: '16px 24px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-soft)',
        width: 'min(80vw, 360px)',
      }}
    >
      {shapes.map((shape, idx) => (
        <ShapeSlot key={idx} shape={shape} isAnimating={isAnimating} />
      ))}
    </div>
  );
}

function ShapeSlot({ shape, isAnimating }) {
  const used = shape === null;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 88,
        height: 88,
        borderRadius: 12,
        background: used ? 'transparent' : 'var(--color-bg)',
        transition: 'background 0.25s ease',
      }}
    >
      {used ? (
        <div style={{ width: 72, height: 72 }} />
      ) : (
        <DraggableShape shape={shape} used={false} disabled={isAnimating} />
      )}
    </div>
  );
}
