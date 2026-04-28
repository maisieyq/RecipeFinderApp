import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing } from '../../theme';
import AppHeader from '../../components/common/AppHeader';

const PrivacyScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Privacy Policy"
        variant="profile"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Privacy Policy</Text>
        <Text style={[styles.text, { color: theme.textMuted }]}>
          We value your privacy and only collect the information needed to provide and improve app features.
        </Text>
        <Text style={[styles.text, { color: theme.textMuted }]}>
          Your personal data will be handled carefully and will not be shared without your permission.
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

export default PrivacyScreen;