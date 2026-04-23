// Profile Screen
import { Button, Header } from '@components/index';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '@constants/theme';
import { useAuth } from '@hooks/index';
import type { ProfileScreenProps as Props } from '@navigation/types';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const ProfileScreen: React.FC<Props> = () => {
  const { state, logout } = useAuth();
  const user = state.user;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: logout,
        style: 'destructive',
      },
    ]);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    content: {
      padding: SPACING.lg,
    },
    profileHeader: {
      alignItems: 'center',
      marginBottom: SPACING.xxxl,
      paddingBottom: SPACING.xl,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: COLORS.gray[200],
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
      fontSize: 40,
    },
    userName: {
      ...TYPOGRAPHY.h3,
      color: COLORS.text.primary,
      marginBottom: SPACING.sm,
    },
    userEmail: {
      ...TYPOGRAPHY.body2,
      color: COLORS.text.secondary,
    },
    section: {
      marginBottom: SPACING.xl,
    },
    sectionTitle: {
      ...TYPOGRAPHY.h4,
      color: COLORS.text.primary,
      marginBottom: SPACING.md,
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.lg,
      paddingHorizontal: SPACING.md,
      backgroundColor: COLORS.gray[50],
      borderRadius: BORDER_RADIUS.md,
      marginBottom: SPACING.sm,
    },
    menuItemText: {
      ...TYPOGRAPHY.body2,
      color: COLORS.text.primary,
      flex: 1,
    },
    menuItemIcon: {
      fontSize: 20,
      marginRight: SPACING.md,
    },
    menuItemArrow: {
      fontSize: 18,
      color: COLORS.text.light,
    },
  });

  const menuItems = [
    { icon: '📋', label: 'My CVs' },
    { icon: '💾', label: 'Saved Jobs' },
    { icon: '📝', label: 'Applications' },
    { icon: '⚙️', label: 'Settings' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Account" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        {user && (
          <View style={styles.profileHeader}>
            <Text style={styles.avatar}>👤</Text>
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Text style={styles.menuItemIcon}>{item.icon}</Text>
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={{ marginTop: SPACING.xl }}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;