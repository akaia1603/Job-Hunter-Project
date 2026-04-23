// Login Screen
import { Button, TextField } from '@components/index';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/theme';
import { useAuth, useForm } from '@hooks/index';
import { validateEmail, validateRequired } from '@utils/validation';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login, state } = useAuth();

  useEffect(() => {
    // Only navigate after auth state changes to authenticated
    if (state.isAuthenticated && !state.isLoading) {
      router.replace('/home');
    }
  }, [state.isAuthenticated, state.isLoading]);

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (data) => {
      const errors: Record<string, string> = {};

      if (!validateRequired(data.email)) {
        errors.email = 'Email is required';
      } else if (!validateEmail(data.email)) {
        errors.email = 'Invalid email format';
      }

      if (!validateRequired(data.password)) {
        errors.password = 'Password is required';
      }

      return errors;
    },
    onSubmit: async (data) => {
      try {
        await login(data.email, data.password);
        // Navigation will happen in useEffect when isAuthenticated becomes true
      } catch (error: any) {
        Alert.alert('Login Error', error?.message || 'Login failed');
      }
    },
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    header: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.xxxl,
      alignItems: 'center',
    },
    logo: {
      fontSize: 48,
      marginBottom: SPACING.lg,
    },
    title: {
      ...TYPOGRAPHY.h2,
      color: COLORS.white,
      textAlign: 'center',
      marginBottom: SPACING.md,
    },
    subtitle: {
      ...TYPOGRAPHY.body2,
      color: COLORS.white,
      textAlign: 'center',
      opacity: 0.9,
    },
    formContainer: {
      padding: SPACING.lg,
      paddingTop: SPACING.xl,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: SPACING.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: COLORS.border,
    },
    dividerText: {
      ...TYPOGRAPHY.caption,
      color: COLORS.text.light,
      marginHorizontal: SPACING.md,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: SPACING.lg,
    },
    socialButton: {
      flex: 1,
      height: 48,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: SPACING.sm,
    },
    socialIcon: {
      fontSize: 20,
    },
    footerText: {
      ...TYPOGRAPHY.body2,
      color: COLORS.text.secondary,
      textAlign: 'center',
      marginTop: SPACING.lg,
    },
    signUpLink: {
      color: COLORS.primary,
      fontWeight: '600',
    },
    forgotPassword: {
      ...TYPOGRAPHY.body2,
      color: COLORS.primary,
      textAlign: 'right',
      marginBottom: SPACING.lg,
      marginTop: -SPACING.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>📋</Text>
          <Text style={styles.title}>Welcome to TopCV</Text>
          <Text style={styles.subtitle}>Find your perfect job</Text>
        </View>

        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <TextField
            label="Email"
            placeholder="Enter your email"
            value={values.email}
            onChangeText={(text: string) => handleChange('email', text)}
            keyboardType="email-address"
            error={errors.email}
          />

          <TextField
            label="Password"
            placeholder="Enter your password"
            value={values.password}
            onChangeText={(text: string) => handleChange('password', text)}
            secureTextEntry
            showPasswordToggle
            error={errors.password}
          />

          <Text style={styles.forgotPassword} onPress={() => {}}>
            Forgot password?
          </Text>

          <Button
            title="Login"
            onPress={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
          />

          <Button
            title="Demo Login (demo@topjob.vn / 123456)"
            onPress={() => {
              handleChange('email', 'demo@topjob.vn');
              handleChange('password', '123456');
              setTimeout(() => {
                handleSubmit();
              }, 100);
            }}
            variant="secondary"
            fullWidth
            style={{ marginTop: SPACING.md }}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or login with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>🍎</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text
              style={styles.signUpLink}
              onPress={() => navigation.navigate('SignUp')}
            >
              Sign up now
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;