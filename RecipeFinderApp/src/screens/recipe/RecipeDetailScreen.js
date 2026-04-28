import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Share,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius, colors, shadows } from '../../theme';
import {
  BackIcon,
  HeartIcon,
  TimeIcon,
  PeopleIcon,
  CalorieIcon,
  CheckIcon,
} from '../../components/icons/commonIcons';
import { useFavorites } from '../../context/FavoritesContext';
import { useHistoryRecipes } from '../../context/HistoryContext';
import { useAuth } from '../../context/AuthContext';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');
const IMAGE_H = 320;

const RecipeDetailScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { recipe } = route.params;

  const { favorites, toggleFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const { addToHistory } = useHistoryRecipes();

  const [activeTab, setActiveTab] = useState('Ingredients');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [servings] = useState(recipe.servings);

  const scrollY = useRef(new Animated.Value(0)).current;
  const favScale = useRef(new Animated.Value(1)).current;

  const nutritionData =
    recipe?.nutrition && Object.keys(recipe.nutrition).length > 0
      ? recipe.nutrition
      : {
          protein: '0g',
          carbs: '0g',
          fat: '0g',
          fiber: '0g',
        };

  useEffect(() => {
    addToHistory(recipe.id);
  }, [recipe]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [IMAGE_H - 100, IMAGE_H - 30],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-120, 0],
    outputRange: [1.18, 1],
    extrapolateRight: 'clamp',
  });

  const diffColor = {
    Easy: colors.green,
    Medium: colors.amber,
    Hard: colors.red,
  };

  const TABS = ['Ingredients', 'Steps', 'Nutrition'];

  const tapFavorite = () => {
    if (!requireLogin('Please login or register first to save favorite recipes.')) {
      return;
    }

    toggleFavorite(recipe.id);

    Animated.sequence([
      Animated.spring(favScale, { toValue: 1.16, useNativeDriver: true }),
      Animated.spring(favScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };
  
  const requireLogin = (
    message = 'Please login or register first to use this feature.'
  ) => {
    if (isLoggedIn) return true;

    Alert.alert(
      'Login Required',
      message,
      [
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
      ]
    );

    return false;
  };

  const toggleStep = idx => {
    setCompletedSteps(prev =>
      prev.includes(idx) ? prev.filter(s => s !== idx) : [...prev, idx]
    );
  };

  const handleShare = async () => {
    await Share.share({
      message: `Check out this recipe: ${recipe.title}\n\nIngredients: ${recipe.ingredients.join(', ')}\n\nCook time: ${recipe.cookTime}`,
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.floatingHeader,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
            opacity: headerOpacity,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIconBtn}
          activeOpacity={0.8}
        >
          <BackIcon color={theme.text} size={22} />
        </TouchableOpacity>

        <Text
          pointerEvents="none"
          style={[styles.floatingTitle, { color: theme.text }]}
          numberOfLines={1}
        >
          {recipe.title}
        </Text>

        <View style={styles.headerRightSpace} />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={styles.heroWrap}>
          <Animated.Image
            source={{ uri: recipe.image }}
            style={[
              styles.heroImage,
              {
                transform: [{ scale: imageScale }],
              },
            ]}
          />

          <View style={styles.heroOverlay} />

          <View style={styles.heroTopBar}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.circleBtnDark}
              activeOpacity={0.8}
            >
              <BackIcon color="#fff" size={20} />
            </TouchableOpacity>

            <View style={styles.heroActionRow}>
              <Animated.View style={{ transform: [{ scale: favScale }] }}>
                <TouchableOpacity
                  onPress={tapFavorite}
                  style={styles.circleBtnLight}
                  activeOpacity={0.8}
                >
                  <HeartIcon
                    filled={favorites.includes(recipe.id)}
                    color={colors.orange}
                    size={22}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>

          <View style={styles.heroBottomInfo}>
            <View
              style={[
                styles.diffBadge,
                { backgroundColor: diffColor[recipe.difficulty] || colors.green },
              ]}
            >
              <Text style={styles.diffText}>{recipe.difficulty}</Text>
            </View>

            <View style={styles.quickMetaRow}>
              <View style={styles.quickMetaChip}>
                <TimeIcon color="#fff" size={13} />
                <Text style={styles.quickMetaText}>{recipe.cookTime}</Text>
              </View>

              <View style={styles.quickMetaChip}>
                <PeopleIcon color="#fff" size={13} />
                <Text style={styles.quickMetaText}>{recipe.servings} servings</Text>
              </View>

              <View style={styles.quickMetaChip}>
                <CalorieIcon color="#fff" size={11} />
                <Text style={styles.quickMetaText}>{recipe.calories} cal</Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.contentCard,
            {
              backgroundColor: theme.background,
              borderTopColor: theme.border,
            },
          ]}
        >
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: theme.text }]}>
              {recipe.title}
            </Text>

            <Text style={[styles.description, { color: theme.textMuted }]}>
              {recipe.description}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagRow}
            >
              {recipe.tags.map(tag => (
                <View
                  key={tag}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.tagText, { color: colors.orange }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.statsRow}>
            <InfoCard
              Icon={TimeIcon}
              label="Cook Time"
              value={recipe.cookTime}
              theme={theme}
            />

            <InfoCard
              Icon={PeopleIcon}
              label="Servings"
              value={`${servings}`}
              theme={theme}
            />

            <InfoCard
              Icon={CalorieIcon}
              label="Calories"
              value={`${recipe.calories}`}
              theme={theme}
              iconSize={11}
            />
          </View>

          <View
            style={[
              styles.tabsWrap,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            {TABS.map(tab => {
              const active = activeTab === tab;

              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tabBtn, active && styles.tabBtnActive]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: active ? '#fff' : theme.textMuted },
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {activeTab === 'Ingredients' && (
            <View style={styles.sectionBlock}>
              <Text style={[styles.sectionNote, { color: theme.textMuted }]}>
                Ingredients for {servings} serving{servings !== 1 ? 's' : ''}
              </Text>

              {recipe.ingredients.map((ing, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.ingCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.ingBulletWrap}>
                    <View style={styles.ingBullet} />
                  </View>
                  <Text style={[styles.ingText, { color: theme.text }]}>
                    {ing}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'Steps' && (
            <View style={styles.sectionBlock}>
              <Text style={[styles.sectionNote, { color: theme.textMuted }]}>
                Tap a step to mark it complete
              </Text>

              {recipe.steps.map((step, idx) => {
                const done = completedSteps.includes(idx);

                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.85}
                    onPress={() => toggleStep(idx)}
                    style={[
                      styles.stepCard,
                      {
                        backgroundColor: done ? '#F2FAF2' : theme.card,
                        borderColor: done ? colors.green : theme.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.stepNum,
                        { backgroundColor: done ? colors.green : colors.orange },
                      ]}
                    >
                      {done ? (
                        <CheckIcon color="#fff" size={14} />
                      ) : (
                        <Text style={styles.stepNumText}>{idx + 1}</Text>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.stepText,
                        {
                          color: done ? theme.textMuted : theme.text,
                          textDecorationLine: done ? 'line-through' : 'none',
                        },
                      ]}
                    >
                      {step}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {activeTab === 'Nutrition' && (
            <View style={styles.sectionBlock}>
              <Text style={[styles.sectionNote, { color: theme.textMuted }]}>
                Per serving
              </Text>

              <View style={styles.nutritionGrid}>
                {Object.entries(nutritionData).map(([key, val]) => (
                  <View
                    key={key}
                    style={[
                      styles.nutriCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text style={styles.nutriVal}>{val}</Text>
                    <Text style={[styles.nutriKey, { color: theme.textMuted }]}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.shareBtn}
                activeOpacity={0.85}
                onPress={handleShare}
              >
                <Text style={styles.shareBtnText}>Share Recipe</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 24 }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const InfoCard = ({ Icon, label, value, theme, iconSize = 14 }) => (
  <View
    style={[
      styles.infoCard,
      {
        backgroundColor: theme.card,
        borderColor: theme.border,
      },
    ]}
  >
    <Icon color={colors.orange} size={iconSize} />
    <Text style={[styles.infoLabel, { color: theme.textMuted }]}>{label}</Text>
    <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 44,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  headerIconBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.sizes.base,
    fontWeight: '700',
  },
  headerRightSpace: {
    width: 40,
  },

  heroWrap: {
    height: IMAGE_H,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width,
    height: IMAGE_H,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,10,4,0.24)',
  },
  heroTopBar: {
    zIndex: 10,
    position: 'absolute',
    top: 46,
    left: spacing.base,
    right: spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleBtnDark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.40)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBtnLight: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroBottomInfo: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
    bottom: 18,
  },
  diffBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.round,
    marginBottom: 12,
  },
  diffText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  quickMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.round,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
  },
  quickMetaText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },

  contentCard: {
    marginTop: -24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    minHeight: 500,
  },

  titleBlock: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    marginBottom: 10,
  },
  description: {
    fontSize: typography.sizes.base,
    lineHeight: 23,
    marginBottom: 14,
  },

  tagRow: {
    paddingRight: 10,
  },
  tag: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.round,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  infoCard: {
    width: '31.5%',
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    ...shadows.sm,
  },
  infoLabel: {
    fontSize: 11,
    marginTop: 6,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },

  tabsWrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radius.round,
    padding: 4,
    marginBottom: spacing.base,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.round,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: colors.orange,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },

  sectionBlock: {
    marginBottom: spacing.base,
  },
  sectionNote: {
    fontSize: typography.sizes.xs,
    fontStyle: 'italic',
    marginBottom: 12,
  },

  ingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },
  ingBulletWrap: {
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  ingBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orange,
  },
  ingText: {
    flex: 1,
    fontSize: typography.sizes.base,
    lineHeight: 21,
  },

  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
  },
  stepNum: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    fontSize: typography.sizes.base,
    lineHeight: 22,
    paddingTop: 2,
  },

  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  nutriCard: {
    width: '48%',
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  nutriVal: {
    color: colors.orange,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  nutriKey: {
    fontSize: 13,
    fontWeight: '600',
  },

  shareBtn: {
    backgroundColor: colors.orange,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  shareBtnText: {
    color: '#fff',
    fontSize: typography.sizes.base,
    fontWeight: '800',
  },
});

export default RecipeDetailScreen;