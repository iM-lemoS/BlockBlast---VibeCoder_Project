export default function Cell({
  color = null,
  isPreview = false,
  isInvalid = false,
  previewColor = null,
  isPlaced = false,   // triggers scale-in animation
  isClearing = false, // triggers fade-out animation
}) {
  let background;
  let boxShadow = 'none';
  let animation = 'none';

  if (color) {
    background = color;
    boxShadow = `
      inset 0 -2px 0 rgba(0,0,0,0.13),
      inset 0 1px 0 rgba(255,255,255,0.26),
      0 1px 3px rgba(0,0,0,0.08)
    `;
    if (isPlaced)   animation = 'cellAppear 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both';
    if (isClearing) animation = 'cellClear 0.38s ease-in forwards';
  } else if (isInvalid) {
    background = 'rgba(252, 165, 165, 0.45)';
  } else if (isPreview && previewColor) {
    background = previewColor + '55';
  } else {
    background = 'var(--color-cell-empty)';
  }

  return (
    <div
      role="gridcell"
      style={{
        width: '100%',
        aspectRatio: '1',
        borderRadius: 'var(--radius-cell)',
        background,
        boxShadow,
        animation,
        transition: color ? 'none' : 'background 0.15s ease',
        transform: isPreview && !isInvalid && !color ? 'scale(0.92)' : undefined,
      }}
    />
  );
}
