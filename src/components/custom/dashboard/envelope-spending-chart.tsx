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
import { pieChartColors } from "@/lib/consts";

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

  const envelopeChartData = useMemo(
    () =>
      envelopeData.map((envelope, index) => ({
        ...envelope,
        fill: pieChartColors[index % pieChartColors.length],
      })),
    [envelopeData],
  );

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
              data={envelopeChartData}
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
