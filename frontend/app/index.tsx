import { Button, LoadingSpinner, TextField } from '@components/index';
import { COLORS, SPACING, TYPOGRAPHY, SHADOW, BORDER_RADIUS } from '@constants/theme';
import { useAuth } from '@hooks/index';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, state } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isLoading && state.isAuthenticated) {
    setTimeout(() => router.replace('/(tabs)'), 0);
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }
    try {
      setError('');
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@topjob.vn');
    setPassword('123456');
  };

  if (isLoading && state.isAuthenticated) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background.primary} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <Text style={styles.welcomeText}>Chào mừng trở lại</Text>
          <Text style={styles.subtitleText}>Đăng nhập để tiếp tục hành trình sự nghiệp</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <TextField
            label="EMAIL"
            placeholder="name@example.com"
            value={email}
            onChangeText={(text) => { setEmail(text); setError(''); }}
            keyboardType="email-address"
          />

          <TextField
            label="MẬT KHẨU"
            placeholder="Nhập mật khẩu của bạn"
            value={password}
            onChangeText={(text) => { setPassword(text); setError(''); }}
            secureTextEntry
            showPasswordToggle
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.6}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <Button
            title="Đăng nhập"
            onPress={handleLogin}
            isLoading={isLoading}
            fullWidth
            style={styles.loginButton}
          />

          <Button
            title="Sử dụng tài khoản Demo"
            onPress={handleDemoLogin}
            variant="ghost"
            fullWidth
          />
        </View>

        {/* Social Login */}
        <View style={styles.socialContainer}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>HOẶC TIẾP TỤC VỚI</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <Text style={styles.socialBtnText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.noAccountText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')} activeOpacity={0.6}>
            <Text style={styles.registerText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background.primary 
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xxxl,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: SPACING.xxxl,
  },
  header: { 
    alignItems: 'flex-start', 
    marginBottom: SPACING['7xl'] 
  },
  logoContainer: {
    width: 48, 
    height: 48, 
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    ...SHADOW.sm,
  },
  logoText: { 
    color: COLORS.white, 
    fontSize: 24, 
    fontWeight: '900' 
  },
  welcomeText: { 
    ...TYPOGRAPHY.h1, 
    color: COLORS.text.primary, 
    marginBottom: SPACING.xs 
  },
  subtitleText: { 
    ...TYPOGRAPHY.body1, 
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  formContainer: { 
    marginBottom: SPACING.xxxl 
  },
  errorText: { 
    ...TYPOGRAPHY.caption, 
    color: COLORS.error, 
    marginBottom: SPACING.md, 
    marginTop: -SPACING.md,
    fontWeight: '500',
  },
  forgotPassword: { 
    alignSelf: 'flex-end', 
    marginBottom: SPACING.xxl,
    marginTop: -SPACING.sm,
  },
  forgotPasswordText: { 
    ...TYPOGRAPHY.captionBold, 
    color: COLORS.primary,
  },
  loginButton: { 
    marginBottom: SPACING.sm 
  },
  socialContainer: { 
    marginTop: SPACING.xxxl,
    marginBottom: SPACING.xxxl,
  },
  divider: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: SPACING.xxl 
  },
  dividerLine: { 
    flex: 1, 
    height: 1, 
    backgroundColor: COLORS.divider 
  },
  dividerText: { 
    ...TYPOGRAPHY.label, 
    color: COLORS.text.light, 
    paddingHorizontal: SPACING.lg,
    fontSize: 10,
  },
  socialButtons: { 
    flexDirection: 'row', 
    gap: SPACING.lg 
  },
  socialBtn: {
    flex: 1, 
    height: 52, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md, 
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialBtnText: { 
    ...TYPOGRAPHY.buttonSmall, 
    color: COLORS.text.primary 
  },
  registerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 'auto',
  },
  noAccountText: { 
    ...TYPOGRAPHY.body2, 
    color: COLORS.text.secondary 
  },
  registerText: { 
    ...TYPOGRAPHY.body2, 
    color: COLORS.primary, 
    fontWeight: '700' 
  },
});