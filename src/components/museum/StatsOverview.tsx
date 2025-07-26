
import { TrendingUp, Users, Clock, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

// Sample data for charts
const dailyVisitsData = [
  { day: "Mon", visits: 980 },
  { day: "Tue", visits: 1120 },
  { day: "Wed", visits: 1050 },
  { day: "Thu", visits: 1247 },
  { day: "Fri", visits: 1180 },
  { day: "Sat", visits: 1350 },
  { day: "Sun", visits: 1100 },
];

const experienceUsageData = [
  { name: "Free", value: 68, color: "hsl(var(--muted-foreground))" },
  { name: "Paid", value: 32, color: "hsl(var(--primary))" },
];

const codeRedemptionData = [
  { month: "Jan", generated: 45, submitted: 38 },
  { month: "Feb", generated: 52, submitted: 43 },
  { month: "Mar", generated: 48, submitted: 41 },
  { month: "Apr", generated: 61, submitted: 55 },
];

const chartConfig = {
  visits: { label: "Visits", color: "hsl(var(--primary))" },
  free: { label: "Free", color: "hsl(var(--muted-foreground))" },
  paid: { label: "Paid", color: "hsl(var(--primary))" },
  generated: { label: "Generated", color: "hsl(var(--muted-foreground))" },
  submitted: { label: "Submitted", color: "hsl(var(--primary))" },
};

export function StatsOverview() {
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
            <div className="text-2xl font-bold text-foreground mb-2">1,247</div>
            <div className="text-sm text-muted-foreground mb-3">+12% from yesterday</div>
            <ChartContainer config={chartConfig} className="h-16">
              <LineChart data={dailyVisitsData}>
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
          </CardContent>
        </Card>

        {/* Paid vs Free Donut Chart */}
        <Card className="border-0 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground">Experience Usage</CardTitle>
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-lg font-bold text-foreground">342 Paid</div>
                <div className="text-sm text-muted-foreground">725 Free</div>
              </div>
              <ChartContainer config={chartConfig} className="h-16 w-16">
                <PieChart>
                  <Pie
                    data={experienceUsageData}
                    dataKey="value"
                    innerRadius={12}
                    outerRadius={24}
                  >
                    {experienceUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
            <div className="text-sm text-muted-foreground">32% paid experiences</div>
          </CardContent>
        </Card>

        {/* Code Redemption Bar Chart */}
        <Card className="border-0 bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground">Code Redemption</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-2">90%</div>
            <div className="text-sm text-muted-foreground mb-3">Redemption rate</div>
            <ChartContainer config={chartConfig} className="h-16">
              <BarChart data={codeRedemptionData}>
                <Bar dataKey="generated" fill="hsl(var(--muted-foreground))" radius={2} />
                <Bar dataKey="submitted" fill="hsl(var(--primary))" radius={2} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
