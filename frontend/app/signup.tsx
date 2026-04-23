import { Button, TextField } from '@components/index';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '@constants/theme';
import { useAuth } from '@hooks/index';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    try {
      setError('');
      await signup(email, password, name);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tạo tài khoản</Text>
        </View>

        <Text style={styles.subtitleText}>Đăng ký ngay để trải nghiệm các tính năng tìm việc thông minh AI</Text>

        {/* Roles Select */}
        <View style={styles.roleContainer}>
          <TouchableOpacity style={[styles.roleBtn, styles.roleBtnActive]}>
            <Text style={[styles.roleBtnText, styles.roleBtnTextActive]}>Tôi là Ứng viên</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roleBtn}>
            <Text style={styles.roleBtnText}>Tôi là Nhà tuyển dụng</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <TextField label="Họ và tên" placeholder="Vd: Nguyễn Văn A" value={name}
            onChangeText={(text) => { setName(text); setError(''); }} />
          <TextField label="Email" placeholder="Nhập email của bạn" value={email}
            onChangeText={(text) => { setEmail(text); setError(''); }} keyboardType="email-address" />
          <TextField label="Mật khẩu" placeholder="Tạo mật khẩu" value={password}
            onChangeText={(text) => { setPassword(text); setError(''); }} secureTextEntry showPasswordToggle />
          <TextField label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu" value={confirmPassword}
            onChangeText={(text) => { setConfirmPassword(text); setError(''); }} secureTextEntry showPasswordToggle />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button title="Đăng ký tài khoản" onPress={handleSignUp} isLoading={isLoading} fullWidth style={styles.registerButton} />

          <View style={styles.loginContainer}>
            <Text style={styles.hasAccountText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.primary },
  scrollContent: { flexGrow: 1, paddingHorizontal: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: SPACING.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  backButton: { padding: SPACING.sm, marginRight: SPACING.sm, marginLeft: -SPACING.sm },
  backIcon: { fontSize: 28, color: COLORS.text.primary, fontWeight: '300' },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.text.primary },
  subtitleText: { ...TYPOGRAPHY.body2, color: COLORS.text.secondary, marginBottom: SPACING.xl },
  roleContainer: { flexDirection: 'row', backgroundColor: COLORS.gray[100], borderRadius: BORDER_RADIUS.full, padding: 4, marginBottom: SPACING.xxl },
  roleBtn: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: BORDER_RADIUS.full },
  roleBtnActive: { backgroundColor: COLORS.white, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  roleBtnText: { ...TYPOGRAPHY.body2, fontWeight: '600', color: COLORS.text.secondary },
  roleBtnTextActive: { color: COLORS.primary },
  formContainer: {},
  errorText: { ...TYPOGRAPHY.caption, color: COLORS.error, marginBottom: SPACING.md, marginTop: -SPACING.sm },
  registerButton: { marginTop: SPACING.md, marginBottom: SPACING.xl },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  hasAccountText: { ...TYPOGRAPHY.body2, color: COLORS.text.secondary },
  loginText: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontWeight: '700' },
});
