// AI Recommendation Service — Real API with local fallback
import { Job } from '@/types/job.types';
import { API_CONFIG, ENDPOINTS } from '@constants/endpoints';
import { MOCK_JOBS, MOCK_CURRENT_USER } from './mockData';
import api from './api';

interface MatchResult {
  job: Job;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
}

class RecommendationService {
  /**
   * Calculate match score between user skills and job requirements (local fallback)
   */
  private calculateMatch(userSkills: string[], jobSkills: string[]): {
    score: number;
    matched: string[];
    missing: string[];
  } {
    const normalizedUserSkills = userSkills.map(s => s.toLowerCase());
    const matched: string[] = [];
    const missing: string[] = [];

    jobSkills.forEach(skill => {
      if (normalizedUserSkills.includes(skill.toLowerCase())) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const score = jobSkills.length > 0
      ? Math.round((matched.length / jobSkills.length) * 100)
      : 50; // default score if no skills listed

    return { score, matched, missing };
  }

  /**
   * Get AI-recommended jobs sorted by match score
   */
  async getRecommendedJobs(): Promise<MatchResult[]> {
    if (!API_CONFIG.USE_MOCK) {
      try {
        // Real API: GET /api/v1/jobs/recommend
        // FormatRestResponse wraps: { statusCode, data: [{ matchScore, job, matchedSkills, ... }], message }
        const response = await api.get(ENDPOINTS.RECOMMENDATIONS.LIST);
        const recommendations = (response.data as any).data || [];
        
        return recommendations.map((rec: any) => ({
          job: { ...rec.job, matchScore: rec.matchScore },
          matchScore: rec.matchScore || 0,
          matchedSkills: rec.matchedSkills || [],
          missingSkills: rec.missingSkills || [],
          reasons: rec.reasons || [],
        }));
      } catch (error) {
        console.warn('Recommendation API failed, falling back to local:', error);
        // Fall through to local calculation
      }
    }

    // Local fallback using mock data
    const userSkills = MOCK_CURRENT_USER.skills || [];

    const results: MatchResult[] = MOCK_JOBS
      .filter(job => job.active)
      .map(job => {
        const jobSkillNames = job.skills.map(s => s.name);
        const { score, matched, missing } = this.calculateMatch(userSkills, jobSkillNames);

        const reasons: string[] = [];
        if (score >= 80) reasons.push('Kỹ năng rất phù hợp');
        if (score >= 60 && score < 80) reasons.push('Kỹ năng khá phù hợp');
        if (job.location === MOCK_CURRENT_USER.address?.split(',')[0]?.trim()) {
          reasons.push('Gần khu vực bạn');
        }
        if (job.isPremium) reasons.push('Công ty uy tín');
        if (job.salary >= 30000000) reasons.push('Mức lương hấp dẫn');

        return {
          job: { ...job, matchScore: score },
          matchScore: score,
          matchedSkills: matched,
          missingSkills: missing,
          reasons,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    return results;
  }

  /**
   * Get match score for a specific job
   */
  async getMatchScore(jobId: number): Promise<MatchResult | null> {
    if (!API_CONFIG.USE_MOCK) {
      try {
        // Try to get from recommendations list
        const recommendations = await this.getRecommendedJobs();
        const match = recommendations.find(r => r.job.id === jobId);
        if (match) return match;
      } catch (error) {
        // Fall through to local
      }
    }

    // Local fallback
    const job = MOCK_JOBS.find(j => j.id === jobId);
    if (!job) return null;

    const userSkills = MOCK_CURRENT_USER.skills || [];
    const jobSkillNames = job.skills.map(s => s.name);
    const { score, matched, missing } = this.calculateMatch(userSkills, jobSkillNames);

    const reasons: string[] = [];
    if (score >= 80) reasons.push('Kỹ năng rất phù hợp');
    if (matched.length > 0) reasons.push(`Match ${matched.length}/${jobSkillNames.length} skills`);

    return {
      job: { ...job, matchScore: score },
      matchScore: score,
      matchedSkills: matched,
      missingSkills: missing,
      reasons,
    };
  }

  /**
   * Get similar jobs based on skills
   */
  async getSimilarJobs(jobId: number, limit = 4): Promise<Job[]> {
    const currentJob = MOCK_JOBS.find(j => j.id === jobId);
    if (!currentJob) return [];

    const currentSkillIds = currentJob.skills.map(s => s.id);

    return MOCK_JOBS
      .filter(j => j.id !== jobId && j.active)
      .map(job => {
        const commonSkills = job.skills.filter(s => currentSkillIds.includes(s.id));
        return { ...job, matchScore: commonSkills.length * 25 };
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, limit);
  }
}

export const recommendationService = new RecommendationService();
export default recommendationService;
