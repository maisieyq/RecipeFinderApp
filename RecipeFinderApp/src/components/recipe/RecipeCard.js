import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { typography, spacing, radius, shadows, colors } from '../../theme';
import {
  HeartIcon,
  TimeIcon,
  CalorieIcon,
  PeopleIcon,
} from '../icons/commonIcons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.base * 2;

const DifficultyDot = ({ difficulty }) => {
  const colorMap = {
    Easy: colors.green,
    Medium: colors.amber,
    Hard: colors.red,
  };

  return (
    <View
      style={[
        styles.diffDot,
        { backgroundColor: colorMap[difficulty] || colors.green },
      ]}
    >
      <Text style={styles.diffText}>{difficulty}</Text>
    </View>
  );
};

const MetaItem = ({ Icon, value, theme, color, size }) => (
  <View style={styles.metaItem}>
    <Icon color={color || theme.textMuted} size={size} />
    <Text style={[styles.metaText, { color: theme.textMuted }]}>
      {value}
    </Text>
  </View>
);

const RecipeCard = ({
  recipe,
  onPress,
  variant = 'full',
  isFav = false,
  onFavoritePress,
}) => {
  const { theme } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        style={[
          styles.hCard,
          { backgroundColor: theme.card, borderColor: theme.border },
          shadows.sm,
        ]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Image source={{ uri: recipe.image }} style={styles.hImage} />

        <View style={styles.hContent}>
          <Text
            style={[styles.hTitle, { color: theme.text }]}
            numberOfLines={2}
          >
            {recipe.title}
          </Text>

          <View style={styles.metaRow}>
            <MetaItem
              Icon={TimeIcon}
              value={recipe.cookTime}
              theme={theme}
              size={14}
            />

            <View style={styles.hMetaItemSpacing}>
              <MetaItem
                Icon={CalorieIcon}
                value={`${recipe.calories} cal`}
                theme={theme}
                size={10}
              />
            </View>
          </View>

          <View style={styles.tagRow}>
            {(recipe.tags || []).slice(0, 2).map(tag => (
              <View
                key={tag}
                style={[
                  styles.tag,
                  { backgroundColor: theme.tag || '#FFF4ED' },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: theme.tagText || '#FF7A2F' },
                  ]}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={e => {
            e.stopPropagation();
            onFavoritePress?.(recipe);
          }}
          style={styles.favBtn}
          activeOpacity={0.8}
        >
          <HeartIcon
            filled={isFav}
            color={colors.orange}
            size={22}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        shadows.md,
      ]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <View style={styles.imageOverlay} />

        <View style={styles.topLeft}>
          <DifficultyDot difficulty={recipe.difficulty} />
        </View>

        <TouchableOpacity
          style={styles.favOverlay}
          onPress={e => {
            e.stopPropagation();
            onFavoritePress?.(recipe);
          }}
          activeOpacity={0.8}
        >
          <HeartIcon
            filled={isFav}
            color={colors.orange}
            size={24}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.content, { borderTopColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {recipe.title}
        </Text>

        <View style={styles.metaRow}>
          <MetaItem
            Icon={TimeIcon}
            value={recipe.cookTime}
            theme={theme}
            size={14}
          />
          <MetaItem
            Icon={PeopleIcon}
            value={`${recipe.servings} srv`}
            theme={theme}
            size={14}
          />
          <MetaItem
            Icon={CalorieIcon}
            value={`${recipe.calories} cal`}
            theme={theme}
            size={10}
          />
        </View>

        <View style={styles.tagRow}>
          {recipe.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.base,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  topLeft: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  favOverlay: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffDot: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.round,
  },
  diffText: {
    color: '#fff',
    fontSize: typography.sizes.xs,
    fontWeight: '700',
  },
  content: {
    padding: spacing.base,
    borderTopWidth: 1,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: '800',
    marginBottom: spacing.sm,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 13,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: '#FFF4ED',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.round,
  },
  tagText: {
    color: '#FF7A2F',
    fontSize: typography.sizes.xs,
    fontWeight: '600',
  },
  hCard: {
    flexDirection: 'row',
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  hImage: {
    width: 90,
    height: 90,
  },
  hContent: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  hTitle: {
    flex: 1,
    fontSize: typography.sizes.base,
    fontWeight: '500',
    lineHeight: 20,
    marginLeft: 1,
  },
  hMetaItemSpacing: {
    marginLeft: 2,
  },
  favBtn: {
    padding: spacing.sm,
    justifyContent: 'center',
  },
});

export default RecipeCard;