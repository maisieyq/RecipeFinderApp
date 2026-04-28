import { Alert } from 'react-native';

export const confirmRemoveFavourite = ({ id, favorites, setFavorites }) => {
  if (!favorites.includes(id)) {
    setFavorites(prev => [...prev, id]);
    return;
  }

  Alert.alert(
    'Remove Favourite',
    'Are you sure you want to unfavourite this recipe?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setFavorites(prev => prev.filter(f => f !== id));
        },
      },
    ]
  );
};

export const confirmClearList = ({ title, message, onConfirm }) => {
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Clear',
      style: 'destructive',
      onPress: onConfirm,
    },
  ]);
};