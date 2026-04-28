import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getPantry,
  addPantryItem as addPantryToBackend,
  deletePantryItem,
  updatePantryItem,
} from '../services/backendApi';

const PantryContext = createContext(null);

export const PantryProvider = ({ children }) => {
  const [pantryItems, setPantryItems] = useState([]);

  const loadPantry = async () => {
    try {
      const data = await getPantry();
      setPantryItems(data);
    } catch (error) {
      console.log('Load pantry error:', error.message);
    }
  };

  useEffect(() => {
    loadPantry();
  }, []);

  const addPantryItem = async item => {
    try {
      const value = typeof item === 'string' ? item : item.ingredientName;

      if (!value || !value.trim()) return;

      await addPantryToBackend({
        ingredientName: value.trim(),
        quantity: '',
        expiryDate: '',
      });

      await loadPantry();
    } catch (error) {
      console.log('Add pantry error:', error.message);
    }
  };

  const movePantryItem = async (fromIndex, toIndex) => {
    try {
      const updated = [...pantryItems];

      // prevent invalid move
      if (toIndex < 0 || toIndex >= updated.length) return;

      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);

      setPantryItems(updated);

      // OPTIONAL (if you want persist order to backend)
      // await saveNewOrder(updated);

    } catch (error) {
      console.log('Move pantry error:', error.message);
    }
  };


  const removePantryItem = async item => {
    try {
      await deletePantryItem(item.id);
      await loadPantry();
    } catch (error) {
      console.log('Delete pantry error:', error.message);
    }
  };

  const renamePantryItem = async (oldItem, newItem) => {
    try {
      await updatePantryItem(oldItem.id, {
        ingredientName: newItem,
        quantity: oldItem.quantity || '',
        expiryDate: oldItem.expiryDate || '',
      });

      await loadPantry();
    } catch (error) {
      console.log('Update pantry error:', error.message);
    }
  };

  const allItems = useMemo(
    () => pantryItems.map(item => item.ingredientName),
    [pantryItems]
  );

  return (
    <PantryContext.Provider
      value={{
        pantryItems,
        allItems,
        addPantryItem,
        removePantryItem,
        renamePantryItem,
        movePantryItem,
        loadPantry,
      }}
    >
      {children}
    </PantryContext.Provider>
  );
};

export const usePantry = () => {
  const context = useContext(PantryContext);

  if (!context) {
    throw new Error('usePantry must be used within PantryProvider');
  }

  return context;
};