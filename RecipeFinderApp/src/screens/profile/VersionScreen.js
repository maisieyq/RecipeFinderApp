import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, colors } from '../../theme';
import AppHeader from '../../components/common/AppHeader';

const VersionScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Version"
        variant="profile"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>RecipeFinder v1.0.0</Text>
        <Text style={[styles.text, { color: theme.textMuted }]}>
          You are currently using the latest version of the app.
        </Text>
        <Text style={[styles.text, { color: theme.textMuted }]}>
          Future updates may include performance improvements, bug fixes, and new recipe features.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.base },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    marginBottom: 10,
  },
  text: {
    fontSize: typography.sizes.base,
    lineHeight: 24,
    marginBottom: 10,
  },
});

export default VersionScreen;