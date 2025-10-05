import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KPICard } from './KPICard';
import { KPICalculator } from '@/utils/kpiCalculator';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  LineChart as RechartsLineChart, 
  Line, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  AreaChart as RechartsAreaChart, 
  Area,
  ScatterChart as RechartsScatterChart, 
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, DollarSign, Users, ShoppingCart, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { DashboardProps } from '@/types';

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

  // Calculate KPI values using KPICalculator (limited to 4 most important)
  const kpiValues = useMemo(() => {
    if (!kpis || kpis.length === 0 || !rawData || rawData.length === 0) {
      return [];
    }
    
    // Use KPICalculator to get only 4 most important KPIs with proper formatting
    const calculatedKPIs = KPICalculator.calculateKPIs(kpis, rawData);
    console.log('📊 Dashboard KPI Values:', calculatedKPIs);
    
    return calculatedKPIs.map(kpi => ({
      ...kpi,
      calculatedValue: kpi.formattedValue // Use formatted value with 2 decimals
    }));
  }, [kpis, rawData]);

  // Helper function to prepare chart data
  const prepareChartData = useMemo(() => {
    return (viz: any) => {
      // Use viz.data if available, otherwise fallback to rawData
      const sourceData = (viz.data && viz.data.length > 0) ? viz.data : rawData;
      
      if (!sourceData || sourceData.length === 0) {
        console.warn('⚠️ No data available for chart:', viz.title);
        return [];
      }

      console.log('📊 Preparing chart data for:', viz.title, 'Type:', viz.type);
      console.log('📊 Source data length:', sourceData.length);
      console.log('📊 Chart config:', { xAxis: viz.xAxis, yAxis: viz.yAxis, dataKey: viz.dataKey });

      // Process data based on chart type
      if (viz.type === 'bar') {
        if (viz.yAxis === 'count') {
          // For bar charts with count, group by xAxis and count occurrences
          const grouped = sourceData.reduce((acc: any, row: any) => {
            const key = row[viz.xAxis];
            if (key !== undefined && key !== null) {
              acc[key] = (acc[key] || 0) + 1;
            }
            return acc;
          }, {});
          
          const result = Object.entries(grouped).map(([key, value]) => ({
            [viz.xAxis]: key,
            count: value
          }));
          console.log('📊 Bar chart (count) data:', result);
          return result;
        } else {
          // For bar charts with values, use data as is
          console.log('📊 Bar chart (value) data:', sourceData);
          return sourceData;
        }
      } else if (viz.type === 'line') {
        if (viz.xAxis === 'index') {
          // For line charts with index, add index to each row
          const result = sourceData.map((row: any, index: number) => ({
            ...row,
            index: index + 1
          }));
          console.log('📊 Line chart (index) data:', result);
          return result;
        } else {
          // For line charts with date/category, use data as is
          console.log('📊 Line chart (date) data:', sourceData);
          return sourceData;
        }
      } else if (viz.type === 'pie') {
        // For pie charts, group by dataKey and count occurrences
        const dataKey = viz.dataKey || viz.xAxis || Object.keys(sourceData[0] || {})[0];
        console.log('📊 Pie chart dataKey:', dataKey);
        
        const grouped = sourceData.reduce((acc: any, row: any) => {
          const key = row[dataKey];
          if (key !== undefined && key !== null) {
            acc[key] = (acc[key] || 0) + 1;
          }
          return acc;
        }, {});
        
        const result = Object.entries(grouped).map(([key, value]) => ({
          name: key,
          value: value
        }));
        console.log('📊 Pie chart data:', result);
        return result;
      } else {
        // For other charts, use data as is
        console.log('📊 Other chart data:', sourceData);
        return sourceData;
      }
    };
  }, [rawData]);

  // Render chart based on type - only render if recommended by AI
  const renderChart = useMemo(() => {
    return (viz: any) => {
      // Debug logging
      console.log('🎨 Rendering chart:', viz);
      console.log('📊 Chart data:', viz.data);
      console.log('✅ Recommended:', viz.recommended);
      
      // Always render charts, don't filter by recommended
      const chartData = prepareChartData(viz);
      console.log('📈 Prepared chart data:', chartData);
      
      if (!chartData || chartData.length === 0) {
        console.warn('⚠️ No chart data available for:', viz.title);
        return null;
      }
      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

      // Debug: Log chart data for line charts
      if (viz.type === 'line') {
        const dataValues = chartData.map((row: any) => row[viz.yAxis]).filter(val => val !== undefined && !isNaN(val));
        const minValue = Math.min(...dataValues);
        const maxValue = Math.max(...dataValues);
        
        console.log('Line Chart Debug:', {
          viz: viz,
          chartData: chartData,
          yAxisKey: viz.yAxis,
          dataValues: dataValues,
          minValue: minValue,
          maxValue: maxValue,
          domain: [minValue - 0.1, maxValue + 0.1]
        });
      }

      switch (viz.type) {
        case 'bar':
          // Determine dataKey based on chart type
          const barDataKey = viz.yAxis === 'count' ? 'count' : (viz.yAxis || 'value');
          const barXAxisKey = viz.xAxis || 'name';
          
          console.log('📊 Bar chart rendering:', {
            title: viz.title,
            dataLength: chartData.length,
            xAxisKey: barXAxisKey,
            dataKey: barDataKey,
            chartData: chartData
          });
          
          return (
            <Card key={viz.id} className="col-span-1 md:col-span-2 chart-container">
              <CardHeader>
                <CardTitle className="text-lg">{viz.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{viz.description}</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={barXAxisKey} />
                    <YAxis 
                      domain={[0, 'dataMax']}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip 
                      formatter={(value: any) => [value.toLocaleString(), barDataKey]}
                      labelFormatter={(label) => `${barXAxisKey}: ${label}`}
                    />
                    <Bar dataKey={barDataKey} fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          );
        case 'line':
          const dataValues = chartData.map((row: any) => row[viz.yAxis]).filter(val => val !== undefined && !isNaN(val));
          const minValue = dataValues.length > 0 ? Math.min(...dataValues) : 0;
          const maxValue = dataValues.length > 0 ? Math.max(...dataValues) : 100;
          const padding = (maxValue - minValue) * 0.1; // 10% padding
          
          return (
            <Card key={viz.id} className="col-span-1 md:col-span-2 chart-container">
              <CardHeader>
                <CardTitle className="text-lg">{viz.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{viz.description}</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={viz.xAxis || 'name'} />
                    <YAxis 
                      domain={[minValue - padding, maxValue + padding]}
                      tickFormatter={(value) => value.toLocaleString()}
                      allowDataOverflow={false}
                    />
                    <Tooltip 
                      formatter={(value: any) => [value.toLocaleString(), viz.yAxis || 'Value']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line type="monotone" dataKey={viz.yAxis || 'value'} stroke="#8884d8" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          );
        case 'pie':
          console.log('📊 Pie chart rendering:', {
            title: viz.title,
            dataLength: chartData.length,
            chartData: chartData,
            dataKey: 'value',
            nameKey: 'name'
          });
          
          return (
            <Card key={viz.id} className="col-span-1 chart-container">
              <CardHeader>
                <CardTitle className="text-lg">{viz.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{viz.description}</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          );
        case 'area':
          return (
            <Card key={viz.id} className="col-span-1 md:col-span-2 chart-container">
              <CardHeader>
                <CardTitle className="text-lg">{viz.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{viz.description}</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsAreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={viz.xAxis || 'name'} />
                    <YAxis 
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip 
                      formatter={(value: any) => [value.toLocaleString(), viz.yAxis || 'Value']}
                      labelFormatter={(label) => `${viz.xAxis}: ${label}`}
                    />
                    <Area type="monotone" dataKey={viz.yAxis || 'value'} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RechartsAreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          );
        case 'scatter':
          return (
            <Card key={viz.id} className="col-span-1 md:col-span-2 chart-container">
              <CardHeader>
                <CardTitle className="text-lg">{viz.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{viz.description}</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsScatterChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={viz.xAxis || 'x'} />
                    <YAxis 
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip 
                      formatter={(value: any) => [value.toLocaleString(), viz.yAxis || 'Value']}
                      labelFormatter={(label) => `${viz.xAxis}: ${label}`}
                    />
                    <Scatter dataKey={viz.yAxis || 'y'} fill="#8884d8" />
                  </RechartsScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          );
        default:
          console.warn(`Unknown chart type: ${viz.type}`);
          return null;
      }
    };
  }, [rawData, prepareChartData]);

  return (
    <div className="space-y-6 dashboard-print">
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
            {typeof confidence === 'number' 
              ? (confidence <= 1 ? (confidence * 100).toFixed(1) : confidence.toFixed(1))
              : confidence
            }% confidence
          </Badge>
          <Badge variant="outline">
            {typeof processingTime === 'number' 
              ? (processingTime / 1000).toFixed(1) + 's'
              : processingTime || '2.2s'
            } processing
          </Badge>
        </div>
      </div>


      {/* KPI Cards */}
      {kpiValues && kpiValues.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiValues.map((kpi) => (
            <KPICard
              key={kpi.id}
              title={kpi.name}
              value={kpi.calculatedValue}
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
                    {rawData[0] ? Object.keys(rawData[0]).map((key) => (
                      <th key={key} className="text-left p-2 font-medium">
                        {key}
                      </th>
                    )) : null}
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