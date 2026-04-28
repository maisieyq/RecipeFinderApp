import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { usePantry } from '../../context/PantryContext';
import { typography, spacing, radius, colors } from '../../theme';

import {
  searchMealsByName,
  searchMealsByIngredient,
  getMealById,
  normalizeMeal,
} from '../../services/mealDbApi';

import AppHeader from '../../components/common/AppHeader';
import RecipeCard from '../../components/recipe/RecipeCard';
import SearchBar from '../../components/common/SearchBar';
import { EmptyState, SkeletonCard } from '../../components/common/StateComponents';
import { CloseIcon } from '../../components/icons/commonIcons';
import { useAuth } from '../../context/AuthContext';

const SUGGESTED_ITEMS = ['Egg', 'Onion', 'Tomato', 'Potato'];

const PantryScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { pantryItems, addPantryItem, removePantryItem } = usePantry();

  const [input, setInput] = useState('');
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn } = useAuth();

  const requireLogin = (
    message = 'Please login or register first to use this feature.'
  ) => {
    if (isLoggedIn) return true;

    Alert.alert('Login Required', message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Login',
        onPress: () =>
          navigation.getParent()?.navigate('ProfileTab', {
            screen: 'LoginScreen',
          }),
      },
      {
        text: 'Register',
        onPress: () =>
          navigation.getParent()?.navigate('ProfileTab', {
            screen: 'RegisterScreen',
          }),
      },
    ]);

    return false;
  };

  const toggleSelect = itemName => {
    setSelected(prev =>
      prev.includes(itemName)
        ? prev.filter(x => x !== itemName)
        : [...prev, itemName]
    );
  };

  const handleAddPantryItem = () => {
    if (!requireLogin('Please login or register first to add pantry items.')) {
      return;
    }

    const value = input.trim();
    if (!value) return;

    addPantryItem(value);
    setInput('');
  };

  const confirmRemovePantryItem = item => {
    Alert.alert(
      'Remove Ingredient',
      `Remove "${item.ingredientName}" from your pantry?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removePantryItem(item);
            setSelected(prev =>
              prev.filter(i => i !== item.ingredientName)
            );
          },
        },
      ]
    );
  };

  const runSearch = async () => {
  const typed = input.trim();
  const selectedWords = selected.filter(Boolean);

  setSearched(true);
  setIsLoading(true);

  try {
    const searchTerms = [];

    if (typed) {
      searchTerms.push(typed);
    }

    selectedWords.forEach(item => {
      searchTerms.push(item);
    });

    if (searchTerms.length === 0) {
      setResults([]);
      return;
    }

    const apiResults = await Promise.all(
      searchTerms.map(async term => {
        const [nameResults, ingredientResults] = await Promise.all([
          searchMealsByName(term),
          searchMealsByIngredient(term),
        ]);

        return [...nameResults, ...ingredientResults];
      })
    );

    const combinedResults = apiResults.flat();

    const uniqueResults = combinedResults.filter(
      (meal, index, self) =>
        index === self.findIndex(item => item.idMeal === meal.idMeal)
    );

    const detailedRecipes = await Promise.all(
      uniqueResults.map(async meal => {
        const detail = await getMealById(meal.idMeal);
        return normalizeMeal(detail || meal);
      })
    );

    const sortedByMatch = detailedRecipes.sort((a, b) => {
      const aMatch = selectedWords.filter(word =>
        a.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(word.toLowerCase())
        )
      ).length;

      const bMatch = selectedWords.filter(word =>
        b.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(word.toLowerCase())
        )
      ).length;

      return bMatch - aMatch;
    });

    setResults(sortedByMatch);
  } catch (error) {
    console.log('Pantry search API error:', error);
    setResults([]);
  } finally {
    setIsLoading(false);
  }
};

  const clearAll = () => {
    setInput('');
    setSelected([]);
    setResults([]);
    setSearched(false);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Pantry"
        variant="profile"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroWrap}>
          <View
            style={[
              styles.heroCard,
              { backgroundColor: isDark ? '#121212' : '#fff' },
            ]}
          >
            <Text style={styles.heroTitle}>Cook with what you have</Text>
            <Text style={styles.heroSubtitle}>
              Add ingredients or select from pantry.
            </Text>

            <View style={{ marginTop: 12 }}>
              <SearchBar
                value={input}
                onChangeText={setInput}
                onClear={() => setInput('')}
                onSubmit={runSearch}
                placeholder="Recipe or ingredient..."
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Your Pantry
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddPantryItem}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chipRow}>
            {pantryItems.map(item => {
              const itemName = item.ingredientName || '';
              const isActive = selected.includes(itemName);
              const isSuggested = SUGGESTED_ITEMS.includes(itemName);
              const isUserAdded = !isSuggested;

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => toggleSelect(itemName)}
                  onLongPress={() => {
                    if (isUserAdded) {
                      if (
                        !requireLogin(
                          'Please login or register first to manage pantry items.'
                        )
                      ) {
                        return;
                      }

                      confirmRemovePantryItem(item);
                    }
                  }}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isActive ? colors.orange : theme.card,
                      borderColor: isActive ? colors.orange : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: isActive ? '#fff' : theme.textMuted },
                    ]}
                  >
                    {itemName}
                  </Text>

                  {isActive && (
                    <View style={styles.sortClose}>
                      <CloseIcon color="#fff" size={10} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.searchBtn}
            activeOpacity={0.85}
            onPress={runSearch}
          >
            <Text style={styles.searchBtnText}>Find Recipes</Text>
          </TouchableOpacity>

          {(input.trim().length > 0 || selected.length > 0 || searched) && (
            <TouchableOpacity
              style={[styles.clearBtn, { borderColor: theme.border }]}
              activeOpacity={0.85}
              onPress={clearAll}
            >
              <Text style={[styles.clearBtnText, { color: theme.textMuted }]}>
                Clear
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {searched && !isLoading && (
          <View style={styles.resultInfoWrap}>
            <Text style={[styles.resultCount, { color: theme.textMuted }]}>
              {results.length} recipe{results.length !== 1 ? 's' : ''} found
            </Text>
          </View>
        )}

        {searched ? (
          isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : results.length === 0 ? (
            <EmptyState
              icon="🥘"
              title="No Recipes Found"
              subtitle="Try another ingredient or pantry selection."
              action={clearAll}
              actionLabel="Clear Search"
            />
          ) : (
            results.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => navigation.navigate('RecipeDetail', { recipe })}
              />
            ))
          )
        ) : null}

        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  heroWrap: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },

  heroCard: {
    borderRadius: radius.xl,
    paddingTop: 16,
    paddingBottom: 10,
    overflow: 'hidden',
  },

  heroTitle: {
    color: colors.orange,
    fontSize: 18,
    fontWeight: '800',
    paddingHorizontal: spacing.base,
    marginBottom: 4,
    marginLeft: -5,
  },

  heroSubtitle: {
    color: '#8F8F8F',
    fontSize: typography.sizes.sm,
    lineHeight: 20,
    paddingHorizontal: spacing.base,
    marginLeft: -5,
  },

  sectionWrap: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.base,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '800',
    marginTop: -10,
  },

  addBtn: {
    width: 25,
    height: 25,
    borderRadius: 16,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
  },

  addBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: -6,
    marginBottom: spacing.base,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },

  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },

  sortClose: {
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchBtn: {
    backgroundColor: colors.orange,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginBottom: 10,
  },

  searchBtnText: {
    color: '#fff',
    fontSize: typography.sizes.base,
    fontWeight: '700',
  },

  clearBtn: {
    borderWidth: 1,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },

  clearBtnText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
  },

  resultInfoWrap: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.base,
    marginBottom: spacing.sm,
  },

  resultCount: {
    fontSize: typography.sizes.sm,
    fontStyle: 'italic',
  },
});

export default PantryScreen;