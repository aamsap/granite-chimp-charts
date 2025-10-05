const API_BASE_URL = 'http://localhost:3001/api';

export interface UploadResponse {
    success: boolean;
    message: string;
    data: {
        fileName: string;
        filePath: string;
        headers: string[];
        rowCount: number;
        columnCount: number;
        preview: any[];
        fileId: string;
    };
}

export interface AnalysisResponse {
    success: boolean;
    message: string;
    data: {
        fileId: string;
        analysis: {
            dataType: string;
            insights: Array<{
                type: string;
                title: string;
                description: string;
                confidence: number;
            }>;
            kpis: Array<{
                id: string;
                name: string;
                description: string;
                type: string;
                column: string;
                category: string;
            }>;
            visualizations: Array<{
                id: string;
                type: string;
                title: string;
                description: string;
                xAxis?: string;
                yAxis?: string;
                dataKey?: string;
                data: any[];
                recommended: boolean;
            }>;
            dashboard: {
                title: string;
                description: string;
            };
            confidence: number;
            processingTime: number;
            timestamp: string;
        };
        timestamp: string;
    };
}

export class ApiService {
    private static async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    static async uploadFile(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Upload failed: ${response.status}`);
        }

        return response.json();
    }

    static async analyzeData(fileId: string, userPlan: string = 'free'): Promise<AnalysisResponse> {
        return this.request<AnalysisResponse>('/analysis/analyze', {
            method: 'POST',
            body: JSON.stringify({ fileId, userPlan }),
        });
    }

    static async getKPIs(fileId: string, userPlan: string = 'free') {
        return this.request('/analysis/kpis', {
            method: 'POST',
            body: JSON.stringify({ fileId, userPlan }),
        });
    }

    static async getVisualizations(fileId: string, kpis: any[], userPlan: string = 'free') {
        return this.request('/analysis/visualizations', {
            method: 'POST',
            body: JSON.stringify({ fileId, kpis, userPlan }),
        });
    }

    static async generatePDF(dashboardData: any) {
        return this.request('/pdf/generate', {
            method: 'POST',
            body: JSON.stringify(dashboardData),
        });
    }

    static async getFilePreview(fileId: string) {
        return this.request(`/upload/preview/${fileId}`);
    }
}

export default ApiService;
