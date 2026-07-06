import { useEffect, useState } from "react";
import { Building2, Users, DollarSign, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { GetGlobalMuseumStats, GetMuseumIncome } from "@/services/museumsService";

type StatsResponse = {
  totalMuseums: number;
  cumulativeVisits: number;
  totalRevenue: number;
  activeAdmins: number;
};

type IncomeItem = {
  museumId: string;
  name: string;
  income: number;
  purchaseCount: number;
};

export function GlobalStats() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [income, setIncome] = useState<IncomeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([GetGlobalMuseumStats(), GetMuseumIncome()])
      .then(([statsRes, incomeRes]) => {
        if (!mounted) return;
        setStats(statsRes?.data ?? statsRes ?? null);
        setIncome(incomeRes?.data ?? incomeRes ?? []);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const tnd = (v: number) =>
    new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Global Overview</h2>
        <p className="text-slate-600 mt-1">System-wide statistics and insights</p>
      </div>

      {loading && (
        <div className="text-sm text-muted-foreground">Loading latest statistics…</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Museums", value: stats?.totalMuseums ?? '-', icon: Building2, color: "text-blue-600", bgColor: "bg-blue-50" },
          { title: "Cumulative Visits", value: stats?.cumulativeVisits ?? '-', icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
          { title: "Total Revenue (TND)", value: stats ? tnd(stats.totalRevenue) : '-', icon: DollarSign, color: "text-amber-600", bgColor: "bg-amber-50" },
          { title: "Active Admins", value: stats?.activeAdmins ?? '-', icon: Shield, color: "text-purple-600", bgColor: "bg-purple-50" },
        ].map((stat, index) => (
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
              <Progress value={100} className="mt-3 h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Museum Revenue Overview</CardTitle>
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-4">Income by Museum (TND)</div>
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <BarChart
                  data={income}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => tnd(Number(v))} />
                  <Tooltip formatter={(value, name) => name === "income" ? [tnd(Number(value)), 'Income (TND)'] : [value, 'Codes Sold']} />
                  <Legend />
                  <Bar dataKey="income" name="Income (TND)" fill="#8884d8" />
                  <Bar dataKey="purchaseCount" name="Codes Sold" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="p-4 shadow-lg rounded-2xl">
          <CardContent className="space-y-4">
            <div className="text-xl font-semibold">Notes</div>
            <div className="text-sm text-muted-foreground">
              All revenue values are displayed in Tunisian Dinar (TND).
            </div>
            <div className="text-sm text-muted-foreground">
              Number of scanned QR codes per museum:
            </div>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={income}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Scanned QR Codes']} />
                  <Legend />
                  <Bar dataKey="purchaseCount" name="Scanned QR Codes" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
