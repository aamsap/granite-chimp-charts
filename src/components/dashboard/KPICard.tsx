import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
    title: string;
    value: string | number;
    description?: string;
    trend?: {
        value: number;
        label: string;
    };
    icon?: React.ReactNode;
    className?: string;
}

export function KPICard({
    title,
    value,
    description,
    trend,
    icon,
    className
}: KPICardProps) {
    const formatValue = (val: string | number) => {
        if (typeof val === 'number') {
            return val.toLocaleString();
        }
        return val;
    };

    const getTrendIcon = () => {
        if (!trend) return null;

        if (trend.value > 0) {
            return <TrendingUp className="h-4 w-4 text-green-500" />;
        } else if (trend.value < 0) {
            return <TrendingDown className="h-4 w-4 text-red-500" />;
        } else {
            return <Minus className="h-4 w-4 text-gray-500" />;
        }
    };

    const getTrendColor = () => {
        if (!trend) return "text-gray-500";

        if (trend.value > 0) return "text-green-500";
        if (trend.value < 0) return "text-red-500";
        return "text-gray-500";
    };

    return (
        <Card className={`hover:shadow-md transition-shadow ${className}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon && (
                    <div className="text-muted-foreground">
                        {icon}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatValue(value)}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
                {trend && (
                    <div className="flex items-center space-x-1 mt-2">
                        {getTrendIcon()}
                        <span className={`text-xs ${getTrendColor()}`}>
                            {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
