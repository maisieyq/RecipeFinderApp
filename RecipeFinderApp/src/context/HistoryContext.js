import React, { createContext, useContext, useState } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  const addToHistory = recipeId => {
    setHistory(prev => {
      const filtered = prev.filter(id => id !== recipeId);
      return [recipeId, ...filtered];
    });
  };

  const removeFromHistory = recipeId => {
    setHistory(prev => prev.filter(id => id !== recipeId));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistoryRecipes = () => useContext(HistoryContext);