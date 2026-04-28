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
import { typography, spacing, radius, colors } from '../../theme';
import AppHeader from '../../components/common/AppHeader';

const EditProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const [name, setName] = useState('UserName');
  const [email, setEmail] = useState('WAD202605@gmail.com');
  const [phone, setPhone] = useState('+60123456789');
  const [password, setPassword] = useState('123456');

    const handleSave = () => {
    if (!name || !email || !phone || !password) {
        Alert.alert('Missing Information', 'Please fill in all fields.');
        return;
    }

    Alert.alert(
        'Updated',
        'Your profile has been updated successfully.',
        [
        {
            text: 'OK',
            onPress: () => navigation.goBack(),
        },
        ]
    );
    };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppHeader
        title="Edit Profile"
        variant="profile"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionBlock}>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={styles.fieldBlock}>
              <Text style={[styles.label, { color: theme.text }]}>Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Enter your name"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={[styles.label, { color: theme.text }]}>Gmail</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Enter your gmail"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={[styles.label, { color: theme.text }]}>Phone</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Enter your phone number"
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveBtn}
            activeOpacity={0.85}
            onPress={handleSave}
          >
            <Text style={styles.saveText}>Save Changes</Text>
            
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  card: {
    borderWidth: 1.5,
    borderRadius: radius.xl,
    padding: spacing.base,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: typography.sizes.base,
  },
  saveBtn: {
    marginTop: 18,
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

export default EditProfileScreen;