"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", detections: 18 },
  { month: "February", detections: 35 },
  { month: "March", detections: 23 },
  { month: "April", detections: 7 },
  { month: "May", detections: 29 },
  { month: "June", detections: 21 },
];

const chartConfig = {
  detections: {
    label: "Detections",
    color: "hsl(var(--primary))",
  },
}

export function DetectionChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-72">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="detections" fill="var(--color-detections)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
