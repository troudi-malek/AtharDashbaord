import { useState, useMemo, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, BarChart3, Save, X, Upload, Search, Users, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line } from "recharts";
import ExperienceDetails from "./ExperienceDetail";
import { GetExperiences, CreateExperience, UpdateExperience, DeleteExperience } from "@/services/experienceService";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { getMediaUrl } from "@/lib/media";

const chartConfig = {
  views: { label: "Views", color: "hsl(var(--primary))" }
};

export function ExperienceManagement({ museumId }: { museumId: string }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  // Removed details view navigation
  const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState<string>("all");
  // const [typeFilter, setTypeFilter] = useState<string>("all");
  const [newExperience, setNewExperience] = useState<any>({
    name: "",
    description: "",
    ArtifactImage: null as File | null,
    points: 0,
  });

  const [editForm, setEditForm] = useState<any>({
    name: "",
    description: "",
    ArtifactImage: null as File | null,
    points: 0,
  });

  const [isDraggingAdd, setIsDraggingAdd] = useState(false);
  const [isDraggingEdit, setIsDraggingEdit] = useState(false);

  // Replace static experiences with API data
  const [experiences, setExperiences] = useState<any[]>([]);
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperiences() {
      const response = await GetExperiences(museumId);
      const data = Array.isArray(response)
        ? response
        : response?.experiences ?? response?.data?.experiences ?? response?.data ?? [];
      setExperiences(Array.isArray(data) ? data : []);
    }
    fetchExperiences().catch((error) => {
      console.error("Failed to load experiences:", error);
    }
    );
  }, [museumId]);

  const filteredExperiences = useMemo(() => {
    return experiences.filter((experience) => {
      const matchesSearch = experience.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           experience.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [experiences, searchTerm]);

  const stats = useMemo(() => {
    const totalExperiences = experiences.length;
    const totalViews = experiences.reduce((sum, exp) => sum + (Number(exp.totalViews ?? exp.views) || 0), 0);
    const totalVisitors = experiences.reduce((sum, exp) => sum + (Number(exp.totalVisitors ?? exp.visitors) || 0), 0);
    return {
      totalExperiences,
      totalViews,
      totalVisitors
    };
  }, [experiences]);

  const startEditing = (id: number) => {
    setEditingId(id);
    const exp = experiences.find((e) => e._id === id);
    if (exp) {
      setEditForm({
        name: exp.name || "",
        description: exp.description || "",
        ArtifactImage: null,
        points: Number(exp.points || 0),
      });
    }
  };

  const stopEditing = () => {
    setEditingId(null);
  };

  if (selectedExperienceId) {
    return (
      <ExperienceDetails
        experienceId={selectedExperienceId}
        onBack={() => setSelectedExperienceId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Centered Title */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-foreground mb-2">Experience Management</h2>
        <p className="text-muted-foreground text-lg">Manage and monitor your museum experiences</p>
        <div className="flex justify-center mt-4">
          <div className="w-24 h-1 bg-primary rounded-full"></div>
        </div>
      </div>
      <div className="flex justify-end mb-4">
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

      {/* Insights Section */}
     

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{stats.totalExperiences}</p>
                <p className="text-xs text-muted-foreground">Total Experiences</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{stats.totalViews}</p>
                <p className="text-xs text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{stats.totalVisitors}</p>
                <p className="text-xs text-muted-foreground">Total Visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search only */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search experiences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Inline Add Experience Form */}
      {showAddForm && (
        <Card className="border-2 border-primary/20 bg-card mt-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground">Add New Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Name</Label>
                  <Input
                    id="name"
                    value={newExperience.name || ""}
                    onChange={(e) => setNewExperience((prev: any) => ({...prev, name: e.target.value}))}
                    placeholder="Enter experience name"
                    className="border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    value={newExperience.description || ""}
                    onChange={(e) => setNewExperience((prev: any) => ({...prev, description: e.target.value}))}
                    placeholder="Enter experience description"
                    className="border-input bg-background min-h-[120px]"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-foreground">Points Reward</Label>
                  <div className="rounded-lg border border-border p-4 bg-background">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-muted-foreground">Reward points for scanning</span>
                      </div>
                      <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-300">{newExperience.points} pts</Badge>
                    </div>
                    <div className="mt-3">
                      <Slider
                        value={[Number(newExperience.points || 0)]}
                        onValueChange={(v) => setNewExperience((p: any) => ({...p, points: v[0]}))}
                        min={0}
                        max={500}
                        step={5}
                      />
                      <div className="mt-3 flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={10000}
                          value={newExperience.points}
                          onChange={(e) => setNewExperience((p: any) => ({...p, points: Math.max(0, Number(e.target.value || 0))}))}
                          className="w-28"
                        />
                        <span className="text-sm text-muted-foreground">You can fine-tune the value here</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Artifact Image</Label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingAdd(true); }}
                  onDragLeave={() => setIsDraggingAdd(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingAdd(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
                      setNewExperience((prev: any) => ({...prev, ArtifactImage: file }));
                    }
                  }}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDraggingAdd ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"}`}
                  onClick={() => {
                    const input = document.getElementById("add-image-input") as HTMLInputElement | null;
                    input?.click();
                  }}
                >
                  <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag and drop an image here, or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG or JPG up to ~5MB</p>
                  {newExperience.ArtifactImage && (
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <img
                        src={URL.createObjectURL(newExperience.ArtifactImage)}
                        alt="preview"
                        className="w-24 h-24 object-cover rounded-md border"
                      />
                      <div className="text-left">
                        <p className="text-sm text-foreground font-medium truncate max-w-[200px]">
                          {newExperience.ArtifactImage.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{Math.round(newExperience.ArtifactImage.size/1024)} KB</p>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  id="add-image-input"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => setNewExperience((prev: any) => ({ ...prev, ArtifactImage: e.target.files?.[0] || null }))}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={async () => {
                  const formData = new FormData();
                  formData.append("name", newExperience.name || "");
                  formData.append("description", newExperience.description || "");
                  formData.append("points", String(newExperience.points ?? 0));
                  if (newExperience.ArtifactImage) {
                    formData.append("ArtifactImage", newExperience.ArtifactImage);
                  }
                  await CreateExperience(formData, museumId);
                  const response = await GetExperiences(museumId);
                  const data = Array.isArray(response)
                    ? response
                    : response?.experiences ?? response?.data?.experiences ?? response?.data ?? [];
                  setExperiences(Array.isArray(data) ? data : []);
                  setShowAddForm(false);
                  setNewExperience({ name: "", description: "", ArtifactImage: null, points: 0 });
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredExperiences.map((experience, index) => (
          <Card 
            key={experience._id} 
            className="group transition-all duration-300 animate-slide-in-right border-0 bg-card hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
            onMouseEnter={() => setHoveredId(experience._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {editingId === experience._id ? (
              // Edit Mode
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Edit Experience</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={stopEditing}>
                      <X className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground" onClick={async () => {
                      const formData = new FormData();
                      formData.append("name", editForm.name || "");
                      formData.append("description", editForm.description || "");
                      formData.append("points", String(editForm.points ?? 0));
                      if (editForm.ArtifactImage) {
                        formData.append("ArtifactImage", editForm.ArtifactImage);
                      }
                      await UpdateExperience(String(experience._id), formData);
                      const response = await GetExperiences(museumId);
                      const data = Array.isArray(response)
                        ? response
                        : response?.experiences ?? response?.data?.experiences ?? response?.data ?? [];
                      setExperiences(Array.isArray(data) ? data : []);
                      stopEditing();
                    }}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Input value={editForm.name} onChange={(e) => setEditForm((p: any) => ({...p, name: e.target.value}))} placeholder="Experience title" />
                  <Textarea value={editForm.description} onChange={(e) => setEditForm((p: any) => ({...p, description: e.target.value}))} placeholder="Description" />
                  <div className="space-y-3">
                    <Label className="text-foreground">Points Reward</Label>
                    <div className="rounded-lg border border-border p-4 bg-background">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm text-muted-foreground">Reward points for scanning</span>
                        </div>
                        <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-300">{editForm.points} pts</Badge>
                      </div>
                      <div className="mt-3">
                        <Slider
                          value={[Number(editForm.points || 0)]}
                          onValueChange={(v) => setEditForm((p: any) => ({...p, points: v[0]}))}
                          min={0}
                          max={500}
                          step={5}
                        />
                        <div className="mt-3 flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={10000}
                            value={editForm.points}
                            onChange={(e) => setEditForm((p: any) => ({...p, points: Math.max(0, Number(e.target.value || 0))}))}
                            className="w-28"
                          />
                          <span className="text-sm text-muted-foreground">Fine-tune value</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-foreground">Update Image</Label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingEdit(true); }}
                      onDragLeave={() => setIsDraggingEdit(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingEdit(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
                          setEditForm((prev: any) => ({...prev, ArtifactImage: file }));
                        }
                      }}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDraggingEdit ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"}`}
                      onClick={() => {
                        const input = document.getElementById("edit-image-input-" + experience._id) as HTMLInputElement | null;
                        input?.click();
                      }}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Drag and drop or click to upload new image</p>
                      {(editForm.ArtifactImage) && (
                        <div className="mt-4 flex items-center justify-center gap-3">
                          <img
                            src={URL.createObjectURL(editForm.ArtifactImage)}
                            alt="preview"
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                          <div className="text-left">
                            <p className="text-sm text-foreground font-medium truncate max-w-[200px]">
                              {editForm.ArtifactImage.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{Math.round(editForm.ArtifactImage.size/1024)} KB</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      id={`edit-image-input-${experience._id}`}
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      onChange={(e) => setEditForm((p: any) => ({...p, ArtifactImage: e.target.files?.[0] || null}))}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="relative">
                  <img 
                    src={getMediaUrl(experience.ArtifactImage)}
                    alt={experience.name}
                    className="w-full h-48 object-cover rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                    style={{ border: hoveredId === experience._id ? '2px solid hsl(var(--primary))' : '2px solid transparent' }}
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-500 text-yellow-950 hover:bg-yellow-500">{Number(experience.points || 0)} pts</Badge>
                  </div>
                  
                  {/* Hover Chart Overlay */}
                  {hoveredId === experience._id && (
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
                      <CardTitle className="text-lg text-foreground">{experience.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{experience.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-muted-foreground">
                          Access Code: {experience.Access_code}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Updated {experience.updatedAt ? new Date(experience.updatedAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Eye className="w-4 h-4" />
                      <span>{Number(experience.totalViews ?? experience.views ?? 0).toLocaleString()} Total Views</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-foreground font-medium">{Number(experience.points || 0)} points per scan</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedExperienceId(experience._id)}
                        className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        See Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => startEditing(experience._id)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={async () => {
                        await DeleteExperience(String(experience._id));
                        const response = await GetExperiences(museumId);
                        const data = Array.isArray(response)
                          ? response
                          : response?.experiences ?? response?.data?.experiences ?? response?.data ?? [];
                        setExperiences(Array.isArray(data) ? data : []);
                      }}>
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
    </div>      );
}