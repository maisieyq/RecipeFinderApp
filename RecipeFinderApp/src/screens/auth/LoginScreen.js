import React, { useState } from 'react';
import {View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { spacing, radius, colors, typography } from '../../theme';
import AppHeader from '../../components/common/AppHeader';
import { EyeIcon, EyeOffIcon } from '../../components/icons/commonIcons';

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter email and password.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Login Failed', data.error || 'Invalid email or password.');
        return;
      }

      await login(data.user);
      Alert.alert('Login Successful', `Welcome back, ${data.user.name}!`);
      navigation.goBack();

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Cannot connect to server.');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Login"
        variant="profile"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={[styles.note, { color: theme.textMuted }]}>
          Login to continue using RecipeFinder and access your profile features.
        </Text>

        <TextInput
          placeholder="Gmail"
          value={email}
          onChangeText={setEmail}
          style={[
            styles.input,
            {
              borderColor: theme.border,
              backgroundColor: theme.card,
              color: theme.text,
            },
          ]}
          placeholderTextColor={theme.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View
          style={[
            styles.inputWrap,
            {
              borderColor: theme.border,
              backgroundColor: theme.card,
            },
          ]}
        >
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (text.length === 0) setShowPassword(false);
            }}
            style={[
              styles.passwordInput,
              {
                color: theme.text,
              },
            ]}
            placeholderTextColor={theme.textMuted}
            secureTextEntry={!showPassword}
          />

          {password.length > 0 && (
            <TouchableOpacity
              onPress={() => setShowPassword(prev => !prev)}
              activeOpacity={0.8}
              style={styles.eyeBtn}
            >
              {showPassword ? (
                <EyeIcon color={theme.textMuted} size={20} />
              ) : (
                <EyeOffIcon color={theme.textMuted} size={20} />
              )}
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            handleLogin();
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('RegisterScreen')}
          activeOpacity={0.8}
        >
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    marginBottom: 18,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: typography.sizes.base,
  },
  inputWrap: {
    borderWidth: 1,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  passwordInput: {
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
  btn: {
    backgroundColor: colors.orange,
    paddingVertical: 14,
    borderRadius: radius.round,
    alignItems: 'center',
    marginTop: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: typography.sizes.base,
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.orange,
    fontWeight: '600',
    fontSize: typography.sizes.sm,
  },
});