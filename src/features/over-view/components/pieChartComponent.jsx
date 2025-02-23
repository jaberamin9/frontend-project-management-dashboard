'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
    active: {
        label: "Active Project",
        color: "#3498db"
    },
    review: {
        label: "Review Project",
        color: "#f39c12"
    },
    completed: {
        label: "Completed Project",
        color: "#2ecc71"
    }
};


export default function PieChartComponent({ data }) {
    if (!data) return <div className="flex flex-col">
        <Skeleton className="w-full h-full rounded-xl bg-[#161618] flex justify-center items-center p-4">
            <div className="gap-2 flex flex-col items-center">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="mt-6 h-[200px] w-[200px] rounded-full flex justify-center items-center">
                    <Skeleton className="h-[100px] w-[100px] rounded-full bg-[#161618]" />
                </Skeleton>
            </div>
        </Skeleton>
    </div>;

    let total = data.total || 0;
    let chartData = Object.entries(data || [])
        .filter(([key]) => key !== "total")
        .map(([key, val]) => ({
            name: key,
            project: val,
            fill: chartConfig[key].color
        }));

    return (
        <Card className='flex flex-col bg-[#161618] border-[0px] h-full'>
            <CardHeader className='items-center px-4 pt-4 pb-0 text-white'>
                <CardTitle>Showing Project Status</CardTitle>
                <div className='flex items-center gap-2'>
                    {chartData.map(item => (
                        <React.Fragment key={item.name}>
                            <div className=' w-2 h-2 bg-white' style={{ backgroundColor: chartConfig[item.name].color }}></div>
                            <p className='text-white text-xs'>{item.name}</p>
                        </React.Fragment>
                    ))}
                </div>
            </CardHeader>
            <CardContent className='flex-1 p-0'>
                <ChartContainer
                    config={chartConfig}
                    className='w-max-[500px] h-max-[280px] p-0'
                >
                    {total == 0 ?
                        <div className='w-[500px] h-[280px] flex justify-center items-center text-lg text-white'>
                            Currently you have no project assigned
                        </div> :
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey='project'
                                nameKey='name'
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor='middle'
                                                    dominantBaseline='middle'
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className='text-3xl font-bold fill-white'
                                                    >
                                                        {total.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className='fill-white'
                                                    >
                                                        Total Project
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    }
                </ChartContainer>
            </CardContent>
        </Card>
    );
}