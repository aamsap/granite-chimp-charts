import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PieChartProps {
    data: any[];
    dataKey: string;
    nameKey: string;
    title: string;
    description?: string;
    colors?: string[];
    className?: string;
}

const defaultColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

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

export function PieChart({
    data,
    dataKey,
    nameKey,
    title,
    description,
    colors = defaultColors,
    className
}: PieChartProps) {
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
                    <RechartsPieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey={dataKey}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                    </RechartsPieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
