import { Label, Pie, PieChart } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Envelope } from "@/lib/types";
import { useCurrencyHelper } from "@/lib/utils";
import { useMemo } from "react";

const pieChartColors = [
  "#FF6347", // Tomato
  "#1E3A8A",
  "#32CD32", // LimeGreen
  "#FFD700", // Gold
  "#8A2BE2", // BlueViolet
  "#FF1493", // DeepPink
  "#FF4500", // OrangeRed
  "#8B0000", // DarkRed
  "#00CED1", // DarkTurquoise
  "#FFD700", // Gold
  "#ADFF2F", // GreenYellow
  "#B8860B", // DarkGoldenRod
  "#00FF00", // Lime
  "#FF8C00", // DarkOrange
  "#C71585", // MediumVioletRed
  "#1E90FF", // DodgerBlue
  "#20B2AA", // LightSeaGreen
  "#D2691E", // Chocolate
  "#4B0082", // Indigo
  "#F08080", // LightCoral
  "#3CB371", // MediumSeaGreen
  "#0000FF", // Blue
  "#DC143C", // Crimson
  "#7FFF00", // Chartreuse
  "#FF6347", // Tomato
  "#228B22", // ForestGreen
  "#8B4513", // SaddleBrown
  "#BA55D3", // MediumOrchid
  "#5F9EA0", // CadetBlue
  "#9ACD32", // YellowGreen
];

export function EnvelopeSpendingCard({
  envelopeData,
}: {
  envelopeData: Envelope[];
}) {
  const envelopeChartConfig = useMemo(
    () =>
      envelopeData.reduce((config, envelope) => {
        config[envelope.id] = {
          label: envelope.name,
        };
        return config;
      }, {} as ChartConfig),
    [envelopeData],
  );

  const { format } = useCurrencyHelper();

  const totalSpend = useMemo(() => {
    return envelopeData.reduce(
      (acc, envelope) => acc + envelope.monthlySpend,
      0,
    );
  }, [envelopeData]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-center">
          Monthly Spends - By Envelope
        </CardTitle>
        <CardDescription>
          {new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 ">
        <ChartContainer
          config={envelopeChartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={envelopeData.map((envelope, index) => ({
                ...envelope,
                fill: pieChartColors[index % pieChartColors.length],
              }))}
              dataKey="monthlySpend"
              nameKey="id"
              innerRadius={75}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {format(totalSpend)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Spent this month
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
