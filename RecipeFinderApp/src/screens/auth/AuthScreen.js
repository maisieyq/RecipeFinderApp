import React, { useState } from 'react';
import { View } from 'react-native';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

export default function AuthScreen() {
  const [mode, setMode] = useState('login');

  return (
    <View style={{ flex: 1 }}>
      {mode === 'login' ? (
        <LoginScreen goRegister={() => setMode('register')} />
      ) : (
        <RegisterScreen goLogin={() => setMode('login')} />
      )}
    </View>
  );
}