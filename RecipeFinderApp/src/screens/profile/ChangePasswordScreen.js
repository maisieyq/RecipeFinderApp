import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { typography, spacing, radius, colors } from '../../theme';
import AppHeader from '../../components/common/AppHeader';
import { EyeIcon, EyeOffIcon } from '../../components/icons/commonIcons';

const ChangePasswordScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    Alert.alert('Missing Information', 'Please fill in all password fields.');
    return;
  }

  if (newPassword !== confirmPassword) {
    Alert.alert('Password Mismatch', 'New password and confirm password do not match.');
    return;
  }

  if (!user?.id) {
    Alert.alert('Error', 'Please login first.');
    navigation.navigate('LoginScreen');
    return;
  }

  try {
    const response = await fetch(`http://10.0.2.2:3000/profile/${user.id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert('Update Failed', data.error || data.message);
      return;
    }

    Alert.alert('Updated', 'Your password has been changed successfully.', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  } catch (error) {
    console.log(error);
    Alert.alert('Error', 'Cannot connect to server.');
  }
};

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Change Password"
        variant="profile"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={[styles.note, { color: theme.textMuted }]}>
          Update your password to keep your account secure. Make sure your new password is easy to remember but hard for others to guess.
        </Text>

        <View
          style={[
            styles.inputWrap,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Current Password"
            placeholderTextColor={theme.textMuted}
            secureTextEntry={!showCurrentPassword}
            value={currentPassword}
            onChangeText={text => {
              setCurrentPassword(text);
              if (text.length === 0) setShowCurrentPassword(false);
            }}
          />

          {currentPassword.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowCurrentPassword(prev => !prev)}
              style={styles.eyeBtn}
            >
              {showCurrentPassword ? (
                <EyeIcon color={theme.textMuted} size={20} />
              ) : (
                <EyeOffIcon color={theme.textMuted} size={20} />
              )}
            </TouchableOpacity>
          )}
        </View>

        <View
          style={[
            styles.inputWrap,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="New Password"
            placeholderTextColor={theme.textMuted}
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={text => {
              setNewPassword(text);
              if (text.length === 0) setShowNewPassword(false);
            }}
          />

          {newPassword.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowNewPassword(prev => !prev)}
              style={styles.eyeBtn}
            >
              {showNewPassword ? (
                <EyeIcon color={theme.textMuted} size={20} />
              ) : (
                <EyeOffIcon color={theme.textMuted} size={20} />
              )}
            </TouchableOpacity>
          )}
        </View>

        <View
          style={[
            styles.inputWrap,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Confirm New Password"
            placeholderTextColor={theme.textMuted}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              if (text.length === 0) setShowConfirmPassword(false);
            }}
          />

          {confirmPassword.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowConfirmPassword(prev => !prev)}
              style={styles.eyeBtn}
            >
              {showConfirmPassword ? (
                <EyeIcon color={theme.textMuted} size={20} />
              ) : (
                <EyeOffIcon color={theme.textMuted} size={20} />
              )}
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
  },
  note: {
    fontSize: typography.sizes.sm,
    lineHeight: 22,
    marginBottom: spacing.base,
  },
  inputWrap: {
    borderWidth: 1,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: typography.sizes.base,
  },
  eyeBtn: {
    marginLeft: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    marginTop: 6,
    backgroundColor: colors.orange,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
  },
  saveText: {
    color: '#fff',
    fontSize: typography.sizes.base,
    fontWeight: '700',
  },
});

export default ChangePasswordScreen;