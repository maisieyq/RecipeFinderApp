import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius, colors } from '../../theme';
import { SearchIcon, ClearIcon } from '../icons/commonIcons';

const SearchBar = ({ value, onChangeText, onSubmit, placeholder, onClear }) => {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);

  // simple border control (NO animation)
  const borderColor = focused ? colors.orange : theme.border;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: borderColor,
        },
      ]}
    >
      {/* SVG Search Icon */}
      <View style={styles.iconWrap}>
        <SearchIcon
          color={focused ? colors.orange : theme.textMuted}
          size={18}
        />
      </View>

      {/* Input */}
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder || 'Recipe or ingredient...'}
        placeholderTextColor={theme.textMuted}
        returnKeyType="search"
      />

      {/* Clear button */}
      {value?.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
          <ClearIcon color={theme.textMuted} size={16} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.round,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 0,
    marginBottom: 5,
  },

  iconWrap: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    fontSize: typography.sizes.base,
    padding: 0,
  },

  clearBtn: {
    padding: 4,
  },

  clearIcon: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SearchBar;