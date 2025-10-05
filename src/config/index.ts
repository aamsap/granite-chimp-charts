// Centralized configuration for the application

export interface AppConfig {
  apiUrl: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  freePlanLimits: {
    maxRows: number;
    maxKPIs: number;
    maxVisualizations: number;
  };
  proPlanLimits: {
    maxRows: number;
    maxKPIs: number;
    maxVisualizations: number;
  };
}

const config: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['.csv', '.xls', '.xlsx'],
  freePlanLimits: {
    maxRows: 1000,
    maxKPIs: 5,
    maxVisualizations: 3,
  },
  proPlanLimits: {
    maxRows: -1, // unlimited
    maxKPIs: -1, // unlimited
    maxVisualizations: -1, // unlimited
  },
};

export default config;