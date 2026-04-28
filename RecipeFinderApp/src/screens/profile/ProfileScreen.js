import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { useTheme }        from '../../context/ThemeContext';
import { useAuth }         from '../../context/AuthContext';
import { useFavorites }    from '../../context/FavoritesContext';
import { spacing, colors } from '../../theme';

import AppHeader           from '../../components/common/AppHeader';
import ProfileMenuRow      from '../../components/Profile/ProfileMenuRow';

import {
  FavouriteIcon,
  HistoryIcon,
  SettingIcon,
  EditIcon,
  LogoutIcon,
} from '../../components/icons/ProfileMenuIcons';

import { PantryIcon }      from '../../components/icons/AppNavigationIcons';
import { usePantry }       from '../../context/PantryContext';

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const handleEdit = () => {
    navigation.navigate('EditProfileScreen');
  };

  const { logout } = useAuth();

  const { favorites } = useFavorites();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Logout', onPress: logout },
    ]);
  };

  const { pantryItems } = usePantry();

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
                <Text style={styles.avatarText}>UN</Text>
              </View>
              <View style={styles.avatarOnline} />
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>UserName</Text>

              <View style={{ marginTop: 2 }}>
                <Text style={styles.userMail} numberOfLines={1}>WAD202605@gmail.com</Text>
                <Text style={styles.userPhone}>+60123456789</Text>
              </View>
            </View>

            <View style={styles.userActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleEdit}
                activeOpacity={0.85}
              >
                <EditIcon color='#FF6B2C' size={16} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnGhost]}
                onPress={handleLogout}
                activeOpacity={0.85}
              >
                <LogoutIcon color='#FF6B2C' size={16} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.menuWrap}>
          <ProfileMenuRow
            icon={<FavouriteIcon color={colors.orange} />}
            label="Favourite"
            count={favorites.length}
            theme={theme}
            onPress={() => navigation.navigate('FavouritesScreen')}
          />

          <ProfileMenuRow
            icon={<HistoryIcon color={colors.orange} />}
            label="History"
            theme={theme}
            onPress={() => navigation.navigate('HistoryScreen')}
          />

          <ProfileMenuRow
            icon={<PantryIcon color={colors.orange} />}
            label="Pantry"
            count={pantryItems.length}
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

  // user name
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
                    


  // edit + logout
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

  // 3 screen 
  menuWrap: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.base,
    gap: spacing.base,
  },
});

export default ProfileScreen;