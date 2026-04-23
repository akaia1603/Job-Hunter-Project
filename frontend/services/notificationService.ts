// Notification Service
import { NotificationItem, NotificationGroup } from '@/types/notification.types';
import { MOCK_NOTIFICATIONS } from './mockData';

class NotificationService {
  private notifications: NotificationItem[] = [...MOCK_NOTIFICATIONS];

  async getNotifications(): Promise<NotificationItem[]> {
    return this.notifications;
  }

  async getGroupedNotifications(): Promise<NotificationGroup[]> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const weekAgo = new Date(today.getTime() - 7 * 86400000);

    const groups: NotificationGroup[] = [];

    const todayItems = this.notifications.filter(n => new Date(n.createdAt) >= today);
    const yesterdayItems = this.notifications.filter(n => {
      const d = new Date(n.createdAt);
      return d >= yesterday && d < today;
    });
    const olderItems = this.notifications.filter(n => {
      const d = new Date(n.createdAt);
      return d >= weekAgo && d < yesterday;
    });

    if (todayItems.length > 0) groups.push({ label: 'Hôm nay', items: todayItems });
    if (yesterdayItems.length > 0) groups.push({ label: 'Hôm qua', items: yesterdayItems });
    if (olderItems.length > 0) groups.push({ label: 'Tuần trước', items: olderItems });

    return groups;
  }

  async getUnreadCount(): Promise<number> {
    return this.notifications.filter(n => !n.read).length;
  }

  async markAsRead(id: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.forEach(n => { n.read = true; });
  }

  async deleteNotification(id: string): Promise<void> {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }
}

export const notificationService = new NotificationService();
export default notificationService;
