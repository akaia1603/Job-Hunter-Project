// CV Service — with mock support for demo
import { API_CONFIG, ENDPOINTS } from '@constants/endpoints';
import {
    ApiResponse,
    CV,
    CVAnalytics,
    CVTemplate,
    CreateCVRequest,
    ExportCVRequest,
    PaginationResponse,
    ShareCVRequest,
    UpdateCVRequest,
} from '@/types/index';
import api from './api';

// Mock CV data
const MOCK_TEMPLATES: CVTemplate[] = [
  { id: 'tpl-1', name: 'Chuyên nghiệp', description: 'Mẫu CV chuyên nghiệp, phù hợp mọi ngành', thumbnail: '', colors: ['#1a56db', '#3b82f6', '#60a5fa'] },
  { id: 'tpl-2', name: 'Hiện đại', description: 'Thiết kế hiện đại, nổi bật với nhà tuyển dụng', thumbnail: '', colors: ['#059669', '#10b981', '#6ee7b7'] },
  { id: 'tpl-3', name: 'Sáng tạo', description: 'Phù hợp ngành design, marketing', thumbnail: '', colors: ['#7c3aed', '#a855f7', '#c084fc'] },
  { id: 'tpl-4', name: 'Tối giản', description: 'Đơn giản, tập trung nội dung', thumbnail: '', colors: ['#1f2937', '#6b7280', '#d1d5db'] },
];

let MOCK_CVS: CV[] = [];

class CVService {
  async getCVs(): Promise<PaginationResponse<CV>> {
    if (API_CONFIG.USE_MOCK) {
      return {
        meta: { page: 1, pageSize: 20, pages: 1, total: MOCK_CVS.length },
        result: MOCK_CVS,
      };
    }
    const response = await api.get<ApiResponse<PaginationResponse<CV>>>(ENDPOINTS.CV.LIST);
    return response.data.data as PaginationResponse<CV>;
  }

  async getCVDetail(cvId: string): Promise<CV> {
    if (API_CONFIG.USE_MOCK) {
      const cv = MOCK_CVS.find(c => c.id === cvId);
      if (!cv) throw new Error('CV not found');
      return cv;
    }
    const response = await api.get<ApiResponse<CV>>(ENDPOINTS.CV.DETAIL(cvId));
    return response.data.data as CV;
  }

  async createCV(data: CreateCVRequest): Promise<CV> {
    if (API_CONFIG.USE_MOCK) {
      const newCV: CV = {
        id: 'cv-' + Date.now(),
        userId: '1',
        title: data.title,
        template: data.template,
        color: data.color,
        personalInfo: data.personalInfo,
        sections: data.sections || [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_CVS.push(newCV);
      return newCV;
    }
    const response = await api.post<ApiResponse<CV>>(ENDPOINTS.CV.CREATE, data);
    return response.data.data as CV;
  }

  async updateCV(cvId: string, data: UpdateCVRequest): Promise<CV> {
    if (API_CONFIG.USE_MOCK) {
      const idx = MOCK_CVS.findIndex(c => c.id === cvId);
      if (idx === -1) throw new Error('CV not found');
      MOCK_CVS[idx] = { ...MOCK_CVS[idx], ...data, updatedAt: new Date().toISOString() };
      return MOCK_CVS[idx];
    }
    const response = await api.put<ApiResponse<CV>>(ENDPOINTS.CV.UPDATE(cvId), data);
    return response.data.data as CV;
  }

  async deleteCV(cvId: string): Promise<ApiResponse<null>> {
    if (API_CONFIG.USE_MOCK) {
      MOCK_CVS = MOCK_CVS.filter(c => c.id !== cvId);
      return { statusCode: 200, message: 'Deleted' };
    }
    const response = await api.delete<ApiResponse<null>>(ENDPOINTS.CV.DELETE(cvId));
    return response.data;
  }

  async getTemplates(): Promise<CVTemplate[]> {
    if (API_CONFIG.USE_MOCK) {
      return MOCK_TEMPLATES;
    }
    const response = await api.get<ApiResponse<CVTemplate[]>>(ENDPOINTS.CV.TEMPLATES);
    return response.data.data as CVTemplate[];
  }

  async exportCV(data: ExportCVRequest): Promise<any> {
    if (API_CONFIG.USE_MOCK) {
      return { message: 'CV exported (mock)' };
    }
    const response = await api.post(ENDPOINTS.CV.EXPORT(data.cvId), data, { responseType: 'blob' });
    return response.data;
  }

  async shareCV(data: ShareCVRequest): Promise<ApiResponse<null>> {
    if (API_CONFIG.USE_MOCK) {
      return { statusCode: 200, message: 'CV shared (mock)' };
    }
    const response = await api.post<ApiResponse<null>>(ENDPOINTS.CV.SHARE(data.cvId), data);
    return response.data;
  }

  async getCVAnalytics(cvId: string): Promise<CVAnalytics> {
    if (API_CONFIG.USE_MOCK) {
      return { cvId, viewCount: 42, shareCount: 5, downloadCount: 12, ratings: [5, 4, 5, 4, 3] };
    }
    const response = await api.get<ApiResponse<CVAnalytics>>(ENDPOINTS.CV.ANALYTICS(cvId));
    return response.data.data as CVAnalytics;
  }
}

export const cvService = new CVService();
export default cvService;