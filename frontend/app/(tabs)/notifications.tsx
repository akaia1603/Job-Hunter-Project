// Notifications Tab - Refined & Vibrant
import { COLORS, SPACING, TYPOGRAPHY, SHADOW, BORDER_RADIUS } from '@constants/theme';
import { notificationService } from '@services/notificationService';
import { NotificationGroup, NotificationItem } from '@/types/notification.types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { LoadingSpinner } from '@components/index';
import { Ionicons } from '@expo/vector-icons';

const NOTIF_TYPE_CONFIG: Record<string, { color: string, icon: string }> = {
  JOB_MATCH: { color: COLORS.primary, icon: 'flash' },
  APPLICATION_UPDATE: { color: '#3B82F6', icon: 'document-text' },
  NEW_JOB: { color: '#10B981', icon: 'briefcase' },
  COMPANY_VIEW: { color: COLORS.gold, icon: 'eye' },
  SYSTEM: { color: COLORS.gray[500], icon: 'notifications' },
};

export default function NotificationsTab() {
  const router = useRouter();
  const [groups, setGroups] = useState<NotificationGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getGroupedNotifications();
      setGroups(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = async (notification: NotificationItem) => {
    await notificationService.markAsRead(notification.id);
    loadNotifications();

    if (notification.data?.jobId) {
      router.push(`/detail?jobId=${notification.data.jobId}`);
    }
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    loadNotifications();
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Đang tải..." />;
  }

  const totalUnread = groups.reduce(
    (sum, g) => sum + g.items.filter(n => !n.read).length, 0
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Thông báo</Text>
          {totalUnread > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7} style={styles.readAllBtn}>
              <Text style={styles.markAllRead}>Đánh dấu đã đọc</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {groups.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="notifications-off-outline" size={40} color={COLORS.text.light} />
            </View>
            <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
          </View>
        ) : (
          groups.map((group, idx) => (
            <View key={idx} style={styles.group}>
              <Text style={styles.groupLabel}>{group.label}</Text>
              {group.items.map(notification => {
                const config = NOTIF_TYPE_CONFIG[notification.type] || NOTIF_TYPE_CONFIG.SYSTEM;
                return (
                  <TouchableOpacity
                    key={notification.id}
                    style={[styles.notifCard, !notification.read && styles.notifUnread]}
                    onPress={() => handlePress(notification)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.notifIconWrap, { backgroundColor: config.color + '15' }]}>
                      <Ionicons name={config.icon as any} size={20} color={config.color} />
                    </View>
                    <View style={styles.notifContent}>
                      <View style={styles.notifHeader}>
                        <Text style={[styles.notifTitle, !notification.read && styles.notifTitleBold]}>
                          {notification.title.replace(/^[^\w\s]+\s*/, '')}
                        </Text>
                        {!notification.read && <View style={styles.unreadDot} />}
                      </View>
                      <Text style={styles.notifBody} numberOfLines={2}>
                        {notification.body}
                      </Text>
                      <Text style={styles.notifTime}>
                        {new Date(notification.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.secondary },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: StatusBar.currentHeight || 50,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xxxl,
    borderBottomLeftRadius: BORDER_RADIUS['3xl'],
    borderBottomRightRadius: BORDER_RADIUS['3xl'],
    ...SHADOW.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white },
  readAllBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  markAllRead: { ...TYPOGRAPHY.captionBold, color: COLORS.white },
  content: { flex: 1 },
  group: { marginTop: SPACING.xl, paddingHorizontal: SPACING.xxxl },
  groupLabel: { 
    ...TYPOGRAPHY.label, 
    color: COLORS.text.light, 
    marginBottom: SPACING.md,
    fontSize: 10,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notifUnread: { 
    backgroundColor: '#F7FCF9', // Very subtle green tint
    borderColor: COLORS.primary + '20',
  },
  notifIconWrap: {
    width: 44, height: 44, borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center', alignItems: 'center',
    marginRight: SPACING.lg,
  },
  notifContent: { flex: 1 },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: { ...TYPOGRAPHY.body2, color: COLORS.text.primary },
  notifTitleBold: { fontWeight: '700' },
  notifBody: { ...TYPOGRAPHY.body2, color: COLORS.text.secondary, lineHeight: 20 },
  notifTime: { ...TYPOGRAPHY.caption, color: COLORS.text.light, marginTop: 6 },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  empty: { alignItems: 'center', padding: SPACING.xxxl, marginTop: 80 },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOW.sm,
  },
  emptyText: { ...TYPOGRAPHY.body2, color: COLORS.text.secondary },
});