import { useNavigate } from 'react-router-dom';

/**
 * Header — displays score, game title and high score.
 * Includes a subtle back-to-menu button.
 */
export default function Header({ score, highScore }) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-soft)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Score */}
      <ScoreBox label="Score" value={score} />

      {/* Title + back button */}
      <button
        id="btn-back-menu"
        onClick={() => navigate('/')}
        title="Back to menu"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          padding: '4px 8px',
          borderRadius: 10,
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
      >
        {/* Mini block logo */}
        <div style={{ display: 'flex', gap: 3 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 2,
                background: i === 1 ? 'var(--color-block)' : 'var(--color-block-light)',
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '-0.3px',
            color: 'var(--color-block)',
          }}
        >
          Block Blast
        </span>
      </button>

      {/* High Score */}
      <ScoreBox label="Best" value={highScore} align="right" />
    </header>
  );
}

function ScoreBox({ label, value, align = 'left' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'right' ? 'flex-end' : 'flex-start',
        minWidth: 56,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 24,
          fontWeight: 600,
          lineHeight: 1.1,
          color: 'var(--color-text)',
          transition: 'transform 0.15s ease',
        }}
      >
        {value.toLocaleString()}
      </span>
    </div>
  );
}
