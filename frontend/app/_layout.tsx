import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import 'react-native-reanimated';
import { AuthProvider } from '../context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const appContent = (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="detail" options={{ headerShown: true, title: 'Chi tiết việc làm', headerBackTitle: 'Quay lại' }} />
          <Stack.Screen name="company-detail" options={{ headerShown: true, title: 'Chi tiết công ty', headerBackTitle: 'Quay lại' }} />
          <Stack.Screen name="premium" options={{ headerShown: true, title: 'Gói Premium', headerBackTitle: 'Đóng' }} />
          <Stack.Screen name="saved-jobs" options={{ headerShown: true, title: 'Việc làm đã lưu', headerBackTitle: 'Quay lại' }} />
          <Stack.Screen name="profile-edit" options={{ headerShown: true, title: 'Cập nhật hồ sơ', headerBackTitle: 'Hủy' }} />
          <Stack.Screen name="cv-builder" options={{ headerShown: true, title: 'Tạo CV', headerBackTitle: 'Quay lại' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <View style={styles.mobileWrapper}>
          {appContent}
        </View>
      </View>
    );
  }

  return appContent;
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileWrapper: {
    width: '100%',
    maxWidth: 428,
    height: '100%',
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});
