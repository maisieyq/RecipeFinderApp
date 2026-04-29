import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { spacing, colors } from '../../theme';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import AppHeader from '../../components/common/AppHeader';
import ProfileMenuRow from '../../components/Profile/ProfileMenuRow';

import {
  FavouriteIcon,
  HistoryIcon,
  SettingIcon,
  EditIcon,
  LogoutIcon,
} from '../../components/icons/ProfileMenuIcons';

import { PantryIcon } from '../../components/icons/AppNavigationIcons';

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, isLoggedIn, logout } = useAuth();

  const [favouriteCount, setFavouriteCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [pantryCount, setPantryCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadCounts();
    }, [user?.id])
  );

  const loadCounts = async () => {
    if (!user?.id) {
      setFavouriteCount(0);
      setHistoryCount(0);
      setPantryCount(0);
      return;
    }

    try {
      const [favRes, historyRes, pantryRes] = await Promise.all([
        fetch(`http://10.0.2.2:3000/favourites/${user.id}`),
        fetch(`http://10.0.2.2:3000/history/${user.id}`),
        fetch(`http://10.0.2.2:3000/pantry/${user.id}`),
      ]);

      const favData = await favRes.json();
      const historyData = await historyRes.json();
      const pantryData = await pantryRes.json();

      setFavouriteCount(Array.isArray(favData) ? favData.length : 0);
      setHistoryCount(Array.isArray(historyData) ? historyData.length : 0);
      setPantryCount(Array.isArray(pantryData) ? pantryData.length : 0);
    } catch (error) {
      console.log(error);
      setFavouriteCount(0);
      setHistoryCount(0);
      setPantryCount(0);
    }
  };

  const handleEdit = () => {
    if (!isLoggedIn) {
      navigation.navigate('LoginScreen');
      return;
    }

    navigation.navigate('EditProfileScreen');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        onPress: () => {
          logout();
          setFavouriteCount(0);
          setHistoryCount(0);
        },
      },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background ?? '#FAFAFA' }]}>
      <AppHeader title="Profile" variant="profile" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.userHero}>
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />

          <View style={styles.userHeroContent}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'UN'}
                </Text>
              </View>
              <View style={styles.avatarOnline} />
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user?.name || 'Guest User'}
              </Text>

              <View style={{ marginTop: 2 }}>
                <Text style={styles.userMail} numberOfLines={1}>
                  {user?.email || 'Please login'}
                </Text>
                <Text style={styles.userPhone}>
                  {user?.phone || '-'}
                </Text>
              </View>
            </View>

            <View style={styles.userActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleEdit}
                activeOpacity={0.85}
              >
                <EditIcon color="#FF6B2C" size={16} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnGhost]}
                onPress={handleLogout}
                activeOpacity={0.85}
              >
                <LogoutIcon color="#FF6B2C" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.menuWrap}>
          <ProfileMenuRow
            icon={<FavouriteIcon color={colors.orange} />}
            label="Favourite"
            count={favouriteCount}
            theme={theme}
            onPress={() => navigation.navigate('FavouritesScreen')}
          />

          <ProfileMenuRow
            icon={<HistoryIcon color={colors.orange} />}
            label="History"
            count={historyCount}
            theme={theme}
            onPress={() => navigation.navigate('HistoryScreen')}
          />

          <ProfileMenuRow
            icon={<PantryIcon color={colors.orange} />}
            label="Pantry"
            count={pantryCount}
            theme={theme}
            onPress={() => navigation.navigate('PantryManageScreen')}
          />

          <ProfileMenuRow
            icon={<SettingIcon color={colors.orange} />}
            label="Setting"
            theme={theme}
            onPress={() => navigation.navigate('SettingsScreen')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    paddingTop: 5,
  },

  userHero: {
    marginTop: 25,
    marginHorizontal: 20,
    borderRadius: 24,
    backgroundColor: colors.orange,
    overflow: 'hidden',
    marginBottom: 14,
  },
  heroCircle1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -40,
    right: -30,
  },
  heroCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -20,
    right: 60,
  },
  userHeroContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  avatarWrap: {
    position: 'relative',
  },
  avatarCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgb(255, 255, 255)',
    borderWidth: 2,
    borderColor: 'rgb(255, 255, 255)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF6B2C',
  },
  avatarOnline: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#58B74A',
    borderWidth: 2,
    borderColor: colors.orange,
  },

  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.2,
    marginTop: 4,
    marginBottom: 4,
  },
  userMail: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 1,
    letterSpacing: 0.2,
  },
  userPhone: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: -1,
    marginBottom: 2,
    letterSpacing: 0.4,
  },

  userActions: {
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgb(255, 255, 255)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  actionBtnGhost: {
    backgroundColor: 'rgb(255, 255, 255)',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  menuWrap: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.base,
    gap: spacing.base,
  },
});

export default ProfileScreen;