// Company Service
import { Company, Job } from '@/types/job.types';
import { PaginationResponse } from '@/types/common.types';
import { API_CONFIG, ENDPOINTS } from '@constants/endpoints';
import { MOCK_COMPANIES, MOCK_JOBS } from './mockData';
import api from './api';

class CompanyService {
  async getCompanies(page = 1, size = 20): Promise<PaginationResponse<Company>> {
    if (API_CONFIG.USE_MOCK) {
      return {
        meta: { page, pageSize: size, pages: 1, total: MOCK_COMPANIES.length },
        result: MOCK_COMPANIES,
      };
    }
    const response = await api.get(ENDPOINTS.COMPANIES.LIST, { params: { page, size } });
    return (response.data as any).data;
  }

  async getCompanyDetail(id: number): Promise<Company> {
    if (API_CONFIG.USE_MOCK) {
      const company = MOCK_COMPANIES.find(c => c.id === id);
      if (!company) throw new Error('Company not found');
      return company;
    }
    const response = await api.get(ENDPOINTS.COMPANIES.DETAIL(id));
    return (response.data as any).data;
  }

  async getCompanyJobs(companyId: number): Promise<Job[]> {
    if (API_CONFIG.USE_MOCK) {
      return MOCK_JOBS.filter(j => j.company.id === companyId);
    }
    const response = await api.get(ENDPOINTS.JOBS.LIST, {
      params: { filter: `company.id=${companyId}` },
    });
    return (response.data as any).data?.result || [];
  }

  async getTopCompanies(): Promise<Company[]> {
    if (API_CONFIG.USE_MOCK) {
      return MOCK_COMPANIES
        .filter(c => c.isPremium)
        .sort((a, b) => (b.jobCount || 0) - (a.jobCount || 0))
        .slice(0, 6);
    }
    const response = await api.get(ENDPOINTS.COMPANIES.LIST, {
      params: { page: 1, size: 6, sort: 'createdAt,desc' },
    });
    return (response.data as any).data?.result || [];
  }
}

export const companyService = new CompanyService();
export default companyService;
