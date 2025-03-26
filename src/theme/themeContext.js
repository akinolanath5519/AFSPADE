// src/context/ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeStyles = {
    light: {
      primaryColor: '#4caf50',
      backgroundColor: '#f5f5f5',
      textColor: '#333',
    },
    dark: {
      primaryColor: '#121212',
      backgroundColor: '#000',
      textColor: '#fff',
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, styles: themeStyles[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
