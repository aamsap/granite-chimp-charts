import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BarChartProps {
    data: any[];
    xAxisKey: string;
    yAxisKey: string;
    title: string;
    description?: string;
    color?: string;
    className?: string;
}

const chartConfig = {
    count: {
        label: "Count",
        color: "hsl(var(--chart-1))",
    },
    revenue: {
        label: "Revenue",
        color: "hsl(var(--chart-2))",
    },
    quantity: {
        label: "Quantity",
        color: "hsl(var(--chart-3))",
    },
    value: {
        label: "Value",
        color: "hsl(var(--chart-4))",
    },
};

export function BarChart({
    data,
    xAxisKey,
    yAxisKey,
    title,
    description,
    color = "hsl(var(--chart-1))",
    className
}: BarChartProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                    <RechartsBarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey={xAxisKey}
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey={yAxisKey}
                            fill={color}
                            radius={[4, 4, 0, 0]}
                        />
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
