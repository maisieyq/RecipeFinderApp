import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { useTheme } from '../../context/ThemeContext';
import { useHistoryRecipes } from '../../context/HistoryContext';
import { useFavorites } from '../../context/FavoritesContext';

import { typography, spacing, radius } from '../../theme';
import { RECIPES } from '../../data/mockData';

import RecipeCard from '../../components/recipe/RecipeCard';
import AppHeader from '../../components/common/AppHeader';
import { confirmClearList } from '../../utils/recipeAlerts';

const HistoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { history, removeFromHistory, clearHistory } = useHistoryRecipes();
  const { toggleFavorite, isFavorite } = useFavorites();

  const swipeRefs = useRef({});
  const openRow = useRef(null);

  const closeAllRows = () => {
    Object.values(swipeRefs.current).forEach(ref => {
      if (ref && ref.close) {
        ref.close();
      }
    });
    openRow.current = null;
  };

  const handleSwipeOpen = id => {
    if (openRow.current && openRow.current !== id) {
      const prevRef = swipeRefs.current[openRow.current];
      if (prevRef && prevRef.close) {
        prevRef.close();
      }
    }
    openRow.current = id;
  };

  const clearAll = () => {
    confirmClearList({
      title: 'Clear History',
      message: 'Remove all viewing history?',
      onConfirm: () => {
        closeAllRows();
        clearHistory();
      },
    });
  };

  const handleRemove = id => {
    Alert.alert(
      'Remove History',
      'Are you sure you want to remove this recipe from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            closeAllRows();
            removeFromHistory(id);
          },
        },
      ]
    );
  };

  const histRecipes = history
    .map(id => RECIPES.find(r => r.id === id))
    .filter(Boolean);

  const renderRightActions = id => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => handleRemove(id)}
      style={styles.deleteAction}
    >
      <Text style={styles.deleteText}>Remove</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={closeAllRows}>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <AppHeader
          title="History"
          variant="profile"
          showBack
          onBack={() => navigation.goBack()}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScrollBeginDrag={closeAllRows}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sectionBlock}>
            <View style={styles.sectionTopRow}>
              <Text style={[styles.sectionSmallText, { color: theme.textMuted }]}>
                {histRecipes.length} recently viewed
              </Text>

              <TouchableOpacity
                onPress={clearAll}
                activeOpacity={0.8}
                style={styles.clearBtn}
              >
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {histRecipes.map(recipe => (
              <View key={recipe.id} style={styles.cardWrap}>
                <Swipeable
                  ref={ref => {
                    if (ref) swipeRefs.current[recipe.id] = ref;
                  }}
                  overshootRight={false}
                  onSwipeableOpen={() => handleSwipeOpen(recipe.id)}
                  renderRightActions={() => renderRightActions(recipe.id)}
                >
                  <RecipeCard
                    recipe={recipe}
                    variant="horizontal"
                    onPress={() => {
                      closeAllRows();
                      navigation.navigate('RecipeDetail', { recipe });
                    }}
                  />
                </Swipeable>
              </View>
            ))}

            {histRecipes.length === 0 && (
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                No viewing history yet.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
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

  sectionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  sectionSmallText: {
    fontSize: typography.sizes.sm,
    marginBottom: 7,
  },

  clearBtn: {
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.round,
    marginBottom: 7,
  },

  clearText: {
    color: '#6B6B6B',
    fontSize: typography.sizes.sm,
    fontWeight: '700',
  },

  cardWrap: {
    marginBottom: 7,
    overflow: 'hidden',
    borderRadius: radius.md,
  },

  deleteAction: {
    width: 92,
    height: '100%',
    backgroundColor: '#FF6B3D',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: radius.md,
    borderBottomRightRadius: radius.md,
    marginBottom: spacing.sm,
  },

  deleteText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: typography.sizes.base,
  },
});

export default HistoryScreen;