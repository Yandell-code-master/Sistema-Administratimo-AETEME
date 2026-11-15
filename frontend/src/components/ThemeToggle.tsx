import { useState } from 'react';

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

interface ThemeToggleProps {
  inline?: boolean;
}

export default function ThemeToggle({ inline }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(() => currentTheme());

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('aeteme-theme', next);
    } catch {
      // localStorage no disponible: el cambio solo vive en esta sesión.
    }
    setTheme(next);
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle${inline ? ' theme-toggle--inline' : ''}`}
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      <span className="material-symbols-outlined" aria-hidden="true">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
