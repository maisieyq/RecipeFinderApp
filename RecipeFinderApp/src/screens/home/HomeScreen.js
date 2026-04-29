import React, { useEffect, useState } from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,StatusBar,Image,Platform,} from 'react-native';
import { SkeletonCard } from '../../components/common/StateComponents';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius, colors, shadows } from '../../theme';
import { searchMealsByName, getMealById, normalizeMeal } from '../../services/mealDbApi';
import {ThemeIcon,SunIcon,} from '../../components/icons/HomeScreenIcons';
import {SearchIcon,TimeIcon,PeopleIcon,CalorieIcon,StarIcon,} from '../../components/icons/commonIcons';

const CATEGORIES = ['All', 'Chicken', 'Beef', 'Seafood', 'Vegetarian', 'Dessert'];

const CategoryChip = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.categoryChip, active && styles.categoryChipActive]}
  >
    <Text
      style={[
        styles.categoryChipText,
        active && styles.categoryChipTextActive,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Easy':
      return '#59C152'; // green
    case 'Medium':
      return '#FFA726'; // orange
    case 'Hard':
      return '#EF5350'; // red
    default:
      return '#9E9E9E'; // gray
  }
};

const FeaturedRecipeCard = ({ recipe, onPress, theme }) => (
  <TouchableOpacity
    style={[styles.featuredCard, { backgroundColor: theme.card }]}
    activeOpacity={0.88}
    onPress={onPress}
  >
    <View style={styles.featuredImageWrap}>
      <Image source={{ uri: recipe.image }} style={styles.featuredImage} />
      <View style={styles.featuredOverlay} />

      <View style={[ styles.difficultyBadge, { backgroundColor: getDifficultyColor(recipe.difficulty) }]}>
        <Text style={styles.difficultyBadgeText}>{recipe.difficulty}</Text>
      </View>
    </View>

    <View style={styles.featuredBody}>
      <Text style={[styles.featuredTitle, { color: theme.text }]} numberOfLines={2}>
        {recipe.title}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <TimeIcon color={theme.textMuted} size={13} />
          <Text style={[styles.metaValue, { color: theme.textMuted }]}>
            {recipe.cookTime}
          </Text>
        </View>

        <View style={styles.metaChip}>
          <PeopleIcon color={theme.textMuted} size={13} />
          <Text style={[styles.metaValue, { color: theme.textMuted }]}>
            {recipe.servings} srv
          </Text>
        </View>

        <View style={styles.metaChip}>
          <CalorieIcon color={theme.textMuted} size={11} />
          <Text style={[styles.metaValue, { color: theme.textMuted }]}>
            {recipe.calories} cal
          </Text>
        </View>
      </View>

      <View style={styles.tagRow}>
        {recipe.tags.slice(0, 3).map(tag => (
          <View key={tag} style={styles.tagPill}>
            <Text style={styles.tagPillText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');

  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFeatured();
  }, [activeCategory]);

  const loadFeatured = async () => {
    setIsLoading(true);

    try {
      const keyword =
        activeCategory === 'All'
          ? ''
          : activeCategory.toLowerCase();

      const meals = await searchMealsByName(keyword);

      const detailed = await Promise.all(
        meals.slice(0, 6).map(async meal => {
          const detail = await getMealById(meal.idMeal);
          return normalizeMeal(detail || meal);
        })
      );

      setFeaturedRecipes(detailed);
    } catch (error) {
      console.log('Home API error:', error);
      setFeaturedRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background ?? '#FAFAFA' }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome!</Text>
            <Text style={[styles.logoText, { color: colors.orange }]}>
              RecipeFinder
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() =>
                navigation.getParent()?.navigate('SearchTab', {
                  screen: 'SearchMain',
                })
              }
              activeOpacity={0.8}
            >
              <SearchIcon color={theme.textMuted} size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.headerBtn, styles.headerBtnActive]}
              onPress={toggleTheme}
              activeOpacity={0.8}
            >
              {isDark ? (
                <SunIcon color="#9A9A9A" size={20} />
              ) : (
                <ThemeIcon color="#9A9A9A" size={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroBanner}>
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />

          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <StarIcon size={12} color="#fff" />
              <Text style={styles.heroBadgeText}> QUICK COOK</Text>
            </View>

            <Text style={styles.heroTitle}>
              Meals ready{'\n'}in 15 minutes
            </Text>

            <Text style={styles.heroSubtitle}>
              Fast, delicious recipes when you're short on time.
            </Text>

            <TouchableOpacity
              style={styles.heroBtn}
              activeOpacity={0.85}
              onPress={() => {
                navigation.getParent()?.navigate('SearchTab', {
                screen: 'SearchMain',
                params: { query: 'sandwich', fromHome: true },
              });
              // Clear params right after so they don't persist
              setTimeout(() => {
                navigation.getParent()?.navigate('SearchTab', {
                  screen: 'SearchMain',
                  params: { query: null, fromHome: null },
                });
              }, 1000);
                          }}
            >
              <Text style={styles.heroBtnText}>Explore Now →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.pantryCard}
          activeOpacity={0.85}
          onPress={() =>
            navigation.getParent()?.navigate('PantryTab', {
              screen: 'Pantry',
            })
          }
        >
          <View style={styles.pantryLeft}>
            <View style={styles.pantryText}>
              <Text style={styles.pantryTitle}>Cook from your Pantry</Text>
              <Text style={styles.pantrySub}>Pick ingredients you already have</Text>
            </View>
          </View>
          <View style={styles.pantryArrowBox}>
            <Text style={styles.pantryArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Browse by Category
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {CATEGORIES.map(cat => (
            <CategoryChip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
            />
          ))}
        </ScrollView>

        <View style={styles.sectionHeadRow}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Featured Recipes
            </Text>
            <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
              Hand-picked for you
            </Text>
          </View>

          <TouchableOpacity
            style={styles.viewAllBtn}
            activeOpacity={0.8}
            onPress={() =>
              navigation.getParent()?.navigate('SearchTab', {
                screen: 'SearchMain',
                params: {
                  query: activeCategory === 'All' ? '' : activeCategory,
                },
              })
            }
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}
        >
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            featuredRecipes.map(recipe => (
              <FeaturedRecipeCard
                key={recipe.id}
                recipe={recipe}
                theme={theme}
                onPress={() =>
                  navigation.navigate('RecipeDetail', { recipe })
                }
              />
            ))
          )}
        </ScrollView>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // header
  content: {
    paddingTop: Platform.OS === 'android' ? 48 : 56,
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 13,
    color: '#9A9A9A',
    fontWeight: '500',
    marginBottom: 2,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerBtn: {
    width: 30,
    height: 30,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // hero
  heroBanner: {
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 28,
    backgroundColor: '#fa7a43',
    overflow: 'hidden',
    minHeight: 260,
  },
  heroCircle1: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -35,
    right: -25,
  },
  heroCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -10,
    right: 40,
  },
  heroContent: {
    padding: 24,
    justifyContent: 'center',
    flex: 1,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.28)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 15,
    marginLeft: -3,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 31,
    marginBottom: 5,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: '80%',
  },
  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginLeft: -3,
  },
  heroBtnText: {
    color: '#FF7A2F',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: -3,
  },


  // 2nd card: Pantry
  pantryCard: {
    marginHorizontal: 20,
    marginBottom: 18,
    backgroundColor: '#FFF4ED',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pantryLeft: {
    flex: 1,
  },
  pantryText: {
    gap: 4,
  },
  pantryTitle: {
    color: '#FF7A2F',
    fontSize: 15,
    fontWeight: '700',
  },
  pantrySub: {
    color: '#8F8F8F',
    fontSize: 12,
  },
  pantryArrowBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FF7A2F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pantryArrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: -9,
  },


  sectionHead: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionHeadRow: {
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 13,
  },

  viewAllBtn: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  viewAllText: {
    color: '#8F8F8F',
    fontSize: 13,
    fontWeight: '700',
  },

  chipsRow: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    gap: 10,
  },
  categoryChip: {
    backgroundColor: '#F3F3F3',
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  categoryChipActive: {
    backgroundColor: '#FF7A2F',
  },
  categoryChipText: {
    color: '#8F8F8F',
    fontWeight: '600',
    fontSize: 13,
  },
  categoryChipTextActive: {
    color: '#fff',
  },

  cardsRow: {
    paddingLeft: 20,
    paddingRight: 28,
    gap: 14,
  },
  featuredCard: {
    width: 250,
    borderRadius: 22,
    overflow: 'hidden',
    ...shadows.md,
    marginBottom: 10,
  },
  featuredImageWrap: {
    height: 160,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#59C152',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  difficultyBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  featuredBody: {
    padding: 14,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 10,
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '500',
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    backgroundColor: '#FFF4ED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  tagPillText: {
    color: '#FF7A2F',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default HomeScreen;