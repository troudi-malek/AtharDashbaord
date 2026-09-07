import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Eye, Users, TrendingUp, MapPin, Star, Download, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { GetExperienceById } from "@/services/experienceService";

interface ExperienceDetailsProps {
  experienceId: string;
  onBack: () => void;
}

const chartColors = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted-foreground))"
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function ExperienceDetails({ experienceId, onBack }: ExperienceDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [experienceData, setExperienceData] = useState<any | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      let data;
      try {
        data = await GetExperienceById(String(experienceId));
      } catch (err) {
        console.error("API fetch failed, using static data", err);
      }

      const fallback = {
        _id: "68a88bd5e7ef55e0b103bfad",
        name: "Musée national du Bardo",
        description:
          "Le musée national du Bardo est un musée de Tunis, capitale de la Tunisie, situé dans un ancien palais beylical. Il est particulièrement réputé pour sa riche collection de mosaïques romaines, l'une des plus importantes au monde.",
        ArtifactImage: "musee-bardo-tunis-mosaique-collection-68a88bd5e7ef55e0b103bfad.jpg",
        type: "paid",
        price: 20,
        rating: 4.7,
        duration: "2h - 3h",
        totalViews: 25,
        totalVisitors: 15,
        revenueGenerated: 205,
        totalReviews: 5,
        createdAt: "2025-08-22T15:25:09.720+00:00",
        location: "Tunis",
        tags: [],
        weeklyStats: [
          { day: "Mon", views: 2 },
          { day: "Tue", views: 4 },
          { day: "Wed", views: 7 },
          { day: "Thu", views: 2 },
          { day: "Fri", views: 3 },
          { day: "Sat", views: 2 },
          { day: "Sun", views: 5 },
        ],
        monthlyTrend: [
          { month: "Jan", visits: 2, revenue: 30 },
          { month: "Feb", visits: 1, revenue: 20 },
          { month: "Mar", visits: 7, revenue: 30 },
          { month: "Apr", visits: 10, revenue: 50 },
          { month: "May", visits: 3, revenue: 60 },
          { month: "Jun", visits: 2, revenue: 35 },
        ],
        ageGroups: [
          { name: "<18", value: 10, count: 120 },
          { name: "18-24", value: 25, count: 300 },
          { name: "25-34", value: 35, count: 420 },
          { name: "35+", value: 30, count: 360 },
        ],
        feedbackSummary: {
          excellent: 65,
          good: 20,
          average: 10,
          poor: 5,
        },
      };

      const normalized = {
        // Basic info
        title: data?.name || fallback.name,
        description: data?.description || fallback.description,
        thumbnail:
          data?.thumbnail ||
          (data?.ArtifactImage
            ? `http://localhost:5000/uploads/${data.ArtifactImage}`
            : `http://localhost:5000/uploads/${fallback.ArtifactImage}`),
        type: data?.type || fallback.type,
        price: data?.price || fallback.price,
        rating: data?.rating || fallback.rating,
        duration: data?.duration || fallback.duration,
        // Stats
        totalViews: data?.totalViews ?? data?.views ?? fallback.totalViews,
        totalVisitors: data?.totalVisitors ?? data?.visitors ?? fallback.totalVisitors,
        revenueGenerated: data?.revenueGenerated ?? data?.revenue ?? fallback.revenueGenerated,
        totalReviews: data?.totalReviews ?? fallback.totalReviews,
        // Meta
        createdDate: data?.createdDate || data?.createdAt || fallback.createdAt,
        location: data?.location || fallback.location,
        tags: data?.tags || fallback.tags,
        // Charts
        weeklyStats: data?.weeklyStats || fallback.weeklyStats,
        monthlyTrend: data?.monthlyTrend || fallback.monthlyTrend,
        ageGroups: data?.ageGroups || fallback.ageGroups,
        feedbackSummary: data?.feedbackSummary || fallback.feedbackSummary,
      };

      setExperienceData(normalized);
      console.log("Experience Details:", normalized);
    }
    fetchDetail();
  }, [experienceId]);

  if (!experienceData) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <span className="text-muted-foreground">Loading experience details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Experiences
        </Button>
        <div className="h-6 w-px bg-border"></div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{experienceData.title}</h1>
          <p className="text-muted-foreground">Experience Details & Analytics</p>
        </div>
      </div>

      {/* Hero Section */}
      <Card className="overflow-hidden">
        <div className="relative h-64">
          <img 
            src={experienceData.thumbnail} 
            alt={experienceData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {experienceData.type === "paid" ? `$${experienceData.price}` : "Free"}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Star className="w-3 h-3 mr-1" />
                {experienceData.rating}
              </Badge>
             
            </div>
            <p className="text-white/90 text-sm max-w-2xl">{experienceData.description}</p>
          </div>
          <div className="absolute top-6 right-6 flex gap-2">
            <Button size="sm" variant="secondary" className="bg-white/20 text-white border-white/30">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button size="sm" variant="secondary" className="bg-white/20 text-white border-white/30">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{experienceData.totalViews?.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{experienceData.totalVisitors?.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${experienceData.revenueGenerated?.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Revenue Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{experienceData.rating}/5</p>
                <p className="text-sm text-muted-foreground">{experienceData.totalReviews} Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ views: { label: "Views", color: chartColors.primary } }} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={experienceData.weeklyStats}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="views" 
                        stroke={chartColors.primary} 
                        strokeWidth={3}
                        dot={{ fill: chartColors.primary, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Experience Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{experienceData.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">Created: {new Date(experienceData.createdDate).toLocaleDateString()}</span>
                </div>
              
                <div className="pt-4">
                 
                  <div className="flex flex-wrap gap-2">
                    {experienceData.tags?.map((tag: string) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Visitor Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ visits: { label: "Visits", color: chartColors.secondary } }} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={experienceData.monthlyTrend}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="visits" fill={chartColors.secondary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend in DT</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ revenue: { label: "Revenue", color: chartColors.accent } }} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={experienceData.monthlyTrend}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke={chartColors.accent} 
                        strokeWidth={3}
                        dot={{ fill: chartColors.accent, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Group Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={experienceData.ageGroups}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }: any) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {experienceData.ageGroups?.map(( index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Visitor Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {experienceData.ageGroups?.map((group: any) => (
                  <div key={group.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-foreground">{group.name}</span>
                      <span className="text-sm text-muted-foreground">{group.count} visitors</span>
                    </div>
                    <Progress value={group.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Excellent</span>
                    <span className="text-sm text-muted-foreground">{experienceData.feedbackSummary?.excellent}%</span>
                  </div>
                  <Progress value={experienceData.feedbackSummary?.excellent} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Good</span>
                    <span className="text-sm text-muted-foreground">{experienceData.feedbackSummary?.good}%</span>
                  </div>
                  <Progress value={experienceData.feedbackSummary?.good} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Average</span>
                    <span className="text-sm text-muted-foreground">{experienceData.feedbackSummary?.average}%</span>
                  </div>
                  <Progress value={experienceData.feedbackSummary?.average} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Poor</span>
                    <span className="text-sm text-muted-foreground">{experienceData.feedbackSummary?.poor}%</span>
                  </div>
                  <Progress value={experienceData.feedbackSummary?.poor} className="h-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-sm text-foreground">"Amazing experience! The artifacts were well preserved and the information was fascinating."</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="w-3 h-3 text-gray-300" />
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm text-foreground">"Great collection, though I wish there was more interactive content."</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ExperienceDetails;