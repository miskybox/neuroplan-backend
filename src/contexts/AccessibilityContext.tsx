import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';

interface AccessibilitySettings {
  // Sliders de contenido
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  wordSpacing: number;
  
  // Sliders de color
  contrast: number;
  saturation: number;
  brightness: number;
  
  // Herramientas de accesibilidad
  cursorBlack: boolean;
  cursorWhite: boolean;
  readingGuide: boolean;
  magnifier: boolean;
  textAlignment: 'left' | 'center' | 'right' | 'justify';
  blockFlashing: boolean;
  focusMode: boolean;
  dyslexiaFont: boolean;
  readableFont: boolean;
  easyReading: boolean;
  readingMode: boolean;
  hideImages: boolean;
  highlightLinks: boolean;
  highlightTitles: boolean;
  muteSounds: boolean;
  highBrightness: boolean;
  lowBrightness: boolean;
  highContrast: boolean;
  lightContrast: boolean;
  invertedContrast: boolean;
  darkContrast: boolean;
  monochrome: boolean;
  highSaturation: boolean;
  lowSaturation: boolean;
  
  // Perfiles
  activeProfile: string | null;
  activeColorblindProfile: string | null;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetAll: () => void;
  resetContent: () => void;
  resetColor: () => void;
  applyProfile: (profile: string) => void;
  applyColorblindProfile: (profile: string) => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  letterSpacing: 0,
  lineHeight: 150,
  wordSpacing: 0,
  contrast: 100,
  saturation: 100,
  brightness: 100,
  cursorBlack: false,
  cursorWhite: false,
  readingGuide: false,
  magnifier: false,
  textAlignment: 'left',
  blockFlashing: false,
  focusMode: false,
  dyslexiaFont: false,
  readableFont: false,
  easyReading: false,
  readingMode: false,
  hideImages: false,
  highlightLinks: false,
  highlightTitles: false,
  muteSounds: false,
  highBrightness: false,
  lowBrightness: false,
  highContrast: false,
  lightContrast: false,
  invertedContrast: false,
  darkContrast: false,
  monochrome: false,
  highSaturation: false,
  lowSaturation: false,
  activeProfile: null,
  activeColorblindProfile: null,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // SIEMPRE cargar configuración por defecto (sin filtros)
    // Limpiar cualquier configuración guardada previamente
    localStorage.removeItem('accessibilitySettings');
    return defaultSettings;
  });

  // NO guardar en localStorage - los filtros se resetean cada vez
  // useEffect(() => {
  //   localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  // }, [settings]);

  // Aplicar estilos CSS cuando cambien los settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar fuentes
    if (settings.fontSize !== 100) {
      root.style.setProperty('--accessibility-font-size', `${settings.fontSize}%`);
    } else {
      root.style.removeProperty('--accessibility-font-size');
    }
    
    if (settings.letterSpacing !== 0) {
      root.style.setProperty('--accessibility-letter-spacing', `${settings.letterSpacing}px`);
    } else {
      root.style.removeProperty('--accessibility-letter-spacing');
    }
    
    if (settings.lineHeight !== 150) {
      root.style.setProperty('--accessibility-line-height', `${settings.lineHeight}%`);
    } else {
      root.style.removeProperty('--accessibility-line-height');
    }
    
    if (settings.wordSpacing !== 0) {
      root.style.setProperty('--accessibility-word-spacing', `${settings.wordSpacing}px`);
    } else {
      root.style.removeProperty('--accessibility-word-spacing');
    }

    // Aplicar colores
    if (settings.contrast !== 100) {
      root.style.setProperty('--accessibility-contrast', `${settings.contrast}%`);
    } else {
      root.style.removeProperty('--accessibility-contrast');
    }
    
    if (settings.saturation !== 100) {
      root.style.setProperty('--accessibility-saturation', `${settings.saturation}%`);
    } else {
      root.style.removeProperty('--accessibility-saturation');
    }
    
    if (settings.brightness !== 100) {
      root.style.setProperty('--accessibility-brightness', `${settings.brightness}%`);
    } else {
      root.style.removeProperty('--accessibility-brightness');
    }

    // Aplicar clases al body
    const body = document.body;
    
    // Limpiar clases anteriores (incluyendo daltonismo)
    body.classList.remove(
      'accessibility-cursor-black',
      'accessibility-cursor-white',
      'accessibility-reading-guide',
      'accessibility-magnifier',
      'accessibility-text-left',
      'accessibility-text-center',
      'accessibility-text-right',
      'accessibility-text-justify',
      'accessibility-block-flashing',
      'accessibility-focus-mode',
      'accessibility-dyslexia-font',
      'accessibility-readable-font',
      'accessibility-easy-reading',
      'accessibility-reading-mode',
      'accessibility-hide-images',
      'accessibility-highlight-links',
      'accessibility-highlight-titles',
      'accessibility-mute-sounds',
      'accessibility-high-brightness',
      'accessibility-low-brightness',
      'accessibility-high-contrast',
      'accessibility-light-contrast',
      'accessibility-inverted-contrast',
      'accessibility-dark-contrast',
      'accessibility-monochrome',
      'accessibility-high-saturation',
      'accessibility-low-saturation',
      // Limpiar filtros de daltonismo
      'accessibility-colorblind-deuteranopia',
      'accessibility-colorblind-deuteranomalía',
      'accessibility-colorblind-protanopia',
      'accessibility-colorblind-tritanopia',
      'accessibility-colorblind-tritanomalía',
      'accessibility-colorblind-acromatopsia'
    );

    // Aplicar clases activas
    if (settings.cursorBlack) body.classList.add('accessibility-cursor-black');
    if (settings.cursorWhite) body.classList.add('accessibility-cursor-white');
    if (settings.readingGuide) body.classList.add('accessibility-reading-guide');
    if (settings.magnifier) body.classList.add('accessibility-magnifier');
    if (settings.textAlignment) body.classList.add(`accessibility-text-${settings.textAlignment}`);
    if (settings.blockFlashing) body.classList.add('accessibility-block-flashing');
    if (settings.focusMode) body.classList.add('accessibility-focus-mode');
    if (settings.dyslexiaFont) body.classList.add('accessibility-dyslexia-font');
    if (settings.readableFont) body.classList.add('accessibility-readable-font');
    if (settings.easyReading) body.classList.add('accessibility-easy-reading');
    if (settings.readingMode) body.classList.add('accessibility-reading-mode');
    if (settings.hideImages) body.classList.add('accessibility-hide-images');
    if (settings.highlightLinks) body.classList.add('accessibility-highlight-links');
    if (settings.highlightTitles) body.classList.add('accessibility-highlight-titles');
    if (settings.muteSounds) body.classList.add('accessibility-mute-sounds');
    if (settings.highBrightness) body.classList.add('accessibility-high-brightness');
    if (settings.lowBrightness) body.classList.add('accessibility-low-brightness');
    if (settings.highContrast) body.classList.add('accessibility-high-contrast');
    if (settings.lightContrast) body.classList.add('accessibility-light-contrast');
    if (settings.invertedContrast) body.classList.add('accessibility-inverted-contrast');
    if (settings.darkContrast) body.classList.add('accessibility-dark-contrast');
    if (settings.monochrome) body.classList.add('accessibility-monochrome');
    if (settings.highSaturation) body.classList.add('accessibility-high-saturation');
    if (settings.lowSaturation) body.classList.add('accessibility-low-saturation');

    // Aplicar filtros de daltonismo
    if (settings.activeColorblindProfile) {
      body.classList.add(`accessibility-colorblind-${settings.activeColorblindProfile.toLowerCase()}`);
    }
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetAll = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem('accessibilitySettings');
  }, []);

  const resetContent = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      fontSize: 100,
      letterSpacing: 0,
      lineHeight: 150,
      wordSpacing: 0,
    }));
  }, []);

  const resetColor = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      contrast: 100,
      saturation: 100,
      brightness: 100,
    }));
  }, []);

  const applyProfile = useCallback((profile: string) => {
    let profileSettings: Partial<AccessibilitySettings> = { activeProfile: profile };

    switch (profile.toLowerCase()) {
      case 'epilepsia':
        profileSettings = {
          ...profileSettings,
          blockFlashing: true,
          lowSaturation: true,
          saturation: 50,
        };
        break;
      case 'aprendizaje':
        profileSettings = {
          ...profileSettings,
          fontSize: 120,
          readingGuide: true,
          highlightTitles: true,
        };
        break;
      case 'discapacidad visual':
        profileSettings = {
          ...profileSettings,
          fontSize: 150,
          cursorBlack: true,
          highlightTitles: true,
          highlightLinks: true,
        };
        break;
      case 'mayores':
        profileSettings = {
          ...profileSettings,
          fontSize: 150,
          lineHeight: 180,
          letterSpacing: 2,
          wordSpacing: 4,
          readingGuide: true,
          focusMode: true,
          easyReading: true,
        };
        break;
      case 'tdah':
        profileSettings = {
          ...profileSettings,
          readingGuide: true,
          focusMode: true,
          blockFlashing: true,
          easyReading: true,
          highlightTitles: true,
        };
        break;
      case 'dislexia':
        profileSettings = {
          ...profileSettings,
          dyslexiaFont: true,
          readingGuide: true,
          letterSpacing: 1,
          lineHeight: 180,
        };
        break;
    }

    setSettings(prev => ({ ...prev, ...profileSettings }));
  }, []);

  const applyColorblindProfile = useCallback((profile: string) => {
    setSettings(prev => ({
      ...prev,
      activeColorblindProfile: profile,
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      settings,
      updateSettings,
      resetAll,
      resetContent,
      resetColor,
      applyProfile,
      applyColorblindProfile,
    }),
    [settings, updateSettings, resetAll, resetContent, resetColor, applyProfile, applyColorblindProfile]
  );

  return (
    <AccessibilityContext.Provider
      value={contextValue}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
