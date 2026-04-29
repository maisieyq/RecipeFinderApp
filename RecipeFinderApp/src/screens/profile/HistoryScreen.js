import React, { useEffect, useState,useRef } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius } from '../../theme';
import RecipeCard from '../../components/recipe/RecipeCard';
import AppHeader from '../../components/common/AppHeader';
import { confirmClearList } from '../../utils/recipeAlerts';

const HistoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [histRecipes, setHistRecipes] = useState([]);

  const swipeRefs = useRef({});
  const openRow = useRef(null);

  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  const loadHistory = async () => {
    if (!user?.id) {
      return;
    }

    try {
      const res = await fetch(`http://10.0.2.2:3000/history/${user.id}`);
      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.error || 'Failed to load history.');
        return;
      }

      const formatted = data.map(item => ({
        id: item.recipeId,
        title: item.recipeTitle,
        image: item.recipeImage,
        historyId: item.id,
        cookTime: item.cookTime || 'N/A',
        servings: item.servings || 1,
        calories: item.calories || 0,
        difficulty: item.difficulty || 'N/A',
        tags: [],
      }));

      setHistRecipes(formatted);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Cannot connect to server.');
    }
  };

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
      onConfirm: async () => {
        try {
          closeAllRows();

          for (const recipe of histRecipes) {
            await fetch(`http://10.0.2.2:3000/history/${recipe.historyId}`, {
              method: 'DELETE',
            });
          }

          setHistRecipes([]);
        } catch (error) {
          console.log(error);
          Alert.alert('Error', 'Cannot clear history.');
        }
      },
    });
  };

  const handleRemove = recipe => {
    Alert.alert(
      'Remove History',
      'Are you sure you want to remove this recipe from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              closeAllRows();

              await fetch(`http://10.0.2.2:3000/history/${recipe.historyId}`, {
                method: 'DELETE',
              });

              setHistRecipes(prev =>
                prev.filter(item => item.historyId !== recipe.historyId)
              );
            } catch (error) {
              console.log(error);
              Alert.alert('Error', 'Cannot remove history.');
            }
          },
        },
      ]
    );
  };

  const renderRightActions = recipe => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => handleRemove(recipe)}
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
              <View key={recipe.historyId} style={styles.cardWrap}>
                <Swipeable
                  ref={ref => {
                    if (ref) swipeRefs.current[recipe.historyId] = ref;
                  }}
                  overshootRight={false}
                  onSwipeableOpen={() => handleSwipeOpen(recipe.historyId)}
                  renderRightActions={() => renderRightActions(recipe)}
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