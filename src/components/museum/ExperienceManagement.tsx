
import { useState } from "react";
import { Plus, Edit, Trash2, Eye, BarChart3, Save, X, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line } from "recharts";

const experiences = [
  {
    id: 1,
    title: "Ancient Egyptian Artifacts",
    description: "Explore artifacts from ancient Egypt including pottery, jewelry, and ceremonial items.",
    type: "paid" as const,
    views: 1247,
    lastUpdated: "2 days ago",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&h=200&fit=crop",
    chartData: [
      { day: "Mon", views: 45 }, { day: "Tue", views: 52 }, { day: "Wed", views: 48 },
      { day: "Thu", views: 61 }, { day: "Fri", views: 55 }, { day: "Sat", views: 67 }, { day: "Sun", views: 58 }
    ]
  },
  {
    id: 2,
    title: "Renaissance Paintings Tour",
    description: "A guided tour through masterpieces of Renaissance art and their historical significance.",
    type: "free" as const,
    views: 892,
    lastUpdated: "1 week ago",
    thumbnail: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=300&h=200&fit=crop",
    chartData: [
      { day: "Mon", views: 35 }, { day: "Tue", views: 42 }, { day: "Wed", views: 38 },
      { day: "Thu", views: 51 }, { day: "Fri", views: 45 }, { day: "Sat", views: 57 }, { day: "Sun", views: 48 }
    ]
  },
  {
    id: 3,
    title: "Medieval Weapons Collection",
    description: "Discover the craftsmanship and history of medieval weaponry and armor.",
    type: "paid" as const,
    views: 654,
    lastUpdated: "3 days ago",
    thumbnail: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=200&fit=crop",
    chartData: [
      { day: "Mon", views: 25 }, { day: "Tue", views: 32 }, { day: "Wed", views: 28 },
      { day: "Thu", views: 41 }, { day: "Fri", views: 35 }, { day: "Sat", views: 47 }, { day: "Sun", views: 38 }
    ]
  },
  {
    id: 4,
    title: "Modern Art Gallery",
    description: "Contemporary works from renowned modern artists and emerging talents.",
    type: "free" as const,
    views: 1109,
    lastUpdated: "5 days ago",
    thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=200&fit=crop",
    chartData: [
      { day: "Mon", views: 55 }, { day: "Tue", views: 62 }, { day: "Wed", views: 58 },
      { day: "Thu", views: 71 }, { day: "Fri", views: 65 }, { day: "Sat", views: 77 }, { day: "Sun", views: 68 }
    ]
  },
];

const chartConfig = {
  views: { label: "Views", color: "hsl(var(--primary))" }
};

export function ExperienceManagement() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [newExperience, setNewExperience] = useState({
    title: "",
    description: "",
    type: "free",
    image: null
  });

  const startEditing = (id: number) => {
    setEditingId(id);
  };

  const stopEditing = () => {
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Experience Management</h2>
          <p className="text-slate-600 mt-1">Manage and monitor your museum experiences</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          {showAddForm ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add New Experience
            </>
          )}
        </Button>
      </div>

      {/* Inline Add Experience Form */}
      {showAddForm && (
        <Card className="border-2 border-primary/20 bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground">Add New Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">Title</Label>
                <Input
                  id="title"
                  value={newExperience.title}
                  onChange={(e) => setNewExperience(prev => ({...prev, title: e.target.value}))}
                  placeholder="Enter experience title"
                  className="border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground">Type</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={newExperience.type === "paid"}
                    onCheckedChange={(checked) => 
                      setNewExperience(prev => ({...prev, type: checked ? "paid" : "free"}))
                    }
                  />
                  <Label className="text-foreground">
                    {newExperience.type === "paid" ? "Paid" : "Free"} Experience
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea
                id="description"
                value={newExperience.description}
                onChange={(e) => setNewExperience(prev => ({...prev, description: e.target.value}))}
                placeholder="Enter experience description"
                className="border-input bg-background min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Image Upload</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload experience image</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => {
                  console.log("Saving experience:", newExperience);
                  setShowAddForm(false);
                  setNewExperience({ title: "", description: "", type: "free", image: null });
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Experience
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="border-border"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {experiences.map((experience, index) => (
          <Card 
            key={experience.id} 
            className="group transition-all duration-300 animate-slide-in-right border-0 bg-card hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
            onMouseEnter={() => setHoveredId(experience.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {editingId === experience.id ? (
              // Edit Mode
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Edit Experience</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={stopEditing}>
                      <X className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Input defaultValue={experience.title} placeholder="Experience title" />
                  <Textarea defaultValue={experience.description} placeholder="Description" />
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Paid Experience</label>
                    <Switch defaultChecked={experience.type === "paid"} />
                  </div>
                  
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload new image</p>
                  </div>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="relative">
                  <img 
                    src={experience.thumbnail} 
                    alt={experience.title}
                    className="w-full h-48 object-cover rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                    style={{ border: hoveredId === experience.id ? '2px solid hsl(var(--primary))' : '2px solid transparent' }}
                  />
                  
                  {/* Hover Chart Overlay */}
                  {hoveredId === experience.id && (
                    <div className="absolute inset-0 bg-black/60 rounded-t-lg flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-white/90 p-4 rounded-lg w-4/5">
                        <p className="text-xs text-foreground/80 mb-2">7-day views trend</p>
                        <ChartContainer config={chartConfig} className="h-16">
                          <LineChart data={experience.chartData}>
                            <Line 
                              type="monotone" 
                              dataKey="views" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              dot={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </LineChart>
                        </ChartContainer>
                      </div>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">{experience.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{experience.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={experience.type === "paid" ? "default" : "secondary"}
                          className={experience.type === "paid" ? "bg-primary/10 text-primary" : ""}
                        >
                          {experience.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Updated {experience.lastUpdated}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{experience.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => startEditing(experience.id)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

    </div>
  );
}
