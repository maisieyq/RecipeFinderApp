import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, colors } from '../../theme';
import { ChevronRightIcon } from '../icons/ProfileMenuIcons';

const ProfileMenuRow = ({
  icon,
  label,
  onPress,
  theme,
  count,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={[
        styles.menuRow,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.menuLeft}>
        <View
          style={[
            styles.menuIconCircle,
            { backgroundColor: theme.card }
          ]}
        >
          {icon}
        </View>        
        <Text style={[styles.menuTitle, { color: theme.text }]}>{label}</Text>
      </View>

      <View style={styles.menuRight}>
        {count ? (
          <Text style={[styles.menuCount, { color: theme.textMuted }]}>{count}</Text>
        ) : null}
        <ChevronRightIcon color={theme.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuRow: {
    borderWidth: 1,
    borderRadius: 20,
    minHeight: 78,
    paddingHorizontal: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIconCircle: {
    width: 35,
    height: 35,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuCount: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ProfileMenuRow;