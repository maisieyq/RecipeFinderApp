import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius, colors, typography } from '../../theme';
import AppHeader from '../../components/common/AppHeader';

const GuestProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppHeader title="Profile" variant="profile" />

      <View style={styles.content}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            You are not logged in
          </Text>

          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Login or register to access your profile, favourites, history, and settings.
          </Text>

          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.primaryBtnText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            <Text style={styles.secondaryBtnText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.base,
    justifyContent: 'center',
  },
  card: {
    borderWidth: 1.5,
    borderRadius: radius.xl,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.orange,
    borderRadius: radius.round,
    alignItems: 'center',
    paddingVertical: 13,
    marginBottom: 10,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: typography.sizes.base,
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: colors.orange,
    borderRadius: radius.round,
    alignItems: 'center',
    paddingVertical: 13,
  },
  secondaryBtnText: {
    color: colors.orange,
    fontSize: typography.sizes.base,
    fontWeight: '700',
  },
});

export default GuestProfileScreen;