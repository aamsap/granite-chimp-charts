// Enhanced KPI Card component with better performance and styling
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, DollarSign, BarChart3, Users, ShoppingCart } from 'lucide-react';
import { CalculatedKPI } from '@/utils/kpiCalculator';
import { KPICardProps as BaseKPICardProps } from '@/types';

// For Dashboard component (individual props)
interface KPICardProps extends BaseKPICardProps {
  className?: string;
}

// For CalculatedKPI objects
interface CalculatedKPICardProps {
  kpi: CalculatedKPI;
  className?: string;
}

const getKpiIcon = (category: string, type: string) => {
  switch (category) {
    case 'financial':
      return <DollarSign className="h-5 w-5" />;
    case 'statistical':
      return <BarChart3 className="h-5 w-5" />;
    case 'categorical':
      return <Users className="h-5 w-5" />;
    default:
      return <ShoppingCart className="h-5 w-5" />;
  }
};

const getTrendIcon = (type: string) => {
  switch (type) {
    case 'sum':
    case 'max':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'min':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    case 'average':
    case 'count':
      return <Minus className="h-4 w-4 text-blue-500" />;
    default:
      return <Minus className="h-4 w-4 text-gray-500" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'financial':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'statistical':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'categorical':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Main KPICard component for Dashboard (individual props)
export function KPICard({ title, value, description, icon, className = '' }: KPICardProps) {
  return (
    <Card className={`hover:shadow-md transition-shadow duration-200 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">
            {value}
          </div>
          
          <p className="text-xs text-gray-500 leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// CalculatedKPICard component for CalculatedKPI objects
export function CalculatedKPICard({ kpi, className = '' }: CalculatedKPICardProps) {
  if (!kpi) {
    return (
      <Card className={`hover:shadow-md transition-shadow duration-200 ${className}`}>
        <CardContent>
          <div className="text-center text-gray-500 py-4">
            No KPI data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-md transition-shadow duration-200 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {kpi.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          {getKpiIcon(kpi.category, kpi.type)}
          {getTrendIcon(kpi.type)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">
            {kpi.isValid ? kpi.formattedValue : 'N/A'}
          </div>
          
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`text-xs ${getCategoryColor(kpi.category)}`}
            >
              {kpi.category}
            </Badge>
            
            <span className="text-xs text-gray-500 capitalize">
              {kpi.type}
            </span>
          </div>
          
          {kpi.description && (
            <p className="text-xs text-gray-500 leading-relaxed">
              {kpi.description}
            </p>
          )}
          
          {!kpi.isValid && (
            <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
              ⚠️ Unable to calculate value
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Grid component for displaying multiple KPIs
interface KPIGridProps {
  kpis: CalculatedKPI[];
  maxItems?: number;
  className?: string;
}

export function KPIGrid({ kpis, maxItems = 4, className = '' }: KPIGridProps) {
  const displayKPIs = kpis.slice(0, maxItems);
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {displayKPIs.map((kpi, index) => (
        <CalculatedKPICard key={kpi.id || index} kpi={kpi} />
      ))}
    </div>
  );
}

// Summary component for quick KPI overview
interface KPISummaryProps {
  kpis: CalculatedKPI[];
  className?: string;
}

export function KPISummary({ kpis, className = '' }: KPISummaryProps) {
  const validKPIs = kpis.filter(kpi => kpi.isValid);
  const financialKPIs = validKPIs.filter(kpi => kpi.category === 'financial');
  const statisticalKPIs = validKPIs.filter(kpi => kpi.category === 'statistical');
  const categoricalKPIs = validKPIs.filter(kpi => kpi.category === 'categorical');

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Key Metrics Summary</h3>
        <Badge variant="outline" className="text-xs">
          {validKPIs.length} of {kpis.length} metrics
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800">Financial</span>
          </div>
          <p className="text-green-600 font-semibold">{financialKPIs.length} metrics</p>
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Statistical</span>
          </div>
          <p className="text-blue-600 font-semibold">{statisticalKPIs.length} metrics</p>
        </div>
        
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-purple-800">Categorical</span>
          </div>
          <p className="text-purple-600 font-semibold">{categoricalKPIs.length} metrics</p>
        </div>
      </div>
    </div>
  );
}