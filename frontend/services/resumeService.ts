// Resume Service — mapped to Spring Boot ResumeController
import { API_CONFIG, ENDPOINTS } from '@constants/endpoints';
import { Resume } from '@/types/job.types';
import { MOCK_APPLICATIONS } from './mockData';
import api from './api';

class ResumeService {
  async createResume(data: { email: string; url: string; userId: number; jobId: number }): Promise<Resume> {
    if (API_CONFIG.USE_MOCK) {
      const newApp: Resume = {
        id: MOCK_APPLICATIONS.length + 1,
        email: data.email,
        url: data.url,
        status: 'PENDING',
        job: { id: data.jobId, name: 'Job' },
        user: { id: data.userId, name: 'User' },
        createdAt: new Date().toISOString(),
      };
      MOCK_APPLICATIONS.push(newApp);
      return newApp;
    }
    // Real API: POST /api/v1/resumes — { email, url, user: { id }, job: { id } }
    const response = await api.post(ENDPOINTS.RESUMES.CREATE, {
      email: data.email,
      url: data.url,
      user: { id: data.userId },
      job: { id: data.jobId },
    });
    return (response.data as any).data;
  }

  async getResumesByUser(): Promise<Resume[]> {
    if (API_CONFIG.USE_MOCK) {
      return MOCK_APPLICATIONS;
    }
    // Real API: POST /api/v1/resumes/by-user — { data: { meta, result } }
    const response = await api.post(`${ENDPOINTS.RESUMES.LIST}/by-user`);
    return (response.data as any).data?.result || [];
  }

  async updateResumeStatus(resumeId: number, status: string): Promise<Resume> {
    // Real API: PUT /api/v1/resumes — HR only
    const response = await api.put(ENDPOINTS.RESUMES.LIST, { id: resumeId, status });
    return (response.data as any).data;
  }
}

export const resumeService = new ResumeService();
export default resumeService;
