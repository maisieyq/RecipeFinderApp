import React from 'react';
import {
  View,
  ScrollView,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius, colors } from '../../theme';
import AppHeader from '../../components/common/AppHeader';
import {
  LockIcon,
  SupportIcon,
  TermsIcon,
  PrivacyIcon,
  VersionIcon,
} from '../../components/icons/settingIcons';
import { SunIcon, ThemeIcon }        from '../../components/icons/HomeScreenIcons';
import { ChevronRightIcon } from '../../components/icons/ProfileMenuIcons';

const SettingsScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const rows = [
    {
      label: isDark ? 'Light Mode' : 'Dark Mode',
      type: 'switch',
      value: isDark,
      action: toggleTheme,
      icon: isDark
        ? <SunIcon color="#FF7A2F" size={20} />
        : <ThemeIcon color="#FF7A2F" size={20} />,
    },
    {
      label: 'Change Password',
      type: 'link',
      screen: 'ChangePasswordScreen',
      icon: <LockIcon />,
    },
    {
      label: 'Support',
      type: 'link',
      screen: 'SupportScreen',
      icon: <SupportIcon />,
    },
    {
      label: 'Terms of Use',
      type: 'link',
      screen: 'TermsScreen',
      icon: <TermsIcon />,
    },
    {
      label: 'Privacy Policy',
      type: 'link',
      screen: 'PrivacyScreen',
      icon: <PrivacyIcon />,
    },
    {
      label: 'Version',
      type: 'link',
      screen: 'VersionScreen',
      icon: <VersionIcon />,
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Setting"
        variant="profile"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionBlock}>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            {rows.map((row, index) => (
              <TouchableOpacity
                key={row.label}
                activeOpacity={row.type === 'link' ? 0.8 : 1}
                onPress={() => row.type === 'link' && navigation.navigate(row.screen)}
                style={[
                  styles.row,
                  { borderBottomColor: theme.border },
                  index === rows.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.left}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: 'transparent',
                      },
                    ]}
                  >
                    {row.icon}
                  </View>
                  <Text style={[styles.label, { color: theme.text }]}>{row.label}</Text>
                </View>

                {row.type === 'switch' ? (
                  <Switch
                    value={row.value}
                    onValueChange={row.action}
                    trackColor={{ false: '#E0E0E0', true: colors.orange }}
                    thumbColor="#fff"
                  />
                ) : (
                  <ChevronRightIcon color={theme.textMuted} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionBlock: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  row: {
    minHeight: 64,
    borderBottomWidth: 1,
    paddingHorizontal: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.sizes.base,
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default SettingsScreen;