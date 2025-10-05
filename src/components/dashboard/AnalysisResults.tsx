import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Brain, 
  BarChart3, 
  Target, 
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { AnalysisData } from '@/types';

interface AnalysisResultsProps {
  analysis: AnalysisData;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const getInsightIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'correlation':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'outlier':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'trend':
        return <BarChart3 className="h-4 w-4 text-green-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-purple-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'correlation':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'outlier':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'trend':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-purple-50 border-purple-200 text-purple-800';
    }
  };

  const getKPIIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'financial':
        return <Target className="h-4 w-4 text-green-500" />;
      case 'statistical':
        return <BarChart3 className="h-4 w-4 text-blue-500" />;
      case 'categorical':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getKPIColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'financial':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'statistical':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'categorical':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Analysis Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{analysis.dataType}</div>
              <div className="text-sm text-muted-foreground">Data Type</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {typeof analysis.confidence === 'number' 
                  ? (analysis.confidence <= 1 ? (analysis.confidence * 100).toFixed(1) : analysis.confidence.toFixed(1))
                  : analysis.confidence
                }%
              </div>
              <div className="text-sm text-muted-foreground">Confidence</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {typeof analysis.processingTime === 'number' 
                  ? (analysis.processingTime / 1000).toFixed(1) + 's'
                  : analysis.processingTime || '2.2s'
                }
              </div>
              <div className="text-sm text-muted-foreground">Processing Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights - Only show if there are clean insights */}
      {analysis.insights.filter(insight => {
        const description = insight.description || '';
        return !description.includes('{') && 
               !description.includes('"dataType"') && 
               !description.includes('"insights"') &&
               !description.includes('"kpis"') &&
               !description.includes('"visualizations"') &&
               description.length > 0;
      }).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              AI Insights ({analysis.insights.filter(insight => {
                const description = insight.description || '';
                return !description.includes('{') && 
                       !description.includes('"dataType"') && 
                       !description.includes('"insights"') &&
                       !description.includes('"kpis"') &&
                       !description.includes('"visualizations"') &&
                       description.length > 0;
              }).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.insights
                .filter(insight => {
                  // Filter out insights that contain raw JSON
                  const description = insight.description || '';
                  return !description.includes('{') && 
                         !description.includes('"dataType"') && 
                         !description.includes('"insights"') &&
                         !description.includes('"kpis"') &&
                         !description.includes('"visualizations"') &&
                         description.length > 0;
                })
                .map((insight, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getConfidenceColor(insight.confidence)}`}
                        >
                          {(insight.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {insight.type}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Performance Indicators */}
      {analysis.kpis && analysis.kpis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Key Performance Indicators ({analysis.kpis.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.kpis.map((kpi, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${getKPIColor(kpi.category)}`}
                >
                  <div className="flex items-start gap-3">
                    {getKPIIcon(kpi.category)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm">{kpi.name}</h4>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {kpi.type}
                        </Badge>
                      </div>
                      <p className="text-xs leading-relaxed mb-2">
                        {kpi.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getKPIColor(kpi.category)}`}
                        >
                          {kpi.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Column: {kpi.column}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visualizations */}
      {analysis.visualizations && analysis.visualizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Recommended Visualizations ({analysis.visualizations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.visualizations.map((viz, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{viz.title}</h4>
                        <Badge variant="outline" className="text-xs capitalize">
                          {viz.type}
                        </Badge>
                        {viz.recommended && (
                          <Badge variant="default" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed mb-2">
                        {viz.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {viz.xAxis && (
                          <span>X-Axis: {viz.xAxis}</span>
                        )}
                        {viz.yAxis && (
                          <span>Y-Axis: {viz.yAxis}</span>
                        )}
                        {viz.dataKey && (
                          <span>Data Key: {viz.dataKey}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Dashboard Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">Title:</h4>
              <span className="text-muted-foreground">{analysis.dashboard.title}</span>
            </div>
            <div className="flex items-start gap-2">
              <h4 className="font-semibold">Description:</h4>
              <span className="text-muted-foreground">{analysis.dashboard.description}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
