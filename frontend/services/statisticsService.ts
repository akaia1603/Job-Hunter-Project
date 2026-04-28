import api from './api';
import { ENDPOINTS } from '@constants/endpoints';

export const statisticsService = {
  getAdminStats: () => api.get(ENDPOINTS.STATISTICS.ADMIN),
};
