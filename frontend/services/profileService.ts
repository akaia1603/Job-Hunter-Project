// Profile Service — mapped to Spring Boot UserController
import { User } from '@/types/auth.types';
import { API_CONFIG, ENDPOINTS } from '@constants/endpoints';
import api from './api';
import { MOCK_CURRENT_USER } from './mockData';

class ProfileService {
  async getProfile(): Promise<User> {
    if (API_CONFIG.USE_MOCK) {
      return MOCK_CURRENT_USER;
    }
    // Real API: GET /api/v1/auth/account — { data: { user: {...} } }
    const response = await api.get(ENDPOINTS.PROFILE.GET);
    return (response.data as any).data?.user;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    if (API_CONFIG.USE_MOCK) {
      return { ...MOCK_CURRENT_USER, ...data };
    }
    // Real API: PUT /api/v1/users — { data: User }
    const response = await api.put(ENDPOINTS.PROFILE.UPDATE, data);
    return (response.data as any).data;
  }

  async uploadAvatar(file: any): Promise<string> {
    if (API_CONFIG.USE_MOCK) {
      return 'mock-avatar-url';
    }
    // Real API: POST /api/v1/users/avatar — multipart
    const formData = new FormData();
    formData.append('avatar', {
      uri: file.uri,
      name: file.name || 'avatar.jpg',
      type: file.type || 'image/jpeg',
    } as any);

    const response = await api.post(ENDPOINTS.PROFILE.UPLOAD_AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return (response.data as any).data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<void> {
    if (API_CONFIG.USE_MOCK) return;
    // Real API: POST /api/v1/users/change-password
    await api.post(ENDPOINTS.PROFILE.CHANGE_PASSWORD, data);
  }
}

export const profileService = new ProfileService();
export default profileService;