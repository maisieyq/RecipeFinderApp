import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, colors, radius } from '../../theme';

// ── Skeleton Card ──────────────────────────────────────────────────
export const SkeletonCard = () => {
  const { theme } = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true, easing: Easing.ease }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true, easing: Easing.ease }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.8] });

  const Box = ({ style }) => (
    <Animated.View style={[{ backgroundColor: theme.border, borderRadius: radius.sm, opacity }, style]} />
  );

  return (
    <View style={[styles.skelCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Box style={styles.skelImage} />
      <View style={styles.skelBody}>
        <Box style={styles.skelTitle} />
        <Box style={[styles.skelTitle, { width: '60%', marginTop: 6 }]} />
        <View style={styles.skelRow}>
          <Box style={styles.skelChip} />
          <Box style={styles.skelChip} />
          <Box style={styles.skelChip} />
        </View>
      </View>
    </View>
  );
};

// ── Loading Spinner ────────────────────────────────────────────────
export const LoadingView = ({ message = 'Finding recipes...' }) => {
  const { theme } = useTheme();
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1200, useNativeDriver: true, easing: Easing.linear })
    ).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.loadingCenter}>
      <Animated.Text style={[styles.spinner, { transform: [{ rotate }] }]}>🍳</Animated.Text>
      <Text style={[styles.loadingMsg, { color: theme.textMuted }]}>{message}</Text>
    </View>
  );
};

// ── Empty State ────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, subtitle, action, actionLabel }) => {
  const { theme } = useTheme();
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -8, duration: 700, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.emptyCenter}>
      <Animated.Text style={[styles.emptyIcon, { transform: [{ translateY: bounce }] }]}>
        {icon || '🥘'}
      </Animated.Text>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      {subtitle && <Text style={[styles.emptySub, { color: theme.textMuted }]}>{subtitle}</Text>}
      {action && (
        <View
          style={[styles.actionBtn, { backgroundColor: colors.orange }]}
        >
          <Text style={styles.actionLabel} onPress={action}>{actionLabel}</Text>
        </View>
      )}
    </View>
  );
};

// ── Error State ────────────────────────────────────────────────────
export const ErrorState = ({ message, onRetry }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.emptyCenter}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>Oops!</Text>
      <Text style={[styles.emptySub, { color: theme.textMuted }]}>
        {message || 'Something went wrong. Please try again.'}
      </Text>
      {onRetry && (
        <View style={[styles.actionBtn, { backgroundColor: colors.red }]}>
          <Text style={styles.actionLabel} onPress={onRetry}>Retry</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Skeleton
  skelCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.base,
    overflow: 'hidden',
    marginHorizontal: spacing.base,
  },
  skelImage: { height: 180 },
  skelBody: { padding: spacing.base },
  skelTitle: { height: 16, borderRadius: 8, width: '80%' },
  skelRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  skelChip: { height: 24, width: 60, borderRadius: radius.round },

  // Loading
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxxl },
  spinner: { fontSize: 48, marginBottom: spacing.base },
  loadingMsg: { fontSize: typography.sizes.base, fontStyle: 'italic' },

  // Empty / Error
  emptyCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxxl },
  emptyIcon: { fontSize: 64, marginBottom: spacing.base },
  errorIcon: { fontSize: 56, marginBottom: spacing.base },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySub: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  actionBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.round,
  },
  actionLabel: {
    color: '#fff',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.base,
  },
});
