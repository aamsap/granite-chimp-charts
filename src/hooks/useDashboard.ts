import { useState, useCallback } from 'react';
import ApiService, { UploadResponse, AnalysisResponse } from '@/lib/api';

export interface DashboardData {
    id?: string;
    title: string;
    description: string;
    dataType?: string;
    confidence?: number;
    processingTime?: number;
    timestamp?: string;
}

export interface KPIData {
    id: string;
    name: string;
    description: string;
    type: string;
    column: string;
    category: string;
}

export interface VisualizationData {
    id: string;
    type: string;
    title: string;
    description: string;
    xAxis?: string;
    yAxis?: string;
    dataKey?: string;
    data: any[];
    recommended: boolean;
}

export interface InsightData {
    type: string;
    title: string;
    description: string;
    confidence: number;
}

export const useDashboard = () => {
    const [fileId, setFileId] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<{
        dataType: string;
        insights: InsightData[];
        confidence: number;
        processingTime: number;
        timestamp: string;
    } | null>(null);
    const [kpis, setKpis] = useState<KPIData[]>([]);
    const [visualizations, setVisualizations] = useState<VisualizationData[]>([]);
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = useCallback(async (file: File, userPlan: string = 'free') => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('📤 Uploading file:', file.name);
            const response: UploadResponse = await ApiService.uploadFile(file);

            console.log('✅ Upload successful:', response);
            const newFileId = response.data.fileId;
            setFileId(newFileId);

            // Auto-analyze after upload with the new fileId
            setIsLoading(true);
            console.log('🔍 Analyzing data with Granite AI...');
            const analysisResponse: AnalysisResponse = await ApiService.analyzeData(newFileId, userPlan);

            console.log('✅ Analysis successful:', analysisResponse);

            const analysisData = analysisResponse.data.analysis;

            // Set analysis data
            setAnalysis({
                dataType: analysisData.dataType,
                insights: analysisData.insights,
                confidence: analysisData.confidence,
                processingTime: analysisData.processingTime,
                timestamp: analysisData.timestamp
            });

            // Set KPIs
            setKpis(analysisData.kpis);

            // Set visualizations
            setVisualizations(analysisData.visualizations);

            // Set dashboard
            setDashboard({
                id: newFileId,
                title: analysisData.dashboard.title,
                description: analysisData.dashboard.description,
                dataType: analysisData.dataType,
                confidence: analysisData.confidence,
                processingTime: analysisData.processingTime,
                timestamp: analysisData.timestamp
            });

        } catch (err) {
            console.error('❌ Upload/Analysis failed:', err);
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const analyzeData = useCallback(async (userPlan: string = 'free') => {
        if (!fileId) {
            setError('No file uploaded');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log('🔍 Analyzing data with Granite AI...');
            const response: AnalysisResponse = await ApiService.analyzeData(fileId, userPlan);

            console.log('✅ Analysis successful:', response);

            const analysisData = response.data.analysis;

            // Set analysis data
            setAnalysis({
                dataType: analysisData.dataType,
                insights: analysisData.insights,
                confidence: analysisData.confidence,
                processingTime: analysisData.processingTime,
                timestamp: analysisData.timestamp
            });

            // Set KPIs
            setKpis(analysisData.kpis);

            // Set visualizations
            setVisualizations(analysisData.visualizations);

            // Set dashboard
            setDashboard({
                id: fileId,
                title: analysisData.dashboard.title,
                description: analysisData.dashboard.description,
                dataType: analysisData.dataType,
                confidence: analysisData.confidence,
                processingTime: analysisData.processingTime,
                timestamp: analysisData.timestamp
            });

        } catch (err) {
            console.error('❌ Analysis failed:', err);
            setError(err instanceof Error ? err.message : 'Analysis failed');
        } finally {
            setIsLoading(false);
        }
    }, [fileId]);

    const generateKPIs = useCallback(async (userPlan: string = 'free') => {
        if (!fileId) return;

        try {
            const response = await ApiService.getKPIs(fileId, userPlan);
            setKpis(response.data.kpis);
        } catch (err) {
            console.error('KPI generation failed:', err);
        }
    }, [fileId]);

    const generateVisualizations = useCallback(async (userPlan: string = 'free') => {
        if (!fileId || kpis.length === 0) return;

        try {
            const response = await ApiService.getVisualizations(fileId, kpis, userPlan);
            setVisualizations(response.data.visualizations);
        } catch (err) {
            console.error('Visualization generation failed:', err);
        }
    }, [fileId, kpis]);

    const generateDashboard = useCallback(async (options: { userPlan: string }) => {
        if (!analysis) return;

        const dashboardData: DashboardData = {
            id: fileId || undefined,
            title: analysis.dataType ? `${analysis.dataType} Dashboard` : 'Data Dashboard',
            description: `AI-powered analysis of your ${analysis.dataType || 'data'} with insights from Granite AI.`,
            dataType: analysis.dataType,
            confidence: analysis.confidence,
            processingTime: analysis.processingTime,
            timestamp: analysis.timestamp
        };

        setDashboard(dashboardData);
    }, [analysis, fileId]);

    const generatePDF = useCallback(async (userPlan: string = 'free') => {
        if (!dashboard || !analysis || !kpis || !visualizations) {
            setError('Dashboard data incomplete for PDF generation');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Prepare dashboard data for PDF generation
            const pdfDashboardData = {
                id: dashboard.id,
                title: dashboard.title,
                description: dashboard.description,
                dataType: analysis.dataType,
                confidence: analysis.confidence,
                processingTime: analysis.processingTime,
                timestamp: analysis.timestamp,
                kpis: kpis,
                visualizations: visualizations.filter(viz => viz.recommended), // Only recommended visualizations
                metadata: {
                    generatedAt: new Date().toISOString(),
                    dataSource: {
                        rowCount: rawData?.length || 0,
                        columnCount: rawData?.[0] ? Object.keys(rawData[0]).length : 0
                    },
                    analysis: {
                        insights: analysis.insights
                    }
                }
            };

            const response = await ApiService.generatePDF(pdfDashboardData, userPlan);

            if (response.data.success) {
                // Return the PDF URL for download
                return response.data.data.pdfUrl;
            } else {
                throw new Error(response.data.message || 'PDF generation failed');
            }
        } catch (err: any) {
            console.error('PDF generation failed:', err);
            setError(err.response?.data?.message || err.message || 'Failed to generate PDF');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [dashboard, analysis, kpis, visualizations, rawData]);

    const resetDashboard = useCallback(() => {
        setFileId(null);
        setAnalysis(null);
        setKpis([]);
        setVisualizations([]);
        setDashboard(null);
        setError(null);
    }, []);

    return {
        fileId,
        analysis,
        kpis,
        visualizations,
        dashboard,
        isLoading,
        error,
        uploadFile,
        analyzeData,
        generateKPIs,
        generateVisualizations,
        generateDashboard,
        generatePDF,
        resetDashboard
    };
};