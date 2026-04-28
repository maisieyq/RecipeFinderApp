import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing } from '../../theme';
import AppHeader from '../../components/common/AppHeader';

const TermsScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Terms of Use"
        variant="profile"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Terms of Use</Text>
        <Text style={[styles.text, { color: theme.textMuted }]}>
          By using RecipeFinder, you agree to use the app responsibly and for personal, non-commercial purposes only.
        </Text>
        <Text style={[styles.text, { color: theme.textMuted }]}>
          We may update features and content from time to time to improve the overall user experience.
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

export default TermsScreen;