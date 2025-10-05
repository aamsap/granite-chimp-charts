// Enhanced KPI Card component with modern design and better styling
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, DollarSign, BarChart3, Users, ShoppingCart, Activity, Target, Zap, TrendingUp as PerformanceIcon, Settings, Megaphone, ShoppingBag, Brain, Gauge, Calendar, Star } from 'lucide-react';
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
      return <DollarSign className="h-6 w-6" />;
    case 'statistical':
      return <BarChart3 className="h-6 w-6" />;
    case 'categorical':
      return <Users className="h-6 w-6" />;
    case 'performance':
      return <PerformanceIcon className="h-6 w-6" />;
    case 'operational':
      return <Settings className="h-6 w-6" />;
    case 'marketing':
      return <Megaphone className="h-6 w-6" />;
    case 'sales':
      return <ShoppingBag className="h-6 w-6" />;
    case 'analytics':
      return <Brain className="h-6 w-6" />;
    case 'quality':
      return <Star className="h-6 w-6" />;
    case 'efficiency':
      return <Gauge className="h-6 w-6" />;
    case 'time':
      return <Calendar className="h-6 w-6" />;
    default:
      return <Activity className="h-6 w-6" />;
  }
};

const getTrendIcon = (type: string) => {
  switch (type) {
    case 'sum':
    case 'max':
      return <TrendingUp className="h-4 w-4" />;
    case 'min':
      return <TrendingDown className="h-4 w-4" />;
    case 'average':
    case 'count':
      return <Minus className="h-4 w-4" />;
    default:
      return <Target className="h-4 w-4" />;
  }
};

const getCategoryGradient = (category: string) => {
  switch (category) {
    case 'financial':
      return 'from-emerald-500 to-green-600';
    case 'statistical':
      return 'from-blue-500 to-indigo-600';
    case 'categorical':
      return 'from-purple-500 to-violet-600';
    case 'performance':
      return 'from-orange-500 to-red-600';
    case 'operational':
      return 'from-cyan-500 to-teal-600';
    case 'marketing':
      return 'from-pink-500 to-rose-600';
    case 'sales':
      return 'from-yellow-500 to-amber-600';
    case 'analytics':
      return 'from-indigo-500 to-purple-600';
    case 'quality':
      return 'from-violet-500 to-purple-600';
    case 'efficiency':
      return 'from-teal-500 to-cyan-600';
    case 'time':
      return 'from-rose-500 to-pink-600';
    case 'growth':
      return 'from-lime-500 to-green-600';
    case 'productivity':
      return 'from-sky-500 to-blue-600';
    case 'customer':
      return 'from-fuchsia-500 to-purple-600';
    case 'revenue':
      return 'from-green-500 to-emerald-600';
    default:
      return 'from-gray-500 to-slate-600';
  }
};

const getCategoryBg = (category: string) => {
  switch (category) {
    case 'financial':
      return 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200';
    case 'statistical':
      return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200';
    case 'categorical':
      return 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200';
    case 'performance':
      return 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200';
    case 'operational':
      return 'bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200';
    case 'marketing':
      return 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200';
    case 'sales':
      return 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200';
    case 'analytics':
      return 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200';
    case 'quality':
      return 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200';
    case 'efficiency':
      return 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200';
    case 'time':
      return 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200';
    case 'growth':
      return 'bg-gradient-to-br from-lime-50 to-green-50 border-lime-200';
    case 'productivity':
      return 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200';
    case 'customer':
      return 'bg-gradient-to-br from-fuchsia-50 to-purple-50 border-fuchsia-200';
    case 'revenue':
      return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
    default:
      return 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200';
  }
};

const getCategoryText = (category: string) => {
  switch (category) {
    case 'financial':
      return 'text-emerald-700';
    case 'statistical':
      return 'text-blue-700';
    case 'categorical':
      return 'text-purple-700';
    case 'performance':
      return 'text-orange-700';
    case 'operational':
      return 'text-cyan-700';
    case 'marketing':
      return 'text-pink-700';
    case 'sales':
      return 'text-yellow-700';
    case 'analytics':
      return 'text-indigo-700';
    case 'quality':
      return 'text-violet-700';
    case 'efficiency':
      return 'text-teal-700';
    case 'time':
      return 'text-rose-700';
    case 'growth':
      return 'text-lime-700';
    case 'productivity':
      return 'text-sky-700';
    case 'customer':
      return 'text-fuchsia-700';
    case 'revenue':
      return 'text-green-700';
    default:
      return 'text-gray-700';
  }
};

const getCategoryIconBg = (category: string) => {
  switch (category) {
    case 'financial':
      return 'bg-emerald-100';
    case 'statistical':
      return 'bg-blue-100';
    case 'categorical':
      return 'bg-purple-100';
    case 'performance':
      return 'bg-orange-100';
    case 'operational':
      return 'bg-cyan-100';
    case 'marketing':
      return 'bg-pink-100';
    case 'sales':
      return 'bg-yellow-100';
    case 'analytics':
      return 'bg-indigo-100';
    case 'quality':
      return 'bg-violet-100';
    case 'efficiency':
      return 'bg-teal-100';
    case 'time':
      return 'bg-rose-100';
    case 'growth':
      return 'bg-lime-100';
    case 'productivity':
      return 'bg-sky-100';
    case 'customer':
      return 'bg-fuchsia-100';
    case 'revenue':
      return 'bg-green-100';
    default:
      return 'bg-gray-100';
  }
};

// Main KPICard component for Dashboard (individual props)
export function KPICard({ title, value, description, icon, className = '' }: KPICardProps) {
    return (
    <Card className={`group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1 kpi-card border-0 bg-gradient-to-br from-white via-primary/5 to-primary/10 relative overflow-hidden ${className}`}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl group-hover:from-primary/30 group-hover:to-primary/40 transition-all duration-300 group-hover:scale-110">
              {icon}
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    {title}
                </CardTitle>
            </div>
          </div>
                    </div>
            </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <div className="space-y-3">
          <div className="text-3xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
            {value}
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors">
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
      <Card className={`hover:shadow-lg transition-all duration-300 kpi-card border-0 bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500 py-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium">No KPI data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const categoryGradient = getCategoryGradient(kpi.category);
  const categoryBg = getCategoryBg(kpi.category);
  const categoryText = getCategoryText(kpi.category);
  const categoryIconBg = getCategoryIconBg(kpi.category);

  return (
    <Card className={`group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1 kpi-card border-0 ${categoryBg} relative overflow-hidden ${className}`}>
      {/* Decorative gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${categoryIconBg} group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg`}>
              {getKpiIcon(kpi.category, kpi.type)}
            </div>
            <div className="flex-1">
              <CardTitle className={`text-sm font-semibold ${categoryText} group-hover:text-gray-900 transition-colors line-clamp-1`}>
                {kpi.name}
              </CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className={`p-1 rounded-lg bg-white/50 ${categoryIconBg} group-hover:bg-white/70 transition-colors`}>
              {getTrendIcon(kpi.type)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <div className={`text-3xl font-bold bg-gradient-to-r ${categoryGradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 group-hover:animate-pulse`}>
              {kpi.isValid ? kpi.formattedValue : 'N/A'}
            </div>
            {kpi.isValid && (
              <Badge 
                variant="secondary" 
                className={`text-xs px-2 py-1 rounded-full ${categoryIconBg} ${categoryText} border-0 group-hover:shadow-md transition-all duration-300`}
              >
                {kpi.type}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`text-xs px-3 py-1 rounded-full ${categoryIconBg} ${categoryText} border-0 font-medium group-hover:shadow-md transition-all duration-300`}
            >
              {kpi.category}
            </Badge>
            
            {!kpi.isValid && (
              <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full group-hover:bg-red-100 transition-colors">
                <Zap className="h-3 w-3" />
                <span>Invalid</span>
                    </div>
                )}
          </div>
          
          {kpi.description && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors">
              {kpi.description}
            </p>
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
  const performanceKPIs = validKPIs.filter(kpi => kpi.category === 'performance');
  const operationalKPIs = validKPIs.filter(kpi => kpi.category === 'operational');
  const marketingKPIs = validKPIs.filter(kpi => kpi.category === 'marketing');
  const salesKPIs = validKPIs.filter(kpi => kpi.category === 'sales');
  const analyticsKPIs = validKPIs.filter(kpi => kpi.category === 'analytics');

  const categoryStats = [
    { name: 'Financial', count: financialKPIs.length, icon: DollarSign, color: 'emerald' },
    { name: 'Statistical', count: statisticalKPIs.length, icon: BarChart3, color: 'blue' },
    { name: 'Categorical', count: categoricalKPIs.length, icon: Users, color: 'purple' },
    { name: 'Performance', count: performanceKPIs.length, icon: PerformanceIcon, color: 'orange' },
    { name: 'Operational', count: operationalKPIs.length, icon: Settings, color: 'cyan' },
    { name: 'Marketing', count: marketingKPIs.length, icon: Megaphone, color: 'pink' },
    { name: 'Sales', count: salesKPIs.length, icon: ShoppingBag, color: 'yellow' },
    { name: 'Analytics', count: analyticsKPIs.length, icon: Brain, color: 'indigo' },
  ].filter(stat => stat.count > 0);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Key Metrics Summary</h3>
          <p className="text-sm text-gray-600 mt-1">Overview of your data insights</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1 bg-white/50 border-gray-200">
          {validKPIs.length} of {kpis.length} metrics
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryStats.map((stat, index) => {
          const IconComponent = stat.icon;
          const colorClasses = {
            emerald: 'from-emerald-50 to-green-50 border-emerald-200 bg-emerald-100 text-emerald-600 text-emerald-800 text-emerald-700',
            blue: 'from-blue-50 to-indigo-50 border-blue-200 bg-blue-100 text-blue-600 text-blue-800 text-blue-700',
            purple: 'from-purple-50 to-violet-50 border-purple-200 bg-purple-100 text-purple-600 text-purple-800 text-purple-700',
            orange: 'from-orange-50 to-red-50 border-orange-200 bg-orange-100 text-orange-600 text-orange-800 text-orange-700',
            cyan: 'from-cyan-50 to-teal-50 border-cyan-200 bg-cyan-100 text-cyan-600 text-cyan-800 text-cyan-700',
            pink: 'from-pink-50 to-rose-50 border-pink-200 bg-pink-100 text-pink-600 text-pink-800 text-pink-700',
            yellow: 'from-yellow-50 to-amber-50 border-yellow-200 bg-yellow-100 text-yellow-600 text-yellow-800 text-yellow-700',
            indigo: 'from-indigo-50 to-purple-50 border-indigo-200 bg-indigo-100 text-indigo-600 text-indigo-800 text-indigo-700',
          };
          
          const colors = colorClasses[stat.color as keyof typeof colorClasses].split(' ');
          
          return (
            <div key={stat.name} className={`group p-4 bg-gradient-to-br ${colors[0]} ${colors[1]} rounded-xl border ${colors[2]} hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 ${colors[3]} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-5 w-5 ${colors[4]}`} />
                </div>
                <div>
                  <h4 className={`font-semibold ${colors[5]}`}>{stat.name}</h4>
                  <p className={`text-xs ${colors[4]}`}>
                    {stat.name === 'Financial' && 'Revenue & costs'}
                    {stat.name === 'Statistical' && 'Averages & trends'}
                    {stat.name === 'Categorical' && 'Groups & counts'}
                    {stat.name === 'Performance' && 'Speed & efficiency'}
                    {stat.name === 'Operational' && 'Process & workflow'}
                    {stat.name === 'Marketing' && 'Campaigns & reach'}
                    {stat.name === 'Sales' && 'Deals & revenue'}
                    {stat.name === 'Analytics' && 'Insights & data'}
                  </p>
                </div>
              </div>
              <div className={`text-2xl font-bold ${colors[6]}`}>{stat.count}</div>
              <p className={`text-sm ${colors[4]}`}>metrics calculated</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}