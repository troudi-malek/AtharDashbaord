
import { TrendingUp, Users, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { GetMuseumById } from "@/services/museumsService";

// No static fallback data. Charts will render only with API data.

const chartConfig = {
  visits: { label: "Visits", color: "hsl(var(--primary))" },
  views: { label: "Views", color: "hsl(var(--primary))" },
  visitors: { label: "Visitors", color: "hsl(var(--muted-foreground))" },
  generated: { label: "Generated", color: "hsl(var(--muted-foreground))" },
  submitted: { label: "Submitted", color: "hsl(var(--primary))" },
};

interface StatsOverviewProps {
  museumId?: string;
}

export function StatsOverview({ museumId }: StatsOverviewProps) {
  const [apiData, setApiData] = useState<any | null>(null);

  useEffect(() => {
    if (!museumId) return;
    GetMuseumById(museumId).then((response) => {
      setApiData({ ...(response?.data ?? {}), ...response });
    });
  }, [museumId]);

  const dailyVisits = apiData?.dailyVisits ?? 0;
  const codeRedemptionPercentage = apiData?.codeRedemptionPercentage ?? 0;
  const experienceViews = Array.isArray(apiData?.experienceViews) ? apiData!.experienceViews : [];

  const dailyVisitsChartData = useMemo(() => {
    const series = Array.isArray((apiData as any)?.dailyVisitsSeries)
      ? (apiData as any).dailyVisitsSeries
      : [];
    const mapped = series
      .map((item: any, index: number) => ({
        day: item?.day || item?.label || `#${index + 1}`,
        visits: Number(item?.visits ?? item?.value ?? 0),
      }))
      .slice(0, 7);
    return mapped;
  }, [apiData?.dailyVisitsSeries]);

  const performanceData = useMemo(() => {
    if (!experienceViews.length) return [] as Array<{ day: string; views: number; visitors: number }>;
    const mapped = experienceViews
      .map((item: any, index: number) => ({
        day: item?.day || item?.label || `#${index + 1}`,
        views: Number(item?.views) || 0,
        visitors: Number(item?.visitors) || 0,
      }))
      .slice(0, 7);
    return mapped;
  }, [experienceViews]);

  return (
    <div className="space-y-6">
      {/* Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Visits Sparkline */}
        <Card className="border-0 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground">Daily Visits</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-2">{dailyVisits.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mb-3">Today</div>
            {dailyVisitsChartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-16">
                <LineChart data={dailyVisitsChartData}>
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="text-xs text-muted-foreground">No trend data available</div>
            )}
          </CardContent>
        </Card>

        {/* Experience Performance */}
        <Card className="border-0 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground">Experience Performance</CardTitle>
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-lg font-bold text-foreground">{performanceData.reduce((s: number, d: any) => s + (d.views || 0), 0).toLocaleString()} Views</div>
                <div className="text-sm text-muted-foreground">{performanceData.reduce((s: number, d: any) => s + (d.visitors || 0), 0).toLocaleString()} Visitors</div>
              </div>
              {performanceData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-16 w-28">
                  <BarChart data={performanceData}>
                    <Bar dataKey="views" fill="hsl(var(--primary))" radius={2} />
                    <Bar dataKey="visitors" fill="hsl(var(--muted-foreground))" radius={2} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="text-xs text-muted-foreground">No performance data</div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">Weekly engagement trend</div>
          </CardContent>
        </Card>

        {/* Code Redemption */}
        <Card className="border-0 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground">Code Redemption</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-2">{Number(codeRedemptionPercentage).toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground mb-3">Redemption rate</div>
            <Progress value={Math.max(0, Math.min(100, Number(codeRedemptionPercentage)))} className="h-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
