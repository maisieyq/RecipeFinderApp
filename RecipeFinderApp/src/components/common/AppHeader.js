import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme';
import { BackIcon } from '../icons/commonIcons';

const AppHeader = ({
  title,
  showBack = false,
  onBack,
  variant = 'profile',
  rightIcon = null,
  onRightPress = null,
}) => {
  const { theme, isDark } = useTheme();

  if (variant === 'profile') {
    return (
      <>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />

        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.headerRow}>
            <View style={styles.sideBox}>
              {showBack ? (
                <TouchableOpacity
                  onPress={onBack}
                  style={styles.iconBtn}
                  activeOpacity={0.8}
                >
                  <BackIcon color={theme.text} size={22} />
                </TouchableOpacity>
              ) : (
                <View style={styles.iconPlaceholder} />
              )}
            </View>

            <View style={styles.titleWrap}>
              <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                {title}
              </Text>
            </View>

            <View style={styles.sideBox}>
              {rightIcon ? (
                <TouchableOpacity
                  onPress={onRightPress}
                  style={styles.iconBtn}
                  activeOpacity={0.8}
                >
                  {rightIcon}
                </TouchableOpacity>
              ) : (
                <View style={styles.iconPlaceholder} />
              )}
            </View>
          </View>

          <View style={[styles.line, { backgroundColor: theme.border }]} />
        </View>
      </>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    minHeight: 56,
  },

  sideBox: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconPlaceholder: {
    width: 36,
    height: 36,
  },

  titleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  line: {
    marginTop: 8,
    height: 1,
    width: '100%',
    opacity: 0.7,
  },
});

export default AppHeader;