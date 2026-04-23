// AI Recommendation Service
import { Job } from '@/types/job.types';
import { MOCK_JOBS, MOCK_CURRENT_USER } from './mockData';

interface MatchResult {
  job: Job;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
}

class RecommendationService {
  /**
   * Calculate match score between user skills and job requirements
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
