// Consolidated API service for the entire application
import config from '@/config';
import { 
  ApiResponse, 
  UploadResponse, 
  AnalysisResponse, 
  DashboardData, 
  PDFResponse, 
  UserPlan,
  KPIData,
  VisualizationData 
} from '@/types';
import { ErrorHandler } from '@/utils/errorHandler';

class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    userPlan: UserPlan = 'free'
  ): Promise<ApiResponse<T>> {
    const url = `${config.apiUrl}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'X-User-Plan': userPlan,
    };

    const requestConfig: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, requestConfig);
      const data = await response.json();

      if (!response.ok) {
        throw ErrorHandler.createApiError(
          response.status,
          data.message || `HTTP error! status: ${response.status}`,
          data
        );
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // File Upload
  static async uploadFile(file: File, userPlan: UserPlan = 'free'): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${config.apiUrl}/upload`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-User-Plan': userPlan,
          // Don't set Content-Type for FormData - let browser set it with boundary
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw ErrorHandler.createApiError(
          response.status,
          data.message || `HTTP error! status: ${response.status}`,
          data
        );
      }

      return data;
    } catch (error) {
      console.error('Upload request failed:', error);
      throw error;
    }
  }

  static async getFilePreview(fileId: string, userPlan: UserPlan = 'free'): Promise<ApiResponse<any>> {
    return this.request(`/upload/preview/${fileId}`, {
      method: 'GET',
    }, userPlan);
  }

  // Data Analysis
  static async analyzeData(fileId: string, userPlan: UserPlan = 'free'): Promise<ApiResponse<AnalysisResponse>> {
    return this.request<AnalysisResponse>('/analysis/analyze', {
      method: 'POST',
      body: JSON.stringify({ fileId, userPlan }),
    }, userPlan);
  }

  static async getKPISuggestions(fileId: string, userPlan: UserPlan = 'free'): Promise<ApiResponse<{ kpis: KPIData[] }>> {
    return this.request<{ kpis: KPIData[] }>('/analysis/kpis', {
      method: 'POST',
      body: JSON.stringify({ fileId, userPlan }),
    }, userPlan);
  }

  static async getVisualizationRecommendations(
    fileId: string,
    kpis: KPIData[],
    userPlan: UserPlan = 'free'
  ): Promise<ApiResponse<{ visualizations: VisualizationData[] }>> {
    return this.request<{ visualizations: VisualizationData[] }>('/analysis/visualizations', {
      method: 'POST',
      body: JSON.stringify({ fileId, kpis, userPlan }),
    }, userPlan);
  }

  // Dashboard Generation
  static async generateDashboard(
    fileId: string,
    analysis: any,
    kpis: KPIData[] = [],
    visualizations: VisualizationData[] = [],
    userPlan: UserPlan = 'free',
    customTitle?: string,
    customDescription?: string,
    theme: string = 'default'
  ): Promise<ApiResponse<{ dashboard: DashboardData }>> {
    return this.request<{ dashboard: DashboardData }>('/dashboard/generate', {
      method: 'POST',
      body: JSON.stringify({
        fileId,
        analysis,
        kpis,
        visualizations,
        userPlan,
        customTitle,
        customDescription,
        theme,
      }),
    }, userPlan);
  }

  static async getDashboardTemplate(templateId: string, userPlan: UserPlan = 'free'): Promise<ApiResponse<any>> {
    return this.request(`/dashboard/template/${templateId}?userPlan=${userPlan}`, {
      method: 'GET',
    }, userPlan);
  }

  static async saveDashboard(dashboardId: string, configuration: any, userPlan: UserPlan = 'free'): Promise<ApiResponse<any>> {
    return this.request('/dashboard/save', {
      method: 'POST',
      body: JSON.stringify({ dashboardId, configuration, userPlan }),
    }, userPlan);
  }

  // PDF Export
  static async generatePDF(dashboard: any, options: any = {}, userPlan: UserPlan = 'free'): Promise<ApiResponse<PDFResponse>> {
    return this.request<PDFResponse>('/pdf/generate', {
      method: 'POST',
      body: JSON.stringify({ dashboard, options }),
    }, userPlan);
  }

  static async downloadPDF(filename: string): Promise<Blob> {
    const response = await fetch(`${config.apiUrl}/pdf/download/${filename}`);

    if (!response.ok) {
      throw ErrorHandler.createApiError(
        response.status,
        `Failed to download PDF: ${response.statusText}`
      );
    }

    return response.blob();
  }

  static async getPDFTemplates(userPlan: UserPlan = 'free'): Promise<ApiResponse<any>> {
    return this.request(`/pdf/templates?userPlan=${userPlan}`, {
      method: 'GET',
    }, userPlan);
  }

  // Health Check
  static async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/health', {
      method: 'GET',
    });
  }
}

export default ApiService;