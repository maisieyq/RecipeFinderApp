import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing } from '../../theme';
import AppHeader from '../../components/common/AppHeader';

const SupportScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Support"
        variant="profile"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Need help?</Text>
        <Text style={[styles.text, { color: theme.textMuted }]}>
          If you have any issues while using RecipeFinder, our support team is here to help.
        </Text>
        <Text style={[styles.text, { color: theme.textMuted }]}>
          Please contact us through email or app feedback, and we will respond as soon as possible.
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

export default SupportScreen;