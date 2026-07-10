import { useLayoutEffect, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  const scrollToTop = () => {
    // Scroll do window
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Scroll do main container
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0;
      mainContent.scrollLeft = 0;
    }
  };

  useLayoutEffect(() => {
    scrollToTop();
    const timeoutId = setTimeout(scrollToTop, 0);
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  // Também rola para o topo quando a página carrega (F5 ou refresh)
  useEffect(() => {
    scrollToTop();
    // Delay para renderização do painel IA completar
    const timeoutId = setTimeout(scrollToTop, 150);
    return () => clearTimeout(timeoutId);
  }, []);

  return null;
};