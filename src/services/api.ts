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
import * as XLSX from 'xlsx';

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
      
      // Check if response is ok before parsing JSON
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        
        throw ErrorHandler.createApiError(
          response.status,
          errorMessage,
          { status: response.status, statusText: response.statusText }
        );
      }

      // Parse JSON only if response is ok
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // File Upload - Client-side parsing
  static async uploadFile(file: File, userPlan: UserPlan = 'free'): Promise<ApiResponse<UploadResponse>> {
    // Parse file based on type
    const parsedData = await this.parseFile(file);
    
    const url = `${config.apiUrl}/upload`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Plan': userPlan,
        },
        body: JSON.stringify({
          parsedData: parsedData,
          filename: file.name,
          fileType: '.' + file.name.split('.').pop()
        }),
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          errorMessage = response.statusText || errorMessage;
        }
        
        throw ErrorHandler.createApiError(
          response.status,
          errorMessage,
          { status: response.status, statusText: response.statusText }
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Upload request failed:', error);
      throw error;
    }
  }

  // Client-side file parsing (CSV and Excel)
  private static async parseFile(file: File): Promise<any[]> {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === '.csv') {
      return this.parseCSVFile(file);
    } else if (fileExtension === '.xls' || fileExtension === '.xlsx') {
      return this.parseExcelFile(file);
    } else {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  }

  // Client-side CSV parsing
  private static async parseCSVFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length === 0) {
            reject(new Error('Empty file'));
            return;
          }

          // Parse headers
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          
          // Parse data rows
          const data = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            if (values.length === headers.length) {
              const row: any = {};
              headers.forEach((header, index) => {
                row[header] = values[index];
              });
              data.push(row);
            }
          }
          
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Client-side Excel parsing
  private static async parseExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const fileData = e.target?.result;
          const workbook = XLSX.read(fileData, { type: 'binary' });
          
          // Get the first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            reject(new Error('Empty Excel file'));
            return;
          }
          
          // Convert to object format (same as CSV)
          const headers = jsonData[0] as string[];
          const excelData = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row && row.length === headers.length) {
              const rowObj: any = {};
              headers.forEach((header, index) => {
                rowObj[header] = row[index];
              });
              excelData.push(rowObj);
            }
          }
          
          resolve(excelData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsBinaryString(file);
    });
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
  static async analyzeData(fileId: string, userPlan: UserPlan = 'free', uploadedData?: any[]): Promise<ApiResponse<AnalysisResponse>> {
    return this.request<AnalysisResponse>('/analysis', {
      method: 'POST',
      body: JSON.stringify({ fileId, userPlan, uploadedData }),
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
    theme: string = 'default',
    uploadedData?: any[]
  ): Promise<ApiResponse<{ dashboard: DashboardData }>> {
    return this.request<{ dashboard: DashboardData }>('/dashboard', {
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
        uploadedData,
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