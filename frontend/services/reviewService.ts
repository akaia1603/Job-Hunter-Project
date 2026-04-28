import api from './api';
import { ENDPOINTS } from '@constants/endpoints';

export const reviewService = {
  createReview: (data: { rating: number; comment: string; receiverId: number }) => 
    api.post(ENDPOINTS.REVIEWS.CREATE, data),
  getReviews: () => api.get(ENDPOINTS.REVIEWS.LIST),
};
