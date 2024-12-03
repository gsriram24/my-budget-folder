import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { pieChartColors } from "@/lib/consts";
import { Expense } from "@/lib/types";
import { generateCumulativeData } from "@/lib/utils";
import { useMemo } from "react";
const chartConfig = {
  thisMonthAmount: {
    label: "Current Month",
  },
  prevMonthAmount: {
    label: "Previous Month",
  },
} satisfies ChartConfig;

interface ExpenseStackedChartProps {
  currentAndLastMonthExpenses: Expense[];
}

export function ExpenseStackedChart({
  currentAndLastMonthExpenses,
}: ExpenseStackedChartProps) {
  const cumulativeData = useMemo(
    () => generateCumulativeData(currentAndLastMonthExpenses),
    [currentAndLastMonthExpenses],
  );
  return (
    <Card className="max-h-2xl">
      <CardHeader>
        <CardTitle>Spending Comparison</CardTitle>
        <CardDescription>
          This month spends compared with the previous month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-80 w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={cumulativeData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickMargin={8} />

            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="thisMonthAmount"
              type="monotone"
              fill={pieChartColors[2]}
              stroke={pieChartColors[2]}
              fillOpacity={0.4}
              stackId="a"
            />
            <Area
              dataKey="prevMonthAmount"
              type="monotone"
              fill={pieChartColors[7]}
              stroke={pieChartColors[7]}
              fillOpacity={0.1}
              stackId="b"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>{" "}
      </CardContent>
    </Card>
  );
}
