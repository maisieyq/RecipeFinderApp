import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';

import { typography, spacing, radius } from '../../theme';
import { RECIPES } from '../../data/mockData';

import RecipeCard from '../../components/recipe/RecipeCard';
import AppHeader from '../../components/common/AppHeader';
import { confirmClearList } from '../../utils/recipeAlerts';

const FavoritesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { favorites, toggleFavorite } = useFavorites();

  const favRecipes = RECIPES.filter(r => favorites.includes(r.id));

  const clearAll = () => {
    confirmClearList({
      title: 'Clear Favourites',
      message: 'Remove all saved recipes?',
      onConfirm: () => {
        favorites.forEach(id => toggleFavorite(id));
      },
    });
  };

  return (
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
            <View key={recipe.id} style={styles.cardWrap}>
              <RecipeCard
                recipe={recipe}
                variant="horizontal"
                onPress={() => navigation.navigate('RecipeDetail', { recipe })}
              />
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
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: typography.sizes.base,
  },
});

export default FavoritesScreen;