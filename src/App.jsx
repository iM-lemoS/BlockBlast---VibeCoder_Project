import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import GameScreen from './pages/GameScreen';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/play" element={<GameScreen />} />
          {/* Fallback: redirect unknown routes to menu */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}
