import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipagem das cores suportadas pelos arquivos .css
export type ColorTheme = 
  // Padrão / Vinho
  | 'rose' 
  
  // Família dos Azuis (Tons Frios)
  | 'sky' 
  | 'cyan' 
  | 'blue' 
  | 'indigo'
  | 'slate'
  
  // Família dos Verdes
  | 'teal' 
  | 'emerald' 
  | 'green' 
  | 'lime'
  
  // Família dos Amarelos, Laranjas e Vermelhos (Tons Quentes)
  | 'yellow' 
  | 'amber' 
  | 'orange' 
  | 'red'
  
  // Família dos Roxos e Rosas
  | 'violet' 
  | 'purple' 
  | 'fuchsia' 
  | 'pink';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (color: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    if (typeof window === 'undefined') return 'rose';
    const saved = localStorage.getItem('theme-color') as ColorTheme;
    return saved || 'rose';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Sincroniza a classe da paleta de cores (ex: theme-teal) no <html>
  useEffect(() => {
    const root = window.document.documentElement;
    
    const themeClasses: string[] = [
      'theme-sky', 'theme-cyan', 'theme-blue', 'theme-indigo', 
      'theme-teal', 'theme-emerald', 'theme-green', 'theme-lime', 
      'theme-yellow', 'theme-amber', 'theme-orange', 'theme-red', 
      'theme-violet', 'theme-purple', 'theme-fuchsia', 'theme-pink', 
      'theme-slate'
    ];
    
    themeClasses.forEach((cls) => root.classList.remove(cls));

    // O tema 'Vinho' é o padrão
    if (colorTheme !== 'rose') {
      root.classList.add(`theme-${colorTheme}`);
    }
  }, [colorTheme]);

  // Escuta mudança de tema do SO
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const hasManualChoice = localStorage.getItem('theme');
      if (!hasManualChoice) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      // @ts-ignore - Safari < 14
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        // @ts-ignore
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  // Alternador manual do Modo de Brilho
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  // Alternador manual de Cores (Persiste no LocalStorage)
  const setColorTheme = (color: ColorTheme) => {
    setColorThemeState(color);
    localStorage.setItem('theme-color', color);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return context;
};