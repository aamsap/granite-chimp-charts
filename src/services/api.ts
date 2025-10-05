// Consolidated API service for the entire application
import config from '@/config';
import { 
  ApiResponse, 
  UploadResponse, 
  AnalysisResponse, 
  DashboardData, 
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

    const url = `${config.apiUrl}/api/upload`;

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
    // Mock response for serverless - file preview not implemented yet
    return Promise.resolve({
      success: true,
      data: {
        id: fileId,
        filename: 'preview.csv',
        size: 1024,
        type: '.csv',
        preview: [
          { Date: '2024-01-01', Revenue: 1000, Quantity: 10, Product: 'A' },
          { Date: '2024-01-02', Revenue: 1500, Quantity: 15, Product: 'B' }
        ]
      }
    });
  }

  // Data Analysis
  static async analyzeData(fileId: string, userPlan: UserPlan = 'free'): Promise<ApiResponse<AnalysisResponse>> {
    return this.request<AnalysisResponse>('/api/analysis', {
      method: 'POST',
      body: JSON.stringify({ fileId, userPlan }),
    }, userPlan);
  }

  static async getKPISuggestions(fileId: string, userPlan: UserPlan = 'free'): Promise<ApiResponse<{ kpis: KPIData[] }>> {
    // Mock response for serverless - KPI suggestions not implemented yet
    return Promise.resolve({
      success: true,
      kpis: [
        {
          id: 'kpi-1',
          name: 'Total Revenue',
          description: 'Sum of all Revenue values',
          type: 'sum',
          column: 'Revenue',
          category: 'financial'
        },
        {
          id: 'kpi-2',
          name: 'Average Revenue',
          description: 'Average value of Revenue',
          type: 'average',
          column: 'Revenue',
          category: 'statistical'
        }
      ]
    });
  }

  static async getVisualizationRecommendations(
    fileId: string,
    kpis: KPIData[],
    userPlan: UserPlan = 'free'
  ): Promise<ApiResponse<{ visualizations: VisualizationData[] }>> {
    // Mock response for serverless - visualization recommendations not implemented yet
    return Promise.resolve({
      success: true,
      visualizations: [
        {
          id: 'viz-1',
          title: 'Distribution by Date',
          type: 'bar',
          xAxis: 'Date',
          yAxis: 'count',
          recommended: true
        },
        {
          id: 'viz-2',
          title: 'Trend of Revenue',
          type: 'line',
          xAxis: 'index',
          yAxis: 'Revenue',
          recommended: true
        }
      ]
    });
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
    return this.request<{ dashboard: DashboardData }>('/api/dashboard', {
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
    // Mock response for serverless - dashboard templates not implemented yet
    return Promise.resolve({
      success: true,
      template: {
        id: templateId,
        name: 'Default Template',
        description: 'Default dashboard template',
        kpis: [],
        visualizations: []
      }
    });
  }

  static async saveDashboard(dashboardId: string, configuration: any, userPlan: UserPlan = 'free'): Promise<ApiResponse<any>> {
    // Mock response for serverless - dashboard saving not implemented yet
    return Promise.resolve({
      success: true,
      message: 'Dashboard saved successfully',
      dashboardId: dashboardId
    });
  }

  // PDF Export - REMOVED
  // Use browser print functionality instead

  // Health Check
  static async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/api/health', {
      method: 'GET',
    });
  }
}

export default ApiService;