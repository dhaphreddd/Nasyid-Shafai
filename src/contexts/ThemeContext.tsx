import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemePreference = 'system' | 'light' | 'dark';
type EffectiveTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: EffectiveTheme;
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  themePreference: 'system',
  setThemePreference: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() => {
    const saved = localStorage.getItem('theme_preference') as ThemePreference;
    return saved || 'system';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const computeTheme = (pref: ThemePreference): EffectiveTheme => {
      if (pref === 'dark') return 'dark';
      if (pref === 'light') return 'light';
      return mediaQuery.matches ? 'dark' : 'light';
    };

    const updateTheme = () => {
      const active = computeTheme(themePreference);
      setEffectiveTheme(active);

      if (active === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    const handleSystemChange = () => {
      if (themePreference === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [themePreference]);

  const setThemePreference = (pref: ThemePreference) => {
    setThemePreferenceState(pref);
    localStorage.setItem('theme_preference', pref);
  };

  const toggleTheme = () => {
    if (effectiveTheme === 'dark') {
      setThemePreference('light');
    } else {
      setThemePreference('dark');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: effectiveTheme,
        themePreference,
        setThemePreference,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
