// Notification Service — Real API with mock fallback
import { API_CONFIG, ENDPOINTS } from '@constants/endpoints';
import { NotificationItem } from '@/types/notification.types';
import { MOCK_NOTIFICATIONS } from './mockData';
import api from './api';

class NotificationService {
  async getNotifications(params?: { page?: number; limit?: number }): Promise<{ data: NotificationItem[] }> {
    if (API_CONFIG.USE_MOCK) {
      return { data: MOCK_NOTIFICATIONS };
    }

    // Real API: GET /api/v1/notifications — wrapped: { statusCode, data: [...notifications], message }
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.LIST);
    const notifications = (response.data as any).data || [];
    
    // Map backend Notification to frontend NotificationItem
    return {
      data: notifications.map((n: any) => ({
        id: String(n.id),
        type: n.type || 'SYSTEM',
        title: n.title,
        body: n.message || n.body,
        read: n.read,
        createdAt: n.createdAt,
        data: n.data || {},
        icon: '',
      })),
    };
  }

  async markAsRead(notificationId: string): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      const notif = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
      if (notif) notif.read = true;
      return;
    }
    // Real API: POST /api/v1/notifications/{id}/read
    await api.post(ENDPOINTS.NOTIFICATIONS.MARK_READ(parseInt(notificationId)));
  }

  async markAllAsRead(): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      MOCK_NOTIFICATIONS.forEach(n => { n.read = true; });
      return;
    }
    // Real API: POST /api/v1/notifications/read-all
    await api.post(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  }

  async getUnreadCount(): Promise<number> {
    if (API_CONFIG.USE_MOCK) {
      return MOCK_NOTIFICATIONS.filter(n => !n.read).length;
    }
    // Real API: GET /api/v1/notifications/unread — returns { data: <number> }
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.COUNT_UNREAD);
    return (response.data as any).data || 0;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
