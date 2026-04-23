// Job Service — with mock/real API adapter
import { Job, JobListRequest, Resume } from '@/types/job.types';
import { PaginationResponse } from '@/types/common.types';
import { API_CONFIG, ENDPOINTS } from '@constants/endpoints';
import { MOCK_JOBS, MOCK_APPLICATIONS, MOCK_SAVED_JOB_IDS } from './mockData';
import api from './api';

class JobService {
  private savedJobIds: number[] = [...MOCK_SAVED_JOB_IDS];

  async getJobs(params: JobListRequest): Promise<PaginationResponse<Job>> {
    if (API_CONFIG.USE_MOCK) {
      let filtered = [...MOCK_JOBS].filter(j => j.active);

      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(j =>
          j.name.toLowerCase().includes(q) ||
          j.company.name.toLowerCase().includes(q) ||
          j.skills.some(s => s.name.toLowerCase().includes(q))
        );
      }
      if (params.location) {
        filtered = filtered.filter(j =>
          j.location.toLowerCase().includes(params.location!.toLowerCase())
        );
      }
      if (params.level) {
        filtered = filtered.filter(j => j.level === params.level);
      }
      if (params.salaryMin) {
        filtered = filtered.filter(j => j.salary >= params.salaryMin!);
      }
      if (params.salaryMax) {
        filtered = filtered.filter(j => j.salary <= params.salaryMax!);
      }

      // Mark saved jobs
      filtered = filtered.map(j => ({
        ...j,
        isSaved: this.savedJobIds.includes(j.id),
      }));

      const page = params.page || 1;
      const size = params.size || 20;
      const start = (page - 1) * size;
      const paged = filtered.slice(start, start + size);

      return {
        meta: {
          page,
          pageSize: size,
          pages: Math.ceil(filtered.length / size),
          total: filtered.length,
        },
        result: paged,
      };
    }

    const response = await api.get(ENDPOINTS.JOBS.LIST, { params });
    return (response.data as any).data;
  }

  async getJobDetail(jobId: number): Promise<Job> {
    if (API_CONFIG.USE_MOCK) {
      const job = MOCK_JOBS.find(j => j.id === jobId);
      if (!job) throw new Error('Job not found');
      return { ...job, isSaved: this.savedJobIds.includes(job.id) };
    }
    const response = await api.get(ENDPOINTS.JOBS.DETAIL(jobId));
    return (response.data as any).data;
  }

  async getPremiumJobs(): Promise<Job[]> {
    if (API_CONFIG.USE_MOCK) {
      return MOCK_JOBS.filter(j => j.isPremium && j.active)
        .map(j => ({ ...j, isSaved: this.savedJobIds.includes(j.id) }));
    }
    const response = await api.get(ENDPOINTS.JOBS.LIST, {
      params: { page: 1, size: 10 },
    });
    return (response.data as any).data?.result || [];
  }

  async getLatestJobs(limit = 10): Promise<Job[]> {
    if (API_CONFIG.USE_MOCK) {
      return MOCK_JOBS
        .filter(j => j.active)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit)
        .map(j => ({ ...j, isSaved: this.savedJobIds.includes(j.id) }));
    }
    const response = await api.get(ENDPOINTS.JOBS.LIST, {
      params: { page: 1, size: limit, sort: 'createdAt,desc' },
    });
    return (response.data as any).data?.result || [];
  }

  async getSavedJobs(): Promise<Job[]> {
    if (API_CONFIG.USE_MOCK) {
      return MOCK_JOBS.filter(j => this.savedJobIds.includes(j.id))
        .map(j => ({ ...j, isSaved: true }));
    }
    // Real API would need a saved-jobs endpoint
    return [];
  }

  async saveJob(jobId: number): Promise<void> {
    if (!this.savedJobIds.includes(jobId)) {
      this.savedJobIds.push(jobId);
    }
  }

  async unsaveJob(jobId: number): Promise<void> {
    this.savedJobIds = this.savedJobIds.filter(id => id !== jobId);
  }

  async isJobSaved(jobId: number): Promise<boolean> {
    return this.savedJobIds.includes(jobId);
  }

  // Applications (Resumes in Spring)
  async applyJob(data: { jobId: number; email: string; url: string }): Promise<Resume> {
    if (API_CONFIG.USE_MOCK) {
      const newApp: Resume = {
        id: MOCK_APPLICATIONS.length + 1,
        email: data.email,
        url: data.url,
        status: 'PENDING',
        job: { id: data.jobId, name: MOCK_JOBS.find(j => j.id === data.jobId)?.name || '' },
        user: { id: 1, name: 'Demo User' },
        createdAt: new Date().toISOString(),
        createdBy: data.email,
      };
      MOCK_APPLICATIONS.push(newApp);
      return newApp;
    }
    const response = await api.post(ENDPOINTS.RESUMES.CREATE, {
      email: data.email,
      url: data.url,
      user: { id: 1 },
      job: { id: data.jobId },
    });
    return (response.data as any).data;
  }

  async getApplications(): Promise<Resume[]> {
    if (API_CONFIG.USE_MOCK) {
      return MOCK_APPLICATIONS;
    }
    const response = await api.get(ENDPOINTS.RESUMES.LIST);
    return (response.data as any).data?.result || [];
  }
}

export const jobService = new JobService();
export default jobService;