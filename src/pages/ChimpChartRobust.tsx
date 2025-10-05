import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ChimpChartRobust = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);
    const [rawData, setRawData] = useState<any[]>([]);
    const [analysis, setAnalysis] = useState<any>(null);
    const [kpis, setKpis] = useState<any[]>([]);
    const [visualizations, setVisualizations] = useState<any[]>([]);
    const [dashboard, setDashboard] = useState<any>(null);
    const [step, setStep] = useState<'upload' | 'analyzing' | 'complete'>('upload');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
            setSuccess(null);
            setStep('upload');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);
        setStep('upload');

        try {
            console.log('🚀 Starting upload process...');

            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('http://localhost:3001/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('📤 Upload response:', result);

            if (result.success) {
                setFileId(result.data.fileId);
                setRawData(result.data.preview || []);
                setSuccess(`File uploaded successfully! File ID: ${result.data.fileId}`);
                setStep('analyzing');

                // Start analysis
                await handleAnalysis(result.data.fileId, result.data.preview);
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (err: any) {
            console.error('❌ Upload error:', err);
            setError(`Upload failed: ${err.message}`);
            setStep('upload');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalysis = async (fileId: string, rawDataParam: any[]) => {
        setStep('analyzing');
        setError(null);

        try {
            console.log('🤖 Starting analysis...');

            const response = await fetch('http://localhost:3001/api/analysis/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fileId: fileId,
                    userPlan: 'free'
                })
            });

            if (!response.ok) {
                throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('🧠 Analysis response:', result);

            if (result.success) {
                const analysisData = result.data.analysis;

                setAnalysis(analysisData);
                setKpis(analysisData.kpis || []);
                setVisualizations(analysisData.visualizations || []);

                const dashboardData = {
                    id: fileId,
                    title: analysisData.dashboard?.title || 'Generated Dashboard',
                    description: analysisData.dashboard?.description || 'AI-generated dashboard',
                    dataType: analysisData.dataType,
                    confidence: analysisData.confidence,
                    processingTime: analysisData.processingTime,
                    timestamp: analysisData.timestamp
                };

                setDashboard(dashboardData);
                setStep('complete');
                setSuccess('Analysis completed successfully!');

                // Save to dashboard storage (with temp storage backend)
                try {
                    const fullDashboardData = {
                        ...dashboardData,
                        insights: analysisData.insights || [],
                        kpis: analysisData.kpis || [],
                        visualizations: analysisData.visualizations || [],
                        rawData: rawDataParam
                    };

                    // Import dashboardStorage dynamically to avoid circular imports
                    const { dashboardStorage } = await import('@/lib/dashboardStorage');
                    await dashboardStorage.saveDashboard(fileId, fullDashboardData);
                    console.log('💾 Dashboard saved to storage');
                } catch (storageError) {
                    console.warn('Failed to save to storage:', storageError);
                }

            } else {
                throw new Error(result.message || 'Analysis failed');
            }
        } catch (err: any) {
            console.error('❌ Analysis error:', err);
            setError(`Analysis failed: ${err.message}`);
            setStep('upload');
        }
    };

    const calculateKPIValue = (kpi: any, data: any[]) => {
        if (!data.length) return 0;

        const column = kpi.column;
        const type = kpi.type;

        switch (type) {
            case 'sum':
                return data.reduce((sum, row) => {
                    const value = parseFloat(row[column]) || 0;
                    return sum + value;
                }, 0);
            case 'average':
                const sum = data.reduce((sum, row) => {
                    const value = parseFloat(row[column]) || 0;
                    return sum + value;
                }, 0);
                return sum / data.length;
            case 'count':
                return data.length;
            case 'max':
                return Math.max(...data.map(row => parseFloat(row[column]) || 0));
            case 'min':
                return Math.min(...data.map(row => parseFloat(row[column]) || 0));
            default:
                return 0;
        }
    };

    const resetAll = () => {
        setSelectedFile(null);
        setFileId(null);
        setRawData([]);
        setAnalysis(null);
        setKpis([]);
        setVisualizations([]);
        setDashboard(null);
        setError(null);
        setSuccess(null);
        setStep('upload');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">🚀 Chimp Chart - Robust Version</h1>
                    <p className="text-gray-600">AI-Powered Dashboard Generator with Better Error Handling</p>
                </div>

                {/* Status Indicator */}
                <div className="mb-6">
                    <div className="flex items-center justify-center space-x-4">
                        <div className={`flex items-center space-x-2 ${step === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                1
                            </div>
                            <span>Upload</span>
                        </div>
                        <div className={`w-16 h-1 ${step === 'analyzing' || step === 'complete' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                        <div className={`flex items-center space-x-2 ${step === 'analyzing' ? 'text-blue-600' : step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'analyzing' ? 'bg-blue-600 text-white' : step === 'complete' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                                {step === 'analyzing' ? <Loader2 className="w-4 h-4 animate-spin" /> : '2'}
                            </div>
                            <span>Analyze</span>
                        </div>
                        <div className={`w-16 h-1 ${step === 'complete' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                        <div className={`flex items-center space-x-2 ${step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'complete' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                                3
                            </div>
                            <span>Complete</span>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Success Alert */}
                {success && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {success}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Upload Section */}
                {step === 'upload' && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Upload Your Data File
                            </CardTitle>
                            <CardDescription>
                                Drag and drop your CSV or Excel file here, or click to browse
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-lg font-medium mb-2">
                                    {selectedFile ? selectedFile.name : "Choose your file"}
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Supports CSV, XLS, and XLSX files up to 10MB
                                </p>
                                <input
                                    type="file"
                                    accept=".csv,.xls,.xlsx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <Button asChild>
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Choose File
                                    </label>
                                </Button>
                            </div>

                            {selectedFile && (
                                <div className="mt-4 flex justify-center">
                                    <Button
                                        onClick={handleUpload}
                                        disabled={isLoading}
                                        className="w-full max-w-xs"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload & Analyze
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Analysis Progress */}
                {step === 'analyzing' && (
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
                                <h3 className="text-lg font-semibold mb-2">🤖 AI Analysis in Progress</h3>
                                <p className="text-gray-600">Granite AI is analyzing your data and generating insights...</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Results Section */}
                {step === 'complete' && (
                    <div className="space-y-6">
                        {/* Dashboard Info */}
                        {dashboard && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        Dashboard Generated
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-700">Title</h4>
                                            <p className="text-gray-600">{dashboard.title}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-700">Data Type</h4>
                                            <p className="text-gray-600 capitalize">{dashboard.dataType}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-700">Confidence</h4>
                                            <p className="text-gray-600">{(dashboard.confidence * 100).toFixed(1)}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* KPIs */}
                        {kpis.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>📊 Key Performance Indicators</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {kpis.slice(0, 4).map((kpi, index) => {
                                            const kpiValue = calculateKPIValue(kpi, rawData);
                                            return (
                                                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h5 className="font-semibold text-blue-900">{kpi.name}</h5>
                                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                            {kpi.type.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-blue-800 mb-2">
                                                        {typeof kpiValue === 'number' ? kpiValue.toLocaleString() : kpiValue}
                                                    </p>
                                                    <p className="text-xs text-blue-600">{kpi.description}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Insights */}
                        {analysis?.insights && analysis.insights.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>🧠 AI Insights</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {analysis.insights.slice(0, 3).map((insight: any, index: number) => (
                                            <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                <h5 className="font-semibold text-green-900 mb-2">{insight.title}</h5>
                                                <p className="text-sm text-green-700">{insight.description}</p>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                        {insight.type.toUpperCase()}
                                                    </span>
                                                    <span className="text-xs text-green-600">
                                                        Confidence: {(insight.confidence * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        <div className="flex justify-center space-x-4">
                            <Button onClick={resetAll} variant="outline">
                                Upload New File
                            </Button>
                            <Button onClick={() => window.open(`/dashboard/${fileId}`, '_blank')}>
                                View Full Dashboard
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChimpChartRobust;
