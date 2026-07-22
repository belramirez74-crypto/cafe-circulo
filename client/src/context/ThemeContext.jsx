import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [light, setLight] = useState(() => {
    return localStorage.getItem('cafe_theme') === 'light';
  });

  useEffect(() => {
    localStorage.setItem('cafe_theme', light ? 'light' : 'dark');
    if (light) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [light]);

  const toggle = () => setLight(prev => !prev);

  return (
    <ThemeContext.Provider value={{ light, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
