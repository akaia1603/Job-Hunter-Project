// Profile Service
import { ENDPOINTS } from '@constants/endpoints';
import { ApiResponse, User } from '@/types/index';
import api from './api';

class ProfileService {
  async getProfile(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>(ENDPOINTS.PROFILE.GET);
      return response.data.data as User;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>(
        ENDPOINTS.PROFILE.UPDATE,
        data
      );
      return response.data.data as User;
    } catch (error) {
      throw error;
    }
  }

  async uploadProfilePhoto(photoUri: string): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'profile-photo.jpg',
      } as any);

      const response = await api.post<ApiResponse<User>>(
        ENDPOINTS.PROFILE.UPDATE_PHOTO,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data as User;
    } catch (error) {
      throw error;
    }
  }

  async deleteAccount(password: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>(
        ENDPOINTS.PROFILE.DELETE_ACCOUNT,
        { password }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const profileService = new ProfileService();

export default profileService;