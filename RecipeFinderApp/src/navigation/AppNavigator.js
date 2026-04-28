import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '../context/ThemeContext';
import { colors, shadows } from '../theme';
import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/home/SearchScreen';
import PantryScreen from '../screens/pantry/PantryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import GuestProfileScreen from '../screens/profile/GuestProfileScreen';
import RecipeDetailScreen from '../screens/recipe/RecipeDetailScreen';

import EditProfileScreen from '../screens/profile/EditProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import FavouritesScreen from '../screens/profile/FavoritesScreen';
import PantryManageScreen from '../screens/profile/PantryManageScreen';
import HistoryScreen from '../screens/profile/HistoryScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import SupportScreen from '../screens/profile/SupportScreen';
import TermsScreen from '../screens/profile/TermsScreen';
import PrivacyScreen from '../screens/profile/PrivacyScreen';
import VersionScreen from '../screens/profile/VersionScreen';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import {
  HomeIcon,
  PantryIcon,
  ProfileIcon,
} from '../components/icons/AppNavigationIcons';
import { SearchIcon } from '../components/icons/commonIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, label, focused, theme }) => (
  <View style={tabStyles.wrap}>
    <View
      style={[
        tabStyles.iconBox,
        focused && { backgroundColor: colors.orange },
      ]}
    >
      {React.cloneElement(icon, {
        color: focused ? '#fff' : theme.textMuted,
      })}
    </View>

    <Text
      style={[
        tabStyles.label,
        { color: focused ? colors.orange : theme.textMuted },
      ]}
    >
      {label}
    </Text>
  </View>
);

const tabStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
});

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

function PantryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Pantry" component={PantryScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  const { isLoggedIn } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="ProfileMain" component={ProfileScreen} />
          <Stack.Screen name="FavouritesScreen" component={FavouritesScreen} />
          <Stack.Screen name="PantryManageScreen" component={PantryManageScreen} />
          <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
          <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
          <Stack.Screen name="SupportScreen" component={SupportScreen} />
          <Stack.Screen name="TermsScreen" component={TermsScreen} />
          <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
          <Stack.Screen name="VersionScreen" component={VersionScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="GuestProfileScreen" component={GuestProfileScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function HomeTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        lazy: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 66,
          paddingBottom: 8,
          paddingTop: 4,
          ...shadows.sm,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            const state = route.state;
            if (state && state.index > 0) {
              navigation.navigate('HomeTab', { screen: 'Home' });
            }
          },
        })}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<HomeIcon />} label="Home" focused={focused} theme={theme} />
          ),
        }}
      />

      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            const state = route.state;
            if (state && state.index > 0) {
              navigation.navigate('SearchTab', { screen: 'SearchMain' });
            }
          },
        })}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<SearchIcon />} label="Search" focused={focused} theme={theme} />
          ),
        }}
      />

      <Tab.Screen
        name="PantryTab"
        component={PantryStack}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            const state = route.state;
            if (state && state.index > 0) {
              navigation.navigate('PantryTab', { screen: 'Pantry' });
            }
          },
        })}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<PantryIcon />} label="Pantry" focused={focused} theme={theme} />
          ),
        }}
      />


      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            const state = route.state;
            if (state && state.index > 0) {
              navigation.navigate('ProfileTab', { screen: 'ProfileMain' });
            }
          },
        })}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<ProfileIcon />} label="Profile" focused={focused} theme={theme} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <HomeTabs />
    </NavigationContainer>
  );
}