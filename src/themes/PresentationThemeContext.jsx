import { createContext, useContext, useMemo } from 'react';
import { resolvePresentationTheme } from './index';

const PresentationThemeContext = createContext(resolvePresentationTheme());

export function PresentationThemeProvider({ theme, children }) {
  const value = useMemo(() => resolvePresentationTheme(theme), [theme]);
  return <PresentationThemeContext.Provider value={value}>{children}</PresentationThemeContext.Provider>;
}

export function usePresentationTheme() {
  return useContext(PresentationThemeContext);
}
