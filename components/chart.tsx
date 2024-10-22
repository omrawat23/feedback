"use client";

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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Feedback = InferSelectModel<typeof feedbacks>;

interface ChartProps {
  data: Feedback[];
}

interface CustomAxisTickProps {
  x: number;
  y: number;
  payload: {
    value: string | number;
  };
}

const chartConfig = {
  rating: { label: "User Ratings", color: "hsl(var(--primary))" },
};

const COLORS = ["#000000", "#333333", "#666666", "#999999", "#CCCCCC"];

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
    return data
      .map((feedback, index) => ({
        user: feedback.userName || `User ${index + 1}`,
        rating: feedback.rating !== null ? feedback.rating : null,
        message: feedback.message || "No message provided",
      }))
      .filter((item) => item.rating !== null);
  }, [data]);

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 640;
      setDimensions({
        width: window.innerWidth,
        height: isMobile
          ? Math.max(window.innerHeight * 0.8, 600)
          : Math.min(window.innerHeight * 0.7, 500),
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const isMobile = dimensions.width < 640;

  const renderCustomAxisTick = ({ x, y, payload }: CustomAxisTickProps) => {
    const isMobile = dimensions.width < 640;
    const limit = isMobile ? 10 : 15;
    const text =
      typeof payload.value === "string" && payload.value.length > limit
        ? `${payload.value.slice(0, limit)}...`
        : payload.value;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={isMobile ? 10 : 16}
          textAnchor={isMobile ? "end" : "middle"}
          fill="hsl(var(--muted-foreground))"
          fontSize={isMobile ? 10 : 12}
          className="text-xs sm:text-sm"
        >
          {text}
        </text>
      </g>
    );
  };

  const renderPieChart = () => (
    <PieChart width={dimensions.width} height={dimensions.height}>
      <Pie
        data={processedData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={Math.min(dimensions.width, dimensions.height) / 6}
        fill="#8884d8"
        dataKey="rating"
        label={({ user, rating }) => `${user}: ${rating}`}
      >
        {processedData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend layout="vertical" align="right" verticalAlign="middle" />
    </PieChart>
  );

  return (
    <div className="w-full h-full lg:mb-[-44px]">
      <CardContent className="p-0 sm:p-6">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={dimensions.height}>
            {isMobile ? (
              renderPieChart()
            ) : (
              <BarChart
                data={processedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="user"
                  interval={0}
                  tick={renderCustomAxisTick}
                  height={60}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                  label={{
                    value: "Rating",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      textAnchor: "middle",
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 14,
                    },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "14px",
                    color: "hsl(var(--muted-foreground))",
                  }}
                />
                <Bar
                  dataKey="rating"
                  fill={chartConfig.rating.color}
                  name={chartConfig.rating.label}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </div>
  );
}
