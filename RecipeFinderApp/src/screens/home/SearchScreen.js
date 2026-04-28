import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius, colors, shadows } from '../../theme';


import { usePantry } from '../../context/PantryContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useHistoryRecipes } from '../../context/HistoryContext';
import {
  searchMealsByName,
  searchMealsByIngredient,
  getMealById,
  normalizeMeal,
} from '../../services/mealDbApi';

import RecipeCard from '../../components/recipe/RecipeCard';
import SearchBar from '../../components/common/SearchBar';
import { EmptyState, SkeletonCard } from '../../components/common/StateComponents';
import AppHeader from '../../components/common/AppHeader';
import {
  FilterIcon,
  CloseIcon,
  MenuIcon,
} from '../../components/icons/commonIcons';

const { width } = Dimensions.get('window');

const MEAL_OPTIONS = ['Breakfast', 'Lunch', 'Dinner'];
const SORT_OPTIONS = ['Quickest', 'Calories'];
const DRAWER_WIDTH = width * 0.84;

const SearchScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const { pantryItems } = usePantry();
  const { favorites } = useFavorites();
  const { history, addToHistory } = useHistoryRecipes();
  const incoming = route?.params || {};

  const [searchText, setSearchText] = useState(incoming.fromHome ? incoming.query || '' : '');
  const [mealFilter, setMealFilter] = useState(null);
  const [sortFilter, setSortFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const drawerTranslateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;

useEffect(() => {
    if (!searchText.trim()) return;
    const timer = setTimeout(() => {
      runSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

const groupedRecipes = useMemo(() => {
  const sorted = [...results].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

    const groups = {};

    sorted.forEach(recipe => {
      const letter = recipe.title.charAt(0).toUpperCase();

      if (!groups[letter]) {
        groups[letter] = [];
      }

      groups[letter].push(recipe);
    });

    return groups;
  }, [results]);

  const openDrawer = () => {
    setDrawerOpen(true);

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(drawerTranslateX, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(drawerTranslateX, {
        toValue: DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setDrawerOpen(false));
  };

  const goToRecipeFromDrawer = recipe => {
    closeDrawer();

    setTimeout(() => {
      navigation.navigate('RecipeDetail', { recipe });
    }, 180);
  };

  const getRecipeMatchedPantryItems = recipe => {
  if (!recipe?.ingredients || pantryItems.length === 0) {
    return [];
  }

  return pantryItems.filter(pantryItem => {
  const pantryName = pantryItem.ingredientName || pantryItem.name || pantryItem.ingredient || pantryItem;

  return recipe.ingredients?.some(ingredient =>
    String(ingredient || '')
      .toLowerCase()
      .includes(String(pantryName || '').toLowerCase())
  );
});
};

const goToRecipeDetail = recipe => {
  addToHistory(recipe.id);
  navigation.navigate('RecipeDetail', { recipe });
};

const getRecommendationResults = async () => {
  try {
    const keyword =
      pantryItems.length > 0
        ? pantryItems[0].ingredientName || pantryItems[0]
        : 'chicken';

    const meals = await searchMealsByName(keyword);

    const detailed = await Promise.all(
      meals.slice(0, 8).map(async meal => {
        const detail = await getMealById(meal.idMeal);
        return normalizeMeal(detail || meal);
      })
    );

    return detailed;
  } catch (error) {
    console.log('Recommendation error:', error);
    return [];
  }
};

  const runSearch = async () => {
  const keyword = searchText.trim();

  if (!keyword) {
    const rec = await getRecommendationResults();
    setResults(rec);
  }

  setIsLoading(true);

  try {
    const [nameResults, ingredientResults] = await Promise.all([
      searchMealsByName(keyword),
      searchMealsByIngredient(keyword),
    ]);

    const combinedResults = [...nameResults, ...ingredientResults];

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

    const sortedByPantryMatch = detailedRecipes.sort((a, b) => {
      const aMatch = getRecipeMatchedPantryItems(a).length;
      const bMatch = getRecipeMatchedPantryItems(b).length;

      return bMatch - aMatch;
    });

    setResults(sortedByPantryMatch);
  } catch (error) {
    console.log('Search API error:', error);

    const q = keyword.toLowerCase();

    setResults([]);
  } finally {
    setIsLoading(false);
    fadeIn.setValue(0);

    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }
};

  const hasSearch = searchText.trim().length > 0;

  const filteredResults = [...results]
  .filter(recipe => {
    if (!mealFilter) return true;

    return recipe.tags.some(
      tag => tag.toLowerCase() === mealFilter.toLowerCase()
    );
  })
  .sort((a, b) => {
    if (!sortFilter) {
      return (
        getRecipeMatchedPantryItems(b).length -
        getRecipeMatchedPantryItems(a).length
      );
    }

    if (sortFilter === 'Quickest') {
      const aTime = parseInt(a.cookTime) || 999;
      const bTime = parseInt(b.cookTime) || 999;
      return aTime - bTime;
    }

    if (sortFilter === 'Calories') {
      return (a.calories || 0) - (b.calories || 0);
    }

    return 0;
  });

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Search"
        variant="profile"
        showBack
        onBack={() => navigation.goBack()}
        rightIcon={<MenuIcon color={theme.text} size={22} />}
        onRightPress={openDrawer}
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
            <Text style={styles.heroTitle}>Find recipes your way</Text>
            <Text style={styles.heroSubtitle}>
              Search by recipe name or ingredient. Recipes with pantry matches are shown first.
            </Text>

            <View style={{ marginTop: 12 }}>
              <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                onClear={() => {
                  setSearchText('');
                  setMealFilter(null);
                  setSortFilter(null);
                }}
                onSubmit={runSearch}
                placeholder="Recipe or ingredient..."
              />
            </View>
          </View>
        </View>

        {hasSearch && (
          <View style={styles.sectionWrap}>
            <View style={styles.filterHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Sort Results
              </Text>

              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor:
                      mealFilter || sortFilter ? colors.orange : theme.card,
                    borderColor:
                      mealFilter || sortFilter ? colors.orange : theme.border,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => setShowFilters(prev => !prev)}
              >
                <FilterIcon
                  color={mealFilter || sortFilter ? '#fff' : colors.orange}
                  size={16}
                />
                <Text
                  style={[
                    styles.filterBtnText,
                    { color: mealFilter || sortFilter ? '#fff' : theme.text },
                  ]}
                >
                  Filter
                </Text>
              </TouchableOpacity>
            </View>

            {showFilters && (
              <View
                style={[
                  styles.filterPanel,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.filterGroupTitle, { color: theme.text }]}>
                  Meal Type
                </Text>

                <View style={styles.filterRow}>
                  {MEAL_OPTIONS.map(opt => {
                    const isActive = mealFilter === opt;

                    return (
                      <TouchableOpacity
                        key={opt}
                        activeOpacity={0.8}
                        onPress={() => setMealFilter(isActive ? null : opt)}
                        style={[
                          styles.sortBtn,
                          {
                            backgroundColor: isActive ? colors.orange : theme.card,
                            borderColor: isActive ? colors.orange : theme.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.sortText,
                            { color: isActive ? '#fff' : theme.textMuted },
                          ]}
                        >
                          {opt}
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

                <Text style={[styles.filterGroupTitle, { color: theme.text }]}>
                  Sort By
                </Text>

                <View style={styles.filterRow}>
                  {SORT_OPTIONS.map(opt => {
                    const isActive = sortFilter === opt;

                    return (
                      <TouchableOpacity
                        key={opt}
                        activeOpacity={0.8}
                        onPress={() => setSortFilter(isActive ? null : opt)}
                        style={[
                          styles.sortBtn,
                          {
                            backgroundColor: isActive ? colors.orange : theme.card,
                            borderColor: isActive ? colors.orange : theme.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.sortText,
                            { color: isActive ? '#fff' : theme.textMuted },
                          ]}
                        >
                          {opt}
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
              </View>
            )}
          </View>
        )}

        {!isLoading && filteredResults.length > 0 && (
  <View style={styles.resultInfoWrap}>
    <Text style={[styles.resultCount, { color: theme.textMuted }]}>
      {hasSearch
        ? `${filteredResults.length} recipe${filteredResults.length !== 1 ? 's' : ''} found`
        : 'Recommended recipes based on pantry, favorites, and history'}
    </Text>
  </View>
)}

        {hasSearch || filteredResults.length > 0 ? (
  isLoading ? (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  ) : filteredResults.length === 0 ? (
    <EmptyState
      icon="🥘"
      title="No Recipes Found"
      subtitle="Try another keyword or ingredient."
      action={() => {
        setSearchText('');
        setMealFilter(null);
        setSortFilter(null);
      }}
      actionLabel="Clear Search"
    />
  ) : (
    <Animated.View style={{ opacity: fadeIn }}>
      {filteredResults.map(recipe => {
        const matchedItems = getRecipeMatchedPantryItems(recipe);

        return (
          <View key={recipe.id}>
            <RecipeCard
              recipe={recipe}
              onPress={() => goToRecipeDetail(recipe)}
            />

            {matchedItems.length > 0 && (
              <View
                style={[
                  styles.matchBox,
                  {
                    backgroundColor: isDark ? '#1C1C1C' : '#FFF3EC',
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={styles.matchTitle}>Pantry Match</Text>
                <Text style={[styles.matchText, { color: theme.textMuted }]}>
                  {matchedItems.join(', ')}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </Animated.View>
  )
) : null}

        <View style={{ height: 90 }} />
      </ScrollView>

      {drawerOpen && (
        <View style={styles.drawerRoot} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.drawerOverlay,
              {
                opacity: overlayOpacity,
              },
            ]}
          >
            <Pressable style={{ flex: 1 }} onPress={closeDrawer} />
          </Animated.View>

          <Animated.View
            style={[
              styles.drawerPanel,
              {
                backgroundColor: isDark ? '#121212' : '#FAFAFA',
                borderLeftColor: theme.border,
                transform: [{ translateX: drawerTranslateX }],
              },
            ]}
          >
            <View
              style={[
                styles.drawerHeader,
                { borderBottomColor: theme.border },
              ]}
            >
              <View>
                <Text style={styles.drawerTitle}>All Recipes</Text>
                <Text style={[styles.drawerSub, { color: theme.textMuted }]}>
                  Alphabetical order
                </Text>
              </View>

              <TouchableOpacity
                onPress={closeDrawer}
                style={[
                  styles.drawerCloseBtn,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
                activeOpacity={0.8}
              >
                <CloseIcon color={theme.text} size={14} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.drawerList}
            >
              {Object.keys(groupedRecipes).map(letter => (
                <View key={letter} style={styles.alphaSection}>
                  <Text style={styles.alphaHeader}>{letter}</Text>
                  <View style={[styles.alphaDivider, { backgroundColor: theme.border }]} />

                  {groupedRecipes[letter].map(recipe => (
                    <TouchableOpacity
                      key={recipe.id}
                      style={[
                        styles.drawerItem,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                        },
                      ]}
                      activeOpacity={0.88}
                      onPress={() => goToRecipeFromDrawer(recipe)}
                    >
                      <View style={styles.cardAccent} />

                      <Image
                        source={{ uri: recipe.image }}
                        style={styles.drawerThumb}
                      />

                      <View style={styles.drawerTextWrap}>
                        <Text
                          style={[styles.drawerItemTitle, { color: theme.text }]}
                          numberOfLines={1}
                        >
                          {recipe.title}
                        </Text>

                        <Text
                          style={[styles.drawerItemMeta, { color: theme.textMuted }]}
                          numberOfLines={1}
                        >
                          {recipe.cookTime} · {recipe.calories} cal
                        </Text>

                        <View style={styles.drawerTagRow}>
                          {recipe.tags.slice(0, 2).map(tag => (
                            <View
                              key={tag}
                              style={[
                                styles.drawerTag,
                                { backgroundColor: isDark ? '#1C1C1C' : '#FFF3EC' },
                              ]}
                            >
                              <Text style={styles.drawerTagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}

              <View style={{ height: 24 }} />
            </ScrollView>
          </Animated.View>
        </View>
      )}
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
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '800',
    marginBottom: 2,
  },

  filterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.round,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },

  filterPanel: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.sm,
  },
  filterGroupTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 6,
    marginLeft: 5,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: 10,
  },

  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    marginBottom: -6,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '500',
  },
  sortClose: {
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
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
  matchBox: {
  marginHorizontal: spacing.base,
  marginTop: -8,
  marginBottom: spacing.base,
  borderWidth: 1,
  borderRadius: radius.lg,
  paddingHorizontal: spacing.base,
  paddingVertical: spacing.sm,
},
matchTitle: {
  color: colors.orange,
  fontSize: 13,
  fontWeight: '800',
  marginBottom: 3,
},
matchText: {
  fontSize: 13,
  lineHeight: 18,
},

  drawerRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    flexDirection: 'row',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  drawerPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    borderLeftWidth: 1,
    paddingTop: 56,
  },
  drawerHeader: {
    paddingHorizontal: spacing.base,
    paddingBottom: 14,
    marginBottom: 8,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  drawerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.orange,
    marginBottom: 6,
  },
  drawerSub: {
    fontSize: 13,
  },
  drawerCloseBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  drawerList: {
    paddingHorizontal: spacing.base,
    paddingBottom: 30,
  },

  alphaSection: {
    marginBottom: 8,
  },
  alphaHeader: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 10,
    marginBottom: 6,
    letterSpacing: 1.4,
    color: colors.orange,
  },
  alphaDivider: {
    height: 1,
    marginBottom: 12,
  },

  drawerItem: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: colors.orange,
  },
  drawerThumb: {
    width: 62,
    height: 62,
    borderRadius: 16,
    marginLeft: 4,
    marginRight: 12,
  },
  drawerTextWrap: {
    flex: 1,
  },
  drawerItemTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  drawerItemMeta: {
    fontSize: 13,
    marginBottom: 8,
  },
  drawerTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  drawerTag: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.round,
    marginRight: 6,
    marginBottom: 4,
  },
  drawerTagText: {
    color: colors.orange,
    fontSize: 11,
    fontWeight: '700',
  },
});

export default SearchScreen;
