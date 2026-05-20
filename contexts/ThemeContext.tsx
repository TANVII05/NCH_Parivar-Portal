import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  isDark: boolean;
  mode: ThemeMode;
  colors: typeof Colors.light;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  mode: 'light',
  colors: Colors.light,
  toggleTheme: () => {},
});

const THEME_KEY = '@nch_parivar_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (stored === 'dark' || stored === 'light') {
        setMode(stored);
      }
    } catch (e) {
      console.log('Failed to load theme:', e);
    }
  };

  const toggleTheme = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode);
    } catch (e) {
      console.log('Failed to save theme:', e);
    }
  };

  const isDark = mode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
