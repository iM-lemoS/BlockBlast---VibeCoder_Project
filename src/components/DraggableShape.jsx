import { useDraggable } from '@dnd-kit/core';
import ShapePreview from './ShapePreview';

export default function DraggableShape({ shape, used, disabled = false }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: shape.id,
    data: { shape },
    disabled: used || !shape || disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        touchAction: 'none',
        cursor: used || disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
        outline: 'none',
        opacity: isDragging ? 0.3 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      <ShapePreview shape={shape} used={used} dragging={false} />
    </div>
  );
}
