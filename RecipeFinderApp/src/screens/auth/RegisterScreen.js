import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius, colors, typography } from '../../theme';
import AppHeader from '../../components/common/AppHeader';
import { EyeIcon, EyeOffIcon } from '../../components/icons/commonIcons';

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const handleRegister = async () => {

  const nameValue = name.trim();
  const emailValue = email.trim();
  const phoneValue = phone.trim();
  const passwordValue = password.trim();
  const confirmPasswordValue = confirmPassword.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,11}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // 🔽 ADD VALIDATION HERE
  if (!nameValue || !emailValue || !phoneValue || !passwordValue || !confirmPasswordValue) {
    Alert.alert('Missing Information', 'Please fill in all fields.');
    return;
  }

  if (nameValue.length < 3) {
    Alert.alert('Invalid Name', 'Name must be at least 3 characters.');
    return;
  }

  if (!emailRegex.test(emailValue)) {
    Alert.alert('Invalid Email', 'Please enter a valid email address.');
    return;
  }

  if (!emailValue.endsWith('@gmail.com')) {
    Alert.alert('Invalid Gmail', 'Please use a Gmail address.');
    return;
  }

  if (!phoneRegex.test(phoneValue)) {
    Alert.alert('Invalid Phone Number', 'Phone number must be 10 to 11 digits only.');
    return;
  }

  if (!passwordRegex.test(passwordValue)) {
    Alert.alert(
      'Weak Password',
      'Password must be at least 8 characters and include:\n• Uppercase letter\n• Lowercase letter\n• Number\n• Special symbol (e.g. @, $, !)'
    );
    return;
  }

  if (passwordValue !== confirmPasswordValue) {
    Alert.alert('Password Mismatch', 'Password and confirm password do not match.');
    return;
  }

  // 🔽 KEEP YOUR ORIGINAL FETCH BELOW
  try {
    const response = await fetch('http://10.0.2.2:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameValue,
        email: emailValue,
        phone: phoneValue,
        password: passwordValue,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert('Register Failed', data.error || data.message);
      return;
    }

    Alert.alert('Registered', 'Your account has been created successfully.', [
    {
      text: 'OK',
      onPress: () => navigation.navigate('LoginScreen'),
    },
]);
  } catch (error) {
    Alert.alert('Error', 'Cannot connect to server.');
  }
};

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Register"
        variant="profile"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Text style={[styles.note, { color: theme.textMuted }]}>
            Create your account to save favourites and access your profile features.
          </Text>

          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={[
              styles.input,
              {
                borderColor: theme.border,
                backgroundColor: theme.card,
                color: theme.text,
              },
            ]}
            placeholderTextColor={theme.textMuted}
          />

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

          <TextInput
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            style={[
              styles.input,
              {
                borderColor: theme.border,
                backgroundColor: theme.card,
                color: theme.text,
              },
            ]}
            placeholderTextColor={theme.textMuted}
            keyboardType="phone-pad"
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
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                if (text.length === 0) setShowConfirmPassword(false);
              }}
              style={[
                styles.passwordInput,
                {
                  color: theme.text,
                },
              ]}
              placeholderTextColor={theme.textMuted}
              secureTextEntry={!showConfirmPassword}
            />

            {confirmPassword.length > 0 && (
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(prev => !prev)}
                activeOpacity={0.8}
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

          <TouchableOpacity
            style={styles.btn}
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen')}
            activeOpacity={0.8}
          >
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
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