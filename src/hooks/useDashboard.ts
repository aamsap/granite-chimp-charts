import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { useToast } from './use-toast';

interface DashboardState {
    fileId: string | null;
    analysis: any | null;
    kpis: any[];
    visualizations: any[];
    dashboard: any | null;
    isLoading: boolean;
    error: string | null;
}

interface UseDashboardReturn extends DashboardState {
    uploadFile: (file: File, userPlan?: string) => Promise<void>;
    analyzeData: (userPlan?: string) => Promise<void>;
    generateKPIs: (userPlan?: string) => Promise<void>;
    generateVisualizations: (userPlan?: string) => Promise<void>;
    generateDashboard: (options?: {
        customTitle?: string;
        customDescription?: string;
        theme?: string;
        userPlan?: string;
    }) => Promise<void>;
    generatePDF: (options?: any, userPlan?: string) => Promise<string | null>;
    resetDashboard: () => void;
    setKPIs: (kpis: any[]) => void;
    setVisualizations: (visualizations: any[]) => void;
}

export function useDashboard(): UseDashboardReturn {
    const [state, setState] = useState<DashboardState>({
        fileId: null,
        analysis: null,
        kpis: [],
        visualizations: [],
        dashboard: null,
        isLoading: false,
        error: null,
    });

    const { toast } = useToast();

    const setLoading = useCallback((isLoading: boolean) => {
        setState(prev => ({ ...prev, isLoading, error: null }));
    }, []);

    const setError = useCallback((error: string) => {
        setState(prev => ({ ...prev, error, isLoading: false }));
        toast({
            title: "Error",
            description: error,
            variant: "destructive",
        });
    }, [toast]);

    const uploadFile = useCallback(async (file: File, userPlan: string = 'free') => {
        setLoading(true);
        try {
            const response = await apiService.uploadFile(file, userPlan);

            if (response.success && response.data) {
                setState(prev => ({
                    ...prev,
                    fileId: response.data!.fileId,
                    isLoading: false,
                }));

                toast({
                    title: "File uploaded successfully",
                    description: `${response.data!.fileName} is ready for analysis.`,
                });
            } else {
                setError(response.message || 'Failed to upload file');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to upload file');
        }
    }, [setLoading, setError, toast]);

    const analyzeData = useCallback(async (userPlan: string = 'free') => {
        if (!state.fileId) {
            setError('No file uploaded. Please upload a file first.');
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.analyzeData(state.fileId, userPlan);

            if (response.success && response.data) {
                setState(prev => ({
                    ...prev,
                    analysis: response.data!.analysis,
                    isLoading: false,
                }));

                toast({
                    title: "Analysis completed",
                    description: "Data has been analyzed successfully.",
                });
            } else {
                setError(response.message || 'Failed to analyze data');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to analyze data');
        }
    }, [state.fileId, setLoading, setError, toast]);

    const generateKPIs = useCallback(async (userPlan: string = 'free') => {
        if (!state.fileId) {
            setError('No file uploaded. Please upload a file first.');
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.getKPISuggestions(state.fileId, userPlan);

            if (response.success && response.data) {
                setState(prev => ({
                    ...prev,
                    kpis: response.data!.kpis,
                    isLoading: false,
                }));

                toast({
                    title: "KPIs generated",
                    description: `${response.data!.kpis.length} KPIs have been suggested.`,
                });
            } else {
                setError(response.message || 'Failed to generate KPIs');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to generate KPIs');
        }
    }, [state.fileId, setLoading, setError, toast]);

    const generateVisualizations = useCallback(async (userPlan: string = 'free') => {
        if (!state.fileId) {
            setError('No file uploaded. Please upload a file first.');
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.getVisualizationRecommendations(
                state.fileId,
                state.kpis,
                userPlan
            );

            if (response.success && response.data) {
                setState(prev => ({
                    ...prev,
                    visualizations: response.data!.visualizations,
                    isLoading: false,
                }));

                toast({
                    title: "Visualizations generated",
                    description: `${response.data!.visualizations.length} visualizations have been suggested.`,
                });
            } else {
                setError(response.message || 'Failed to generate visualizations');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to generate visualizations');
        }
    }, [state.fileId, state.kpis, setLoading, setError, toast]);

    const generateDashboard = useCallback(async (options: {
        customTitle?: string;
        customDescription?: string;
        theme?: string;
        userPlan?: string;
    } = {}) => {
        if (!state.fileId || !state.analysis) {
            setError('Missing required data. Please analyze your data first.');
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.generateDashboard(
                state.fileId,
                state.analysis,
                state.kpis,
                state.visualizations,
                options.userPlan || 'free',
                options.customTitle,
                options.customDescription,
                options.theme || 'default'
            );

            if (response.success && response.data) {
                setState(prev => ({
                    ...prev,
                    dashboard: response.data!.dashboard,
                    isLoading: false,
                }));

                toast({
                    title: "Dashboard generated",
                    description: "Your dashboard has been created successfully.",
                });
            } else {
                setError(response.message || 'Failed to generate dashboard');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to generate dashboard');
        }
    }, [state.fileId, state.analysis, state.kpis, state.visualizations, setLoading, setError, toast]);

    const generatePDF = useCallback(async (options: any = {}, userPlan: string = 'free'): Promise<string | null> => {
        if (!state.dashboard) {
            setError('No dashboard available. Please generate a dashboard first.');
            return null;
        }

        setLoading(true);
        try {
            const response = await apiService.generatePDF(state.dashboard, options, userPlan);

            if (response.success && response.data) {
                setLoading(false);

                toast({
                    title: "PDF generated",
                    description: "Your PDF has been generated successfully.",
                });

                return response.data!.pdfUrl;
            } else {
                setError(response.message || 'Failed to generate PDF');
                return null;
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to generate PDF');
            return null;
        }
    }, [state.dashboard, setLoading, setError, toast]);

    const resetDashboard = useCallback(() => {
        setState({
            fileId: null,
            analysis: null,
            kpis: [],
            visualizations: [],
            dashboard: null,
            isLoading: false,
            error: null,
        });
    }, []);

    const setKPIs = useCallback((kpis: any[]) => {
        setState(prev => ({ ...prev, kpis }));
    }, []);

    const setVisualizations = useCallback((visualizations: any[]) => {
        setState(prev => ({ ...prev, visualizations }));
    }, []);

    return {
        ...state,
        uploadFile,
        analyzeData,
        generateKPIs,
        generateVisualizations,
        generateDashboard,
        generatePDF,
        resetDashboard,
        setKPIs,
        setVisualizations,
    };
}
