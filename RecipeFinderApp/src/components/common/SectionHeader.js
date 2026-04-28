import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, colors } from '../../theme';

const SectionHeader = ({ title, subtitle, action, actionLabel }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.accent, { backgroundColor: colors.orange }]} />
        <View>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>}
        </View>
      </View>
      {action && (
        <TouchableOpacity onPress={action}>
          <Text style={[styles.action, { color: colors.orange }]}>{actionLabel || 'See all'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.base, marginBottom: spacing.sm, marginTop: spacing.base,
  },
  left:   { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  accent: { width: 4, height: 20, borderRadius: 2 },
  title:  { fontSize: typography.sizes.md, fontWeight: '700' },
  subtitle: { fontSize: typography.sizes.xs, marginTop: 1 },
  action: { fontSize: typography.sizes.sm, fontWeight: '600' },
});

export default SectionHeader;
