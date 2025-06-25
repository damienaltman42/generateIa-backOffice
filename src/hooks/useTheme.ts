import { useState, useEffect } from 'react';
import { theme } from 'antd';

const THEME_KEY = 'app_theme';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'dark';
  });

  useEffect(() => {
    // Appliquer le thème au body pour les styles globaux
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    // Sauvegarder la préférence
    localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return {
    isDarkMode,
    toggleTheme,
    themeConfig: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };
}; 