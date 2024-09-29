import React, { createContext, useContext, useState, ReactNode } from 'react';

type StyleKey = 'resetButton' | 'closeButton' | 'container' | 'flag' | 'buttonEnabled' | 'buttonDisabled' | 'header';

type StyleState = {
  [K in StyleKey]: React.CSSProperties;
};

type StyleContextType = {
  styles: StyleState;
  originalStyles: StyleState;
  modifiedStyles: Set<StyleKey>;
  updateStyle: (key: StyleKey, newStyle: React.CSSProperties) => void;
  resetStyle: (key: string) => void;
};

const StyleContext = createContext<StyleContextType | undefined>(undefined);

export const useStyleContext = () => {
  const context = useContext(StyleContext);
  if (context === undefined) {
    throw new Error('useStyleContext must be used within a StyleProvider');
  }
  return context;
};

export const StyleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialStyles: StyleState = {
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
      color: 'black',
      border: '2px solid #BD93F9',
      borderRadius: '0.5rem',
      padding: '1rem',
    },
    flag: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem',
      background: '#44475A',
      borderRadius: '5px',
      margin: '0.5rem 0',
      color: '#F8F8F2',
      minWidth: '20rem',
    },
    buttonEnabled: {
      background: '#BD93F9',
      padding: '0.4rem',
      borderRadius: '0.5rem',
      color: '#44475A',
      fontWeight: 500,
    },
    buttonDisabled: {
      background: '#FF79C6',
      padding: '0.4rem',
      borderRadius: '0.5rem',
      color: '#44475A',
      fontWeight: 500,
    },
    header: {
      fontWeight: 700,
      color: '#F8F8F2',
      top: '-0.6rem',
      position: 'relative',
      marginRight: '1rem',
      marginLeft: '1.5rem',
    },
  };

  const [styles, setStyles] = useState<StyleState>(initialStyles);
  const [modifiedStyles, setModifiedStyles] = useState<Set<StyleKey>>(new Set());

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
      [key]: initialStyles[key],
    }));
    setModifiedStyles(prevModified => {
      const newModified = new Set(prevModified);
      newModified.delete(key);
      return newModified;
    });
  };

  return (
    <StyleContext.Provider value={{ styles, originalStyles: initialStyles, modifiedStyles, updateStyle, resetStyle }}>
      {children}
    </StyleContext.Provider>
  );
};