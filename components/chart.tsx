"use client"

import React, { useState, useEffect, useMemo } from "react";
import { InferSelectModel } from "drizzle-orm";
import { feedbacks } from "@/db/schema";
import { ChartContainer } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  TooltipProps,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Feedback = InferSelectModel<typeof feedbacks>;

interface ChartProps {
  data: Feedback[];
}

const chartConfig = {
  rating: { label: "User Ratings", color: "hsl(var(--primary))" },
};

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const { user, rating, message } = payload[0].payload;
    return (
      <Card className="max-w-xs">
        <CardHeader className="p-2">
          <CardTitle className="text-sm font-semibold">{user}</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <Badge variant="secondary" className="mb-1">
            Rating: {rating}
          </Badge>
          <p className="text-xs text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    );
  }
  return null;
};

export default function Chart({ data }: ChartProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const processedData = useMemo(() => {
    const filteredData = data
      .map((feedback, index) => ({
        user: feedback.userName || `User ${index + 1}`,
        rating: feedback.rating,
        message: feedback.message || "No message provided",
      }))
      .filter((item): item is { user: string; rating: number; message: string } =>
        item.rating !== null && item.rating !== undefined
      );

    // If there are more than 100 data points, aggregate the data
    if (filteredData.length > 100) {
      const aggregatedData = [];
      const chunkSize = Math.ceil(filteredData.length / 100);

      for (let i = 0; i < filteredData.length; i += chunkSize) {
        const chunk = filteredData.slice(i, i + chunkSize);
        const avgRating = chunk.reduce((sum, item) => sum + item.rating, 0) / chunk.length;
        aggregatedData.push({
          user: `Group ${Math.floor(i / chunkSize) + 1}`,
          rating: Number(avgRating.toFixed(2)),
          message: `Average of ${chunk.length} ratings`,
        });
      }

      return aggregatedData;
    }

    return filteredData;
  }, [data]);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = Math.min(
        width < 640 ? 300 : window.innerHeight * 0.6,
        450
      );
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const isMobile = dimensions.width < 640;
  const isLargeDataset = processedData.length > 100;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          dx={-2}
          textAnchor="end"
          fill="hsl(var(--muted-foreground))"
          fontSize={12}
          transform="rotate(-90)"
        >
          {!isMobile ? payload.value : ''}
        </text>
      </g>
    );
  };

  const chartMargins = useMemo(() => ({
    top: 10,
    right: 10,
    bottom: 0,
    left: 20,
  }), []);

  const renderChart = () => {
    let ChartComponent, DataComponent;

    if (isLargeDataset) {
      ChartComponent = AreaChart;
      DataComponent = (
        <Area
          type="monotone"
          dataKey="rating"
          stroke={chartConfig.rating.color}
          fill={chartConfig.rating.color}
          fillOpacity={0.3}
          name={chartConfig.rating.label}
        />
      );
    } else if (isMobile) {
      ChartComponent = LineChart;
      DataComponent = (
        <Line
          type="monotone"
          dataKey="rating"
          stroke={chartConfig.rating.color}
          strokeWidth={2}
          dot={{ r: 4, fill: chartConfig.rating.color }}
          name={chartConfig.rating.label}
        />
      );
    } else {
      ChartComponent = BarChart;
      DataComponent = (
        <Bar
          dataKey="rating"
          fill={chartConfig.rating.color}
          name={chartConfig.rating.label}
          radius={[4, 4, 0, 0]}
        />
      );
    }

    return (
      <ChartComponent
        data={processedData}
        margin={chartMargins}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="user"
          height={0}
          tick={customXAxisTick}
          interval={0}
        />
        <YAxis
          domain={[0, 5]}
          ticks={[0, 1, 2, 3, 4, 5]}
          width={5}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {DataComponent}
      </ChartComponent>
    );
  };

  return (
    <div className="w-full h-full">
      <CardContent className="p-0 sm:p-4">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={dimensions.height}>
            {renderChart()}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </div>
  );
}

