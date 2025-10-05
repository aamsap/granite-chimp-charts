// Consolidated dashboard state management hook
import { useState, useCallback } from 'react';
import ApiService from '@/services/api';
import { 
  UseDashboardReturn, 
  DashboardData, 
  AnalysisData, 
  KPIData, 
  VisualizationData, 
  UserPlan 
} from '@/types';
import { KPICalculator, CalculatedKPI } from '@/utils/kpiCalculator';
import { DashboardStorage } from '@/lib/dashboardStorage';
import { ErrorHandler } from '@/utils/errorHandler';

export const useDashboard = (): UseDashboardReturn => {
  const [fileId, setFileId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [calculatedKPIs, setCalculatedKPIs] = useState<CalculatedKPI[]>([]);
  const [visualizations, setVisualizations] = useState<VisualizationData[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File, userPlan: UserPlan = 'free') => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📤 Uploading file:', file.name);
      const response = await ApiService.uploadFile(file, userPlan);

      console.log('✅ Upload successful:', response);
      const newFileId = response.fileId || response.data?.fileId;
      setFileId(newFileId);

      // Auto-analyze after upload
      setIsLoading(true);
      console.log('🔍 Analyzing data with Granite AI...');
      const analysisResponse = await ApiService.analyzeData(newFileId, userPlan);

      console.log('✅ Analysis successful:', analysisResponse);

      const analysisData = analysisResponse.analysis || analysisResponse.data?.analysis;
      console.log('Analysis data extracted:', analysisData);

      // Set analysis data
      setAnalysis({
        dataType: analysisData.dataType,
        insights: analysisData.insights,
        kpis: analysisData.kpis,
        visualizations: analysisData.visualizations,
        dashboard: analysisData.dashboard,
        confidence: analysisData.confidence,
        processingTime: analysisData.processingTime,
        timestamp: analysisData.timestamp
      });

      // Set KPIs
      setKpis(analysisData.kpis);

      // Calculate KPI values efficiently
      const calculated = KPICalculator.calculateKPIs(analysisData.kpis, response.data?.preview || []);
      setCalculatedKPIs(calculated);

      // Set visualizations
      setVisualizations(analysisData.visualizations);

      // Set dashboard
      const dashboardData: DashboardData = {
        id: newFileId,
        title: analysisData.dashboard.title,
        description: analysisData.dashboard.description,
        dataType: analysisData.dataType,
        confidence: analysisData.confidence,
        processingTime: analysisData.processingTime,
        timestamp: analysisData.timestamp,
        insights: analysisData.insights,
        kpis: analysisData.kpis,
        visualizations: analysisData.visualizations,
        rawData: response.data?.preview || []
      };
      
      setDashboard(dashboardData);
      
      // Save dashboard to temp storage
      try {
        const dashboardStorage = DashboardStorage.getInstance();
        await dashboardStorage.saveDashboard(newFileId, dashboardData);
        console.log('✅ Dashboard saved to temp storage');
      } catch (error) {
        console.warn('⚠️ Failed to save dashboard to temp storage:', error);
      }

    } catch (err) {
      console.error('❌ Upload/Analysis failed:', err);
      console.error('❌ Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        status: err instanceof Error && 'status' in err ? err.status : 'No status',
        details: err instanceof Error && 'details' in err ? err.details : 'No details'
      });
      setError(ErrorHandler.getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeData = useCallback(async (userPlan: UserPlan = 'free') => {
    if (!fileId) {
      setError('No file uploaded');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Analyzing data with Granite AI...');
      const response = await ApiService.analyzeData(fileId, userPlan);

      console.log('✅ Analysis successful:', response);

      const analysisData = response.analysis || response.data?.analysis;

      // Set analysis data
      setAnalysis({
        dataType: analysisData.dataType,
        insights: analysisData.insights,
        kpis: analysisData.kpis,
        visualizations: analysisData.visualizations,
        dashboard: analysisData.dashboard,
        confidence: analysisData.confidence,
        processingTime: analysisData.processingTime,
        timestamp: analysisData.timestamp
      });

      // Set KPIs
      setKpis(analysisData.kpis);

      // Set visualizations
      setVisualizations(analysisData.visualizations);

      // Set dashboard
      const dashboardData: DashboardData = {
        id: fileId,
        title: analysisData.dashboard.title,
        description: analysisData.dashboard.description,
        dataType: analysisData.dataType,
        confidence: analysisData.confidence,
        processingTime: analysisData.processingTime,
        timestamp: analysisData.timestamp,
        insights: analysisData.insights,
        kpis: analysisData.kpis,
        visualizations: analysisData.visualizations,
        rawData: dashboard?.rawData || [] // Keep existing rawData
      };
      
      setDashboard(dashboardData);
      
      // Save dashboard to temp storage
      try {
        const dashboardStorage = DashboardStorage.getInstance();
        await dashboardStorage.saveDashboard(fileId, dashboardData);
        console.log('✅ Dashboard saved to temp storage');
      } catch (error) {
        console.warn('⚠️ Failed to save dashboard to temp storage:', error);
      }

    } catch (err) {
      console.error('❌ Analysis failed:', err);
      setError(ErrorHandler.getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [fileId, dashboard?.rawData]);

  const generateKPIs = useCallback(async (userPlan: UserPlan = 'free') => {
    if (!fileId) return;

    try {
      const response = await ApiService.getKPISuggestions(fileId, userPlan);
      setKpis(response.data!.kpis);
    } catch (err) {
      console.error('KPI generation failed:', err);
      setError(ErrorHandler.getErrorMessage(err));
    }
  }, [fileId, dashboard?.rawData]);

  const generateVisualizations = useCallback(async (userPlan: UserPlan = 'free') => {
    if (!fileId || kpis.length === 0) return;

    try {
      const response = await ApiService.getVisualizationRecommendations(fileId, kpis, userPlan);
      setVisualizations(response.data!.visualizations);
    } catch (err) {
      console.error('Visualization generation failed:', err);
      setError(ErrorHandler.getErrorMessage(err));
    }
  }, [fileId, kpis]);

  const generateDashboard = useCallback(async (options: { userPlan: UserPlan }) => {
    if (!analysis || !fileId) return;

    const dashboardData: DashboardData = {
      id: fileId,
      title: analysis.dashboard.title,
      description: analysis.dashboard.description,
      dataType: analysis.dataType,
      confidence: analysis.confidence,
      processingTime: analysis.processingTime,
      timestamp: analysis.timestamp,
      insights: analysis.insights,
      kpis: analysis.kpis,
      visualizations: analysis.visualizations,
      rawData: []
    };

    setDashboard(dashboardData);
  }, [analysis, fileId, dashboard?.rawData]);

  const generatePDF = useCallback(async (userPlan: UserPlan = 'free') => {
    // PDF functionality removed - use print instead
    console.warn('PDF functionality has been removed. Use browser print instead.');
    return null;
  }, []);

  const resetDashboard = useCallback(() => {
    setFileId(null);
    setAnalysis(null);
    setKpis([]);
    setCalculatedKPIs([]);
    setVisualizations([]);
    setDashboard(null);
    setError(null);
  }, []);

  return {
    fileId,
    analysis,
    kpis,
    calculatedKPIs,
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