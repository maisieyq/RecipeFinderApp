import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius, colors } from '../../theme';

const IngredientChip = ({ ingredient, isSelected, onPress, size = 'md' }) => {
  const { theme } = useTheme();

  const sizeStyles = {
    sm: { paddingH: spacing.sm, paddingV: 4, fontSize: typography.sizes.xs, emojiSize: 14 },
    md: { paddingH: spacing.md, paddingV: 7, fontSize: typography.sizes.sm, emojiSize: 16 },
    lg: { paddingH: spacing.base, paddingV: spacing.sm, fontSize: typography.sizes.base, emojiSize: 18 },
  };
  const s = sizeStyles[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.chip,
        {
          paddingHorizontal: s.paddingH,
          paddingVertical: s.paddingV,
          backgroundColor: isSelected ? colors.warmBrown : theme.tag,
          borderColor: isSelected ? colors.golden : theme.border,
          borderWidth: isSelected ? 1.5 : 1,
        },
      ]}
    >
      <Text style={{ fontSize: s.emojiSize }}>{ingredient.emoji}</Text>
      <Text
        style={[
          styles.label,
          {
            fontSize: s.fontSize,
            color: isSelected ? colors.cream : theme.tagText,
            fontWeight: isSelected ? typography.weights.semibold : typography.weights.regular,
          },
        ]}
      >
        {ingredient.name}
      </Text>
      {isSelected && (
        <View style={styles.checkBadge}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.round,
    gap: 5,
    margin: 3,
  },
  label: { letterSpacing: 0.2 },
  checkBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.golden,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  checkIcon: { fontSize: 9, color: colors.espresso, fontWeight: '700' },
});

export default IngredientChip;
