// Shared types and interfaces for the entire application

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: any;
}

// File Upload Types
export interface UploadResponse {
  fileName: string;
  filePath: string;
  headers: string[];
  rowCount: number;
  columnCount: number;
  preview: any[];
  fileId: string;
}

// Analysis Types
export interface InsightData {
  type: string;
  title: string;
  description: string;
  confidence: number;
}

export interface KPIData {
  id: string;
  name: string;
  description: string;
  type: 'sum' | 'average' | 'count' | 'max' | 'min';
  column: string;
  category: 'financial' | 'statistical' | 'categorical';
}

export interface VisualizationData {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
  title: string;
  description: string;
  xAxis?: string;
  yAxis?: string;
  dataKey?: string;
  data: any[];
  recommended: boolean;
}

export interface AnalysisData {
  dataType: string;
  insights: InsightData[];
  kpis: KPIData[];
  visualizations: VisualizationData[];
  dashboard: {
    title: string;
    description: string;
  };
  confidence: number;
  processingTime: number;
  timestamp: string;
}

export interface AnalysisResponse {
  fileId: string;
  analysis: AnalysisData;
  timestamp: string;
}

// Dashboard Types
export interface DashboardData {
  id: string;
  title: string;
  description: string;
  dataType: string;
  confidence: number;
  processingTime: number;
  timestamp: string;
  insights: InsightData[];
  kpis: KPIData[];
  visualizations: VisualizationData[];
  rawData: any[];
}

// PDF Types - REMOVED
// Use browser print functionality instead

// User Plan Types
export type UserPlan = 'free' | 'pro';

// Component Props Types
export interface DashboardProps {
  title: string;
  description: string;
  dataType: string;
  confidence: number;
  processingTime: number;
  insights: InsightData[];
  kpis: KPIData[];
  visualizations: VisualizationData[];
  rawData?: any[];
}

export interface KPICardProps {
  title: string;
  value: number | string;
  description: string;
  icon?: React.ReactNode;
}

export interface ChartProps {
  data: any[];
  title: string;
  description: string;
  className?: string;
}

export interface BarChartProps extends ChartProps {
  xAxisKey: string;
  yAxisKey: string;
}

export interface LineChartProps extends ChartProps {
  xAxisKey: string;
  yAxisKey: string;
}

export interface PieChartProps extends ChartProps {
  dataKey: string;
  nameKey: string;
}

export interface AreaChartProps extends ChartProps {
  xAxisKey: string;
  yAxisKey: string;
}

export interface ScatterChartProps extends ChartProps {
  xAxisKey: string;
  yAxisKey: string;
}

// Hook Types
export interface UseDashboardReturn {
  fileId: string | null;
  analysis: AnalysisData | null;
  kpis: KPIData[];
  calculatedKPIs?: any[]; // Will be CalculatedKPI[] from kpiCalculator
  visualizations: VisualizationData[];
  dashboard: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  uploadFile: (file: File, userPlan?: UserPlan) => Promise<void>;
  analyzeData: (userPlan?: UserPlan) => Promise<void>;
  generateKPIs: (userPlan?: UserPlan) => Promise<void>;
  generateVisualizations: (userPlan?: UserPlan) => Promise<void>;
  generateDashboard: (options: { userPlan: UserPlan }) => Promise<void>;
  generatePDF: (userPlan?: UserPlan) => Promise<string | null>; // DEPRECATED - use print instead
  resetDashboard: () => void;
}

// Error Types
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}