
import { Building2, Users, DollarSign, Shield, TrendingUp, Activity, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

const globalStats = [
  {
    title: "Total Museums",
    value: "24",
    change: "+2 this month",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Cumulative Visits",
    value: "45,678",
    change: "+18% this week",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Total Revenue",
    value: "$128,450",
    change: "+22% this month",
    icon: DollarSign,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    title: "Active Admins",
    value: "12",
    change: "All systems operational",
    icon: Shield,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

// Chart data
const globalVisitsTrend = [
  { month: "Jan", visits: 12500 },
  { month: "Feb", visits: 14200 },
  { month: "Mar", visits: 16800 },
  { month: "Apr", visits: 15600 },
  { month: "May", visits: 18900 },
  { month: "Jun", visits: 21400 },
];

const topMuseumsByVisits = [
  { name: "Metropolitan Museum", visits: 8420 },
  { name: "Louvre Museum", visits: 7850 },
  { name: "British Museum", visits: 6930 },
  { name: "Science Discovery", visits: 5240 },
  { name: "History Museum", visits: 4180 },
];

const adminActivityData = [
  { name: "Active", value: 75, color: "hsl(var(--primary))" },
  { name: "Inactive", value: 25, color: "hsl(var(--muted-foreground))" },
];

const totalActiveCodesData = [
  { day: "Mon", codes: 145 },
  { day: "Tue", codes: 167 },
  { day: "Wed", codes: 142 },
  { day: "Thu", codes: 189 },
  { day: "Fri", codes: 156 },
  { day: "Sat", codes: 198 },
  { day: "Sun", codes: 178 },
];

const chartConfig = {
  visits: { label: "Visits", color: "hsl(var(--primary))" },
  codes: { label: "Codes", color: "hsl(var(--primary))" },
};

export function GlobalStats() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Global Overview</h2>
        <p className="text-slate-600 mt-1">System-wide statistics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {globalStats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="hover:shadow-lg transition-all duration-300 animate-scale-in border-0 bg-white/80 backdrop-blur-sm"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-green-600 font-medium">
                  {stat.change}
                </span>
              </div>
              <Progress 
                value={Math.random() * 100} 
                className="mt-3 h-2" 
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Visits Trend */}
        <Card className="border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Global Visits Trend</CardTitle>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-4">21.4K This Month</div>
            <ChartContainer config={chartConfig} className="h-48">
              <LineChart data={globalVisitsTrend}>
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top 5 Museums by Visits */}
        <Card className="border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Top 5 Museums by Visits</CardTitle>
              <Building2 className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-4">42.5K Total</div>
            <ChartContainer config={chartConfig} className="h-48">
              <BarChart data={topMuseumsByVisits} layout="horizontal">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Admin Activity */}
        <Card className="border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Admin Activity</CardTitle>
              <Activity className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-foreground">75%</div>
                <div className="text-sm text-muted-foreground">Active Rate</div>
              </div>
              <ChartContainer config={chartConfig} className="h-20 w-20">
                <PieChart>
                  <Pie
                    data={adminActivityData}
                    dataKey="value"
                    innerRadius={16}
                    outerRadius={32}
                  >
                    {adminActivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Admins</span>
                <span className="font-medium text-foreground">9</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Inactive</span>
                <span className="font-medium text-foreground">3</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Active Codes */}
        <Card className="border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Total Active Codes</CardTitle>
              <QrCode className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-4">1,275 Active</div>
            <ChartContainer config={chartConfig} className="h-48">
              <BarChart data={totalActiveCodesData}>
                <Bar dataKey="codes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
