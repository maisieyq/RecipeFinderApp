import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius, colors, shadows } from '../../theme';
import { PANTRY_SHORTCUTS } from '../../data/mockData';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PantryShortcuts = ({ selectedIngredients, onToggle }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const activeCount = PANTRY_SHORTCUTS.filter(p =>
    selectedIngredients.includes(p.name)
  ).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }, shadows.sm]}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={toggle} activeOpacity={0.8}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: colors.orange }]}>
            <Text style={styles.headerIcon}>🥄</Text>
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Pantry Staples</Text>
            <Text style={[styles.headerSub, { color: theme.textMuted }]}>
              {activeCount > 0 ? `${activeCount} selected` : 'Quick-add common ingredients'}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {activeCount > 0 && (
            <View style={[styles.countBadge, { backgroundColor: colors.orange }]}>
              <Text style={styles.countText}>{activeCount}</Text>
            </View>
          )}
          <Animated.Text style={[styles.chevron, { color: theme.textMuted, transform: [{ rotate }] }]}>
            ▼
          </Animated.Text>
        </View>
      </TouchableOpacity>

      {/* Expandable content */}
      {expanded && (
        <View style={[styles.body, { borderTopColor: theme.border }]}>
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            Tap to add to your ingredient list
          </Text>
          <View style={styles.chipGrid}>
            {PANTRY_SHORTCUTS.map(item => {
              const isSelected = selectedIngredients.includes(item.name);
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => onToggle(item.name)}
                  activeOpacity={0.75}
                  style={[
                    styles.pantryChip,
                    {
                      backgroundColor: isSelected ? colors.orange : theme.tag,
                      borderColor: isSelected ? colors.orangeLight : theme.border,
                      borderWidth: isSelected ? 1.5 : 1,
                    },
                  ]}
                >
                  <Text style={styles.pantryEmoji}>{item.emoji}</Text>
                  <Text
                    style={[
                      styles.pantryLabel,
                      {
                        color: isSelected ? '#ffffff' : theme.tagText,
                        fontWeight: isSelected ? '600' : '400',
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: { fontSize: 18 },
  headerTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    fontFamily: 'serif',
  },
  headerSub: { fontSize: typography.sizes.xs, marginTop: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  countBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: { color: '#fff', fontSize: typography.sizes.xs, fontWeight: '700' },
  chevron: { fontSize: 12 },
  body: {
    borderTopWidth: 1,
    padding: spacing.base,
  },
  hint: {
    fontSize: typography.sizes.xs,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  pantryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.round,
    gap: 4,
  },
  pantryEmoji: { fontSize: 15 },
  pantryLabel: { fontSize: typography.sizes.sm },
  checkMark: { fontSize: 11, color: colors.orangeLight, fontWeight: '700' },
});

export default PantryShortcuts;
