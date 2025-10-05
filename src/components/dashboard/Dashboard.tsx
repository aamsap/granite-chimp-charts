import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KPICard } from './KPICard';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { AreaChart } from './AreaChart';
import { ScatterChart } from './ScatterChart';
import { TrendingUp, DollarSign, Users, ShoppingCart, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';

interface DashboardProps {
    title: string;
    description: string;
    dataType: string;
    confidence: number;
    processingTime: number;
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
    rawData?: any[];
}

export function Dashboard({
    title,
    description,
    dataType,
    confidence,
    processingTime,
    insights,
    kpis,
    visualizations,
    rawData = []
}: DashboardProps) {

    // Helper function to get icon for KPI
    const getKPIIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'financial':
                return <DollarSign className="h-4 w-4" />;
            case 'statistical':
                return <BarChart3 className="h-4 w-4" />;
            case 'categorical':
                return <Users className="h-4 w-4" />;
            default:
                return <TrendingUp className="h-4 w-4" />;
        }
    };

    // Helper function to calculate KPI values from raw data
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

    // Helper function to prepare chart data
    const prepareChartData = (viz: any) => {
        if (viz.data && viz.data.length > 0) {
            return viz.data;
        }
        return rawData;
    };

    // Render chart based on type - only render if recommended by AI
    const renderChart = (viz: any) => {
        // Only render if AI recommends this visualization
        if (!viz.recommended) {
            return null;
        }

        const chartData = prepareChartData(viz);

        switch (viz.type) {
            case 'bar':
                return (
                    <BarChart
                        key={viz.id}
                        data={chartData}
                        xAxisKey={viz.xAxis || 'name'}
                        yAxisKey={viz.yAxis || 'value'}
                        title={viz.title}
                        description={viz.description}
                        className="col-span-1 md:col-span-2"
                    />
                );
            case 'line':
                return (
                    <LineChart
                        key={viz.id}
                        data={chartData}
                        xAxisKey={viz.xAxis || 'name'}
                        yAxisKey={viz.yAxis || 'value'}
                        title={viz.title}
                        description={viz.description}
                        className="col-span-1 md:col-span-2"
                    />
                );
            case 'pie':
                return (
                    <PieChart
                        key={viz.id}
                        data={chartData}
                        dataKey={viz.dataKey || 'value'}
                        nameKey={viz.xAxis || 'name'}
                        title={viz.title}
                        description={viz.description}
                        className="col-span-1"
                    />
                );
            case 'area':
                return (
                    <AreaChart
                        key={viz.id}
                        data={chartData}
                        xAxisKey={viz.xAxis || 'name'}
                        yAxisKey={viz.yAxis || 'value'}
                        title={viz.title}
                        description={viz.description}
                        className="col-span-1 md:col-span-2"
                    />
                );
            case 'scatter':
                return (
                    <ScatterChart
                        key={viz.id}
                        data={chartData}
                        xAxisKey={viz.xAxis || 'x'}
                        yAxisKey={viz.yAxis || 'y'}
                        title={viz.title}
                        description={viz.description}
                        className="col-span-1 md:col-span-2"
                    />
                );
            default:
                console.warn(`Unknown chart type: ${viz.type}`);
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
                <div className="flex justify-center gap-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {dataType}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {(confidence * 100).toFixed(1)}% confidence
                    </Badge>
                    <Badge variant="outline">
                        {(processingTime / 1000).toFixed(1)}s processing
                    </Badge>
                </div>
            </div>

            {/* AI Insights */}
            {insights && insights.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            AI Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {insights.map((insight, index) => (
                                <div key={index} className="p-4 border rounded-lg">
                                    <h4 className="font-semibold mb-2">{insight.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {insight.description}
                                    </p>
                                    <Badge variant="outline" className="text-xs">
                                        {(insight.confidence * 100).toFixed(1)}% confidence
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* KPI Cards */}
            {kpis && kpis.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {kpis.map((kpi) => (
                        <KPICard
                            key={kpi.id}
                            title={kpi.name}
                            value={calculateKPIValue(kpi, rawData)}
                            description={kpi.description}
                            icon={getKPIIcon(kpi.category)}
                        />
                    ))}
                </div>
            )}

            {/* Visualizations */}
            {visualizations && visualizations.length > 0 && (
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">📊 AI-Recommended Visualizations</h2>
                        <p className="text-muted-foreground">
                            Granite AI has analyzed your data and selected the most appropriate visualizations
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {visualizations.map((viz) => renderChart(viz))}
                    </div>

                    {/* Show AI reasoning for visualization selection */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-blue-800">🤖 AI Selection Reasoning</h4>
                        <div className="space-y-2 text-sm">
                            {visualizations.filter(viz => viz.recommended).map((viz, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <span className="font-medium capitalize">{viz.type} Chart:</span>
                                    <span className="text-muted-foreground">{viz.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Raw Data Preview */}
            {rawData && rawData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Data Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        {Object.keys(rawData[0] || {}).map((key) => (
                                            <th key={key} className="text-left p-2 font-medium">
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rawData.slice(0, 10).map((row, index) => (
                                        <tr key={index} className="border-b">
                                            {Object.values(row).map((value, cellIndex) => (
                                                <td key={cellIndex} className="p-2">
                                                    {String(value)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {rawData.length > 10 && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Showing 10 of {rawData.length} rows
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
