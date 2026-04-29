import React,{ useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { typography, spacing, radius } from '../../theme';
import { Alert } from 'react-native';
import RecipeCard from '../../components/recipe/RecipeCard';
import AppHeader from '../../components/common/AppHeader';
import { confirmClearList } from '../../utils/recipeAlerts';

const FavoritesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [favRecipes, setFavRecipes] = useState([]);

  useEffect(() => {
  loadFavourites();
}, []);

  const loadFavourites = async () => {
    if (!user?.id) {
      Alert.alert('Login Required', 'Please login first.');
      navigation.navigate('LoginScreen');
      return;
    }

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
      }));

      setFavRecipes(formatted);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Cannot connect to server.');
    }
  };

  const clearAll = () => {
    confirmClearList({
      title: 'Clear Favourites',
      message: 'Remove all saved recipes?',
      onConfirm: async () => {
        try {
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
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
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