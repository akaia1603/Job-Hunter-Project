// Authentication Service — mapped to Spring Boot AuthController
import { API_CONFIG, ENDPOINTS } from '@constants/endpoints';
import { LoginRequest, LoginResponse, SignUpRequest, SignUpResponse, User } from '@/types/index';
import { MOCK_CURRENT_USER } from './mockData';
import api from './api';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    if (API_CONFIG.USE_MOCK) {
      // Demo login
      if (credentials.username === 'demo@topjob.vn' && credentials.password === '123456') {
        return {
          access_token: 'mock-token-' + Date.now(),
          user: {
            id: MOCK_CURRENT_USER.id,
            email: MOCK_CURRENT_USER.email,
            name: MOCK_CURRENT_USER.name,
            role: MOCK_CURRENT_USER.role!,
          },
        };
      }
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    // Real Spring API: POST /api/v1/auth/login
    // Spring expects { username, password }
    const response = await api.post(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return (response.data as any).data;
  }

  async register(data: SignUpRequest): Promise<SignUpResponse> {
    if (API_CONFIG.USE_MOCK) {
      return {
        id: Date.now(),
        email: data.email,
        name: data.name,
        age: data.age,
        gender: data.gender,
        address: data.address,
        createdAt: new Date().toISOString(),
      };
    }

    // Real Spring API: POST /api/v1/auth/register
    const response = await api.post(
      ENDPOINTS.AUTH.REGISTER,
      data
    );
    return (response.data as any).data;
  }

  async logout(): Promise<void> {
    if (API_CONFIG.USE_MOCK) return;

    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<User> {
    if (API_CONFIG.USE_MOCK) {
      return MOCK_CURRENT_USER;
    }

    // Real Spring API: GET /api/v1/auth/account
    const response = await api.get(ENDPOINTS.AUTH.ACCOUNT);
    return (response.data as any).data?.user;
  }

  async refreshToken(): Promise<LoginResponse> {
    // Real Spring API: GET /api/v1/auth/refresh (reads cookie)
    const response = await api.get(ENDPOINTS.AUTH.REFRESH);
    return (response.data as any).data;
  }
}

export const authService = new AuthService();
export default authService;