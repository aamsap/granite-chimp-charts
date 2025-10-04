// API service for Chimp Chart backend integration

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    details?: any;
}

interface UploadResponse {
    fileName: string;
    filePath: string;
    headers: string[];
    rowCount: number;
    columnCount: number;
    preview: any[];
    fileId: string;
}

interface AnalysisResponse {
    fileId: string;
    analysis: {
        dataType: string;
        insights: Array<{
            type: string;
            title: string;
            description: string;
            confidence: number;
        }>;
        confidence: number;
        processingTime: number;
    };
    timestamp: string;
}

interface KPIsResponse {
    fileId: string;
    kpis: Array<{
        id: string;
        name: string;
        description: string;
        type: string;
        column: string;
        category: string;
    }>;
    timestamp: string;
}

interface VisualizationsResponse {
    fileId: string;
    visualizations: Array<{
        id: string;
        type: string;
        title: string;
        description: string;
        xAxis: string;
        yAxis: string;
        data: any[];
        recommended: boolean;
    }>;
    timestamp: string;
}

interface DashboardResponse {
    dashboard: {
        id: string;
        title: string;
        description: string;
        theme: string;
        userPlan: string;
        metadata: any;
        layout: any;
        kpis: any[];
        visualizations: any[];
        configuration: any;
    };
    fileId: string;
    timestamp: string;
}

interface PDFResponse {
    pdfUrl: string;
    filename: string;
    size: number;
    timestamp: string;
}

class ApiService {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        userPlan: string = 'free'
    ): Promise<ApiResponse<T>> {
        const url = `${API_BASE_URL}${endpoint}`;

        const defaultHeaders = {
            'Content-Type': 'application/json',
            'X-User-Plan': userPlan,
        };

        const config: RequestInit = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // File Upload
    async uploadFile(file: File, userPlan: string = 'free'): Promise<ApiResponse<UploadResponse>> {
        const formData = new FormData();
        formData.append('file', file);

        return this.request<UploadResponse>('/upload', {
            method: 'POST',
            headers: {
                'X-User-Plan': userPlan,
            },
            body: formData,
        }, userPlan);
    }

    async getFilePreview(fileId: string, userPlan: string = 'free'): Promise<ApiResponse<any>> {
        return this.request(`/upload/preview/${fileId}`, {
            method: 'GET',
        }, userPlan);
    }

    // Data Analysis
    async analyzeData(fileId: string, userPlan: string = 'free'): Promise<ApiResponse<AnalysisResponse>> {
        return this.request<AnalysisResponse>('/analysis/analyze', {
            method: 'POST',
            body: JSON.stringify({ fileId, userPlan }),
        }, userPlan);
    }

    async getKPISuggestions(fileId: string, userPlan: string = 'free'): Promise<ApiResponse<KPIsResponse>> {
        return this.request<KPIsResponse>('/analysis/kpis', {
            method: 'POST',
            body: JSON.stringify({ fileId, userPlan }),
        }, userPlan);
    }

    async getVisualizationRecommendations(
        fileId: string,
        kpis: any[],
        userPlan: string = 'free'
    ): Promise<ApiResponse<VisualizationsResponse>> {
        return this.request<VisualizationsResponse>('/analysis/visualizations', {
            method: 'POST',
            body: JSON.stringify({ fileId, kpis, userPlan }),
        }, userPlan);
    }

    // Dashboard Generation
    async generateDashboard(
        fileId: string,
        analysis: any,
        kpis: any[] = [],
        visualizations: any[] = [],
        userPlan: string = 'free',
        customTitle?: string,
        customDescription?: string,
        theme: string = 'default'
    ): Promise<ApiResponse<DashboardResponse>> {
        return this.request<DashboardResponse>('/dashboard/generate', {
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

    async getDashboardTemplate(templateId: string, userPlan: string = 'free'): Promise<ApiResponse<any>> {
        return this.request(`/dashboard/template/${templateId}?userPlan=${userPlan}`, {
            method: 'GET',
        }, userPlan);
    }

    async saveDashboard(dashboardId: string, configuration: any, userPlan: string = 'free'): Promise<ApiResponse<any>> {
        return this.request('/dashboard/save', {
            method: 'POST',
            body: JSON.stringify({ dashboardId, configuration, userPlan }),
        }, userPlan);
    }

    // PDF Export
    async generatePDF(dashboard: any, options: any = {}, userPlan: string = 'free'): Promise<ApiResponse<PDFResponse>> {
        return this.request<PDFResponse>('/pdf/generate', {
            method: 'POST',
            body: JSON.stringify({ dashboard, options }),
        }, userPlan);
    }

    async downloadPDF(filename: string): Promise<Blob> {
        const response = await fetch(`${API_BASE_URL}/pdf/download/${filename}`);

        if (!response.ok) {
            throw new Error(`Failed to download PDF: ${response.statusText}`);
        }

        return response.blob();
    }

    async getPDFTemplates(userPlan: string = 'free'): Promise<ApiResponse<any>> {
        return this.request(`/pdf/templates?userPlan=${userPlan}`, {
            method: 'GET',
        }, userPlan);
    }

    // Health Check
    async healthCheck(): Promise<ApiResponse<any>> {
        return this.request('/health', {
            method: 'GET',
        });
    }
}

export const apiService = new ApiService();
export default apiService;
