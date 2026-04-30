import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function MenuPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Theme Toggle (Top Right) */}
      <button
        onClick={toggleTheme}
        title="Toggle Theme"
        className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform hover:scale-110"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-soft)' }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Ambient background blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'var(--color-block-light)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'var(--color-accent)' }}
      />

      {/* Card */}
      <div
        className="relative z-10 flex flex-col items-center gap-8 p-10 rounded-3xl"
        style={{
          background: 'var(--color-surface)',
          boxShadow: 'var(--shadow-card)',
          maxWidth: 380,
          width: '90%',
        }}
      >
        {/* Logo / Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1.5 mb-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-md"
                style={{
                  backgroundColor: i % 2 === 0 ? 'var(--color-block)' : 'var(--color-block-light)',
                  backgroundImage: 'url(/BlockBlast---VibeCoder_Project/assets/fur-texture.png)',
                  backgroundSize: '180%',
                  backgroundBlendMode: 'overlay',
                  boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.4), 0 1px 3px rgba(0,0,0,0.1)`,
                  opacity: 0.9,
                  animation: 'furSway 15s ease-in-out infinite',
                }}
              />
            ))}
          </div>
          <h1
            className="text-3xl font-semibold tracking-tight"
            style={{ color: 'var(--color-text)' }}
          >
            Block Blast
          </h1>
          <p
            className="text-sm font-light text-center"
            style={{ color: 'var(--color-text-muted)' }}
          >
            A calm puzzle, at your own pace.
          </p>
        </div>

        {/* High Score */}
        <HighScoreDisplay />

        {/* Play Button */}
        <button
          id="btn-play"
          onClick={() => navigate('/play')}
          className="w-full py-4 rounded-2xl text-white font-semibold text-lg tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: 'var(--color-block)',
            backgroundImage: 'url(/BlockBlast---VibeCoder_Project/assets/fur-texture.png)',
            backgroundSize: '150%',
            backgroundBlendMode: 'overlay',
            boxShadow: 'inset 0 -4px 10px rgba(0,0,0,0.2), inset 0 4px 10px rgba(255,255,255,0.3), 0 8px 20px rgba(0,0,0,0.15)',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            animation: 'furSway 15s ease-in-out infinite',
          }}
        >
          Play
        </button>

        {/* Footer hint */}
        <p
          className="text-xs font-light"
          style={{ color: 'var(--color-text-muted)' }}
        >
          No timers. No pressure. Just flow.
        </p>
      </div>
    </div>
  );
}

function HighScoreDisplay() {
  const highScore = parseInt(localStorage.getItem('blockblast_highscore') || '0', 10);
  if (highScore === 0) return null;

  return (
    <div
      className="flex flex-col items-center gap-1 px-6 py-3 rounded-2xl"
      style={{ background: 'var(--color-bg)' }}
    >
      <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
        High Score
      </span>
      <span className="text-2xl font-semibold" style={{ color: 'var(--color-block)' }}>
        {highScore.toLocaleString()}
      </span>
    </div>
  );
}
