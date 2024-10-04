import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type StyleKey = 'resetButton' | 'closeButton' | 'container' | 'flag' | 'buttonEnabled' | 'buttonDisabled' | 'header';
export type StyleState = {
  [K in StyleKey]: React.CSSProperties;
};

export type StyleFetch = {
  style_id: string
  styles: Array<{
    name: StyleKey,
    value: string
  }>
}

type StyleContextType = {
  styles: StyleState;
  originalStyles: StyleState;
  modifiedStyles: Set<StyleKey>;
  resetTimestamps: {[K in StyleKey]?: number};
  updateStyle: (key: StyleKey, newStyle: React.CSSProperties) => void;
  resetStyle: (key: StyleKey) => void;
};

export const positionOptions = ["relative", "fixed", "absolute", "static", "sticky"] as const;
type PositionType = typeof positionOptions[number];
export function isValidPosition(position: unknown): position is PositionType {
  return typeof position === 'string' && positionOptions.includes(position as PositionType);
}

export const borderStyleOptions = ["solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset", "none"] as const;
type BorderType = typeof borderStyleOptions[number];
export function isValidBorder(border: unknown): border is BorderType {
  return typeof border === 'string' && borderStyleOptions.includes(border as BorderType);
}

export const displayOptions = ["flex", "grid"] as const;
type DisplayType = typeof displayOptions[number];
export function isValidDisplay(display: unknown): display is DisplayType {
  return typeof display === 'string' && displayOptions.includes(display as DisplayType);
}

export const justifyContentOptions = ["flex-start", "center", "flex-end", "space-between", "space-around"] as const;
type JustifyContentType = typeof justifyContentOptions[number];
export function isValidJustifyContent(justifyContent: unknown): justifyContent is JustifyContentType {
  return typeof justifyContent === 'string' && justifyContentOptions.includes(justifyContent as JustifyContentType);
}

export const alignItemsOptions = ["flex-start", "center", "flex-end", "stretch"] as const;
type AlignItemsType = typeof alignItemsOptions[number];
export function isValidAlignItems(alignItems: unknown): alignItems is AlignItemsType {
  return typeof alignItems === 'string' && alignItemsOptions.includes(alignItems as AlignItemsType);
}

const StyleContext = createContext<StyleContextType | undefined>(undefined);
export const useStyleContext = () => {
  const context = useContext(StyleContext);
  if (context === undefined) {
    throw new Error('useStyleContext must be used within a StyleProvider');
  }
  return context;
};

export const StyleProvider: React.FC<{ children: ReactNode, initialStyles?: StyleState }> = ({ children, initialStyles }) => {
  const defaultStyles: StyleState = {
    resetButton: {
      position: "absolute",
      top: "0.3rem",
      left: "0.5rem",
      color: "#F8F8F2",
    },
    closeButton: {
      position: "absolute",
      top: "0.3rem",
      right: "0.5rem",
      color: "#F8F8F2",
    },
    container: {
      position: 'relative',
      backgroundColor: '#282A36',
      color: '#000000',
      borderRadius: '0.5rem',
      borderStyle: 'solid',
      borderColor: '#BD93F9',
      borderWidth: '2px',
      padding: '1rem',
    },
    flag: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem',
      backgroundColor: '#44475A',
      borderRadius: '5px',
      margin: '0.5rem',
      color: '#F8F8F2',
      minWidth: '20rem',
    },
    buttonEnabled: {
      background: '#BD93F9',
      padding: '0.4rem',
      borderRadius: '0.5rem',
      color: '#44475A',
    },
    buttonDisabled: {
      background: '#FF79C6',
      padding: '0.4rem',
      borderRadius: '0.5rem',
      color: '#44475A',
    },
    header: {
      fontWeight: 700,
      color: '#F8F8F2',
      top: '-0.6rem',
      position: 'relative',
      marginRight: '1rem',
      marginLeft: '1.5rem',
      width: '10rem',
    },
  };

  const [styles, setStyles] = useState<StyleState>(initialStyles || defaultStyles);
  const [modifiedStyles, setModifiedStyles] = useState<Set<StyleKey>>(new Set());
  const [resetTimestamps, setResetTimestamps] = useState<{[K in StyleKey]?: number}>({});

  const updateStyle = (key: StyleKey, newStyle: React.CSSProperties) => {
    setStyles(prevStyles => ({
      ...prevStyles,
      [key]: { ...prevStyles[key], ...newStyle },
    }));
    setModifiedStyles(prevModified => new Set(prevModified).add(key));
  };

  const resetStyle = (key: StyleKey) => {
    setStyles(prevStyles => ({
      ...prevStyles,
      [key]: initialStyles ? initialStyles[key] : defaultStyles[key],
    }));
    setModifiedStyles(prevModified => {
      const newModified = new Set(prevModified);
      newModified.delete(key);
      return newModified;
    });
    setResetTimestamps(prev => ({
      ...prev,
      [key]: Date.now(),
    }))
  };

  return (
    <StyleContext.Provider value={{ styles, originalStyles: initialStyles || defaultStyles, modifiedStyles, resetTimestamps, updateStyle, resetStyle }}>
      {children}
    </StyleContext.Provider>
  );
};