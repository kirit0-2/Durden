import { useState, useEffect } from 'react';

export function useKeyboardVisibility() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleResize = () => {
      // If the visual viewport is significantly smaller than the window height, 
      // it's likely the keyboard is open.
      const isVisible = window.visualViewport.height < window.innerHeight * 0.75;
      setIsKeyboardVisible(isVisible);
    };

    window.visualViewport.addEventListener('resize', handleResize);
    handleResize(); // Check initial state

    return () => {
      window.visualViewport.removeEventListener('resize', handleResize);
    };
  }, []);

  return isKeyboardVisible;
}
