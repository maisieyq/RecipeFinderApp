import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { typography, spacing, radius } from '../../theme';
import RecipeCard from '../../components/recipe/RecipeCard';
import AppHeader from '../../components/common/AppHeader';
import { confirmClearList } from '../../utils/recipeAlerts';

const FavoritesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [favRecipes, setFavRecipes] = useState([]);

  const swipeRefs = useRef({});
  const openRow = useRef(null);

  useFocusEffect(
    useCallback(() => {
      loadFavourites();
    }, [user?.id])
  );

  const loadFavourites = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`http://10.0.2.2:3000/favourites/${user.id}`);
      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.error || 'Failed to load favourites.');
        return;
      }

      const formatted = data.map(item => ({
        id: item.recipeId,
        title: item.recipeTitle,
        image: item.recipeImage,
        favouriteId: item.id,
        cookTime: item.cookTime,
        servings: item.servings,
        calories: item.calories,
        difficulty: item.difficulty,
        tags: [],
      }));

      setFavRecipes(formatted);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Cannot connect to server.');
    }
  };

  const closeAllRows = () => {
    Object.values(swipeRefs.current).forEach(ref => {
      if (ref?.close) ref.close();
    });
    openRow.current = null;
  };

  const handleSwipeOpen = id => {
    if (openRow.current && openRow.current !== id) {
      swipeRefs.current[openRow.current]?.close?.();
    }
    openRow.current = id;
  };

  const handleRemove = recipe => {
    Alert.alert('Remove Favourite', 'Remove this recipe from favourites?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            closeAllRows();

            await fetch(`http://10.0.2.2:3000/favourites/${recipe.favouriteId}`, {
              method: 'DELETE',
            });

            setFavRecipes(prev =>
              prev.filter(item => item.favouriteId !== recipe.favouriteId)
            );
          } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Cannot remove favourite.');
          }
        },
      },
    ]);
  };

  const clearAll = () => {
    confirmClearList({
      title: 'Clear Favourites',
      message: 'Remove all saved recipes?',
      onConfirm: async () => {
        try {
          closeAllRows();

          for (const recipe of favRecipes) {
            await fetch(`http://10.0.2.2:3000/favourites/${recipe.favouriteId}`, {
              method: 'DELETE',
            });
          }

          setFavRecipes([]);
        } catch (error) {
          Alert.alert('Error', 'Cannot clear favourites.');
        }
      },
    });
  };

  const renderRightActions = recipe => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => handleRemove(recipe)}
      style={styles.deleteAction}
    >
      <Text style={styles.deleteText}>Remove</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={closeAllRows}>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <AppHeader
          title="Favourite"
          variant="profile"
          showBack
          onBack={() => navigation.goBack()}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScrollBeginDrag={closeAllRows}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sectionBlock}>
            <View style={styles.sectionTopRow}>
              <Text style={[styles.sectionSmallText, { color: theme.textMuted }]}>
                {favRecipes.length} saved recipe{favRecipes.length > 1 ? 's' : ''}
              </Text>

              <TouchableOpacity
                onPress={clearAll}
                activeOpacity={0.8}
                style={styles.clearBtn}
              >
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {favRecipes.map(recipe => (
              <View key={recipe.favouriteId} style={styles.cardWrap}>
                <Swipeable
                  ref={ref => {
                    if (ref) swipeRefs.current[recipe.favouriteId] = ref;
                  }}
                  overshootRight={false}
                  onSwipeableOpen={() => handleSwipeOpen(recipe.favouriteId)}
                  renderRightActions={() => renderRightActions(recipe)}
                >
                  <RecipeCard
                    recipe={recipe}
                    variant="horizontal"
                    showFavorite={false}
                    onPress={() => {
                      closeAllRows();
                      navigation.navigate('RecipeDetail', { recipeId: recipe.id });
                    }}
                  />
                </Swipeable>
              </View>
            ))}

            {favRecipes.length === 0 && (
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                No favourite recipes yet.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionBlock: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  sectionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionSmallText: {
    fontSize: typography.sizes.sm,
    marginBottom: 7,
  },
  clearBtn: {
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.round,
    marginBottom: 7,
  },
  clearText: {
    color: '#6B6B6B',
    fontSize: typography.sizes.sm,
    fontWeight: '700',
  },
  cardWrap: {
    marginBottom: 7,
    overflow: 'hidden',
    borderRadius: radius.md,
  },
  deleteAction: {
    width: 92,
    height: '100%',
    backgroundColor: '#FF6B3D',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: radius.md,
    borderBottomRightRadius: radius.md,
    marginBottom: spacing.sm,
  },
  deleteText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: typography.sizes.base,
  },
});

export default FavoritesScreen;