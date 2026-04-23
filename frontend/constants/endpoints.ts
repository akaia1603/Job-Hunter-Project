// API Endpoints configuration — mapped to Spring Boot backend
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api',
  VERSION: 'v1',
  TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 30000,
  USE_MOCK: process.env.EXPO_PUBLIC_USE_MOCK !== 'false', // default true
};

export const ENDPOINTS = {
  // Auth endpoints (Spring: AuthController)
  AUTH: {
    LOGIN: '/auth/login',             // POST { username, password } → { access_token, user }
    REGISTER: '/auth/register',        // POST { email, password, name, ... }
    LOGOUT: '/auth/logout',            // POST
    REFRESH: '/auth/refresh',          // GET (reads cookie)
    ACCOUNT: '/auth/account',          // GET → { user }
  },

  // Job endpoints (Spring: JobController)
  JOBS: {
    LIST: '/jobs',                     // GET ?page=1&size=20&filter=...
    DETAIL: (id: number) => `/jobs/${id}`,  // GET
    CREATE: '/jobs',                   // POST
    UPDATE: '/jobs',                   // PUT
    DELETE: (id: number) => `/jobs/${id}`,  // DELETE
  },

  // Company endpoints (Spring: CompanyController)
  COMPANIES: {
    LIST: '/companies',                // GET ?page=1&size=20
    DETAIL: (id: number) => `/companies/${id}`, // GET
    CREATE: '/companies',              // POST
    UPDATE: '/companies',              // PUT
    DELETE: (id: number) => `/companies/${id}`, // DELETE
  },

  // Resume/Application endpoints (Spring: ResumeController)
  RESUMES: {
    LIST: '/resumes',                  // GET
    DETAIL: (id: number) => `/resumes/${id}`,
    CREATE: '/resumes',                // POST { email, url, user: {id}, job: {id} }
    UPDATE: '/resumes',                // PUT
    DELETE: (id: number) => `/resumes/${id}`,
  },

  // User endpoints (Spring: UserController)
  USERS: {
    LIST: '/users',
    DETAIL: (id: number) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: '/users',
    DELETE: (id: number) => `/users/${id}`,
  },

  // Skill endpoints (Spring: SkillController)
  SKILLS: {
    LIST: '/skills',
    CREATE: '/skills',
    UPDATE: '/skills',
    DELETE: (id: number) => `/skills/${id}`,
  },

  // Subscriber endpoints (Spring: SubscriberController)
  SUBSCRIBERS: {
    CREATE: '/subscribers',
    UPDATE: '/subscribers',
  },

  // File endpoints
  FILES: {
    UPLOAD: '/files',
  },

  // Profile (alias for current user)
  PROFILE: {
    GET: '/auth/account',
    CHANGE_PASSWORD: '/profile/change-password',
  },

  // Notifications (mock-only for now)
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
  },

  // CV endpoints (mock-only for now)
  CV: {
    LIST: '/cv',
    DETAIL: (id: string) => `/cv/${id}`,
    CREATE: '/cv',
    UPDATE: (id: string) => `/cv/${id}`,
    DELETE: (id: string) => `/cv/${id}`,
    TEMPLATES: '/cv/templates',
    EXPORT: (id: string) => `/cv/${id}/export`,
    SHARE: (id: string) => `/cv/${id}/share`,
    ANALYTICS: (id: string) => `/cv/${id}/analytics`,
  },
};

export default { API_CONFIG, ENDPOINTS };