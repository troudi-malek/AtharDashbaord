import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GetExperiences, CreateExperience, UpdateExperience, DeleteExperience } from "@/services/admin/experienceService";

export function ExperienceManagement() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [newExperience, setNewExperience] = useState({ name: "", description: "", type: "FREE" });
  const [editedExperience, setEditedExperience] = useState({ name: "", description: "", type: "FREE" });
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const data = await GetExperiences();
    setExperiences(Array.isArray(data) ? data : data?.data || []);
    setLoading(false);
  };

  const handleAddExperience = async () => {
    try {
      setError(null);
      const result = await CreateExperience(newExperience);
      if (!result || result.success === false) {
        setError(result?.message || "Failed to add experience.");
        return;
      }
      setShowAddForm(false);
      setNewExperience({ name: "", description: "", type: "FREE" });
      fetchExperiences();
    } catch (err) {
      setError("Failed to add experience.");
    }
  };

  const handleDeleteExperience = async (id) => {
    await DeleteExperience(id);
    fetchExperiences();
  };

  const startEditing = (experience) => {
    setEditingId(experience._id);
    setEditedExperience({
      name: experience.name,
      description: experience.description,
      type: experience.type,
    });
  };

  const stopEditing = () => {
    setEditingId(null);
    setEditedExperience({ name: "", description: "", type: "FREE" });
  };

  const saveEditedExperience = async () => {
    await UpdateExperience(editingId, editedExperience);
    stopEditing();
    fetchExperiences();
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
      {showAddForm && (
        <Card className="border-2 border-primary/20 bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground">Add New Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-red-500 font-medium mb-2">{error}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Name</Label>
                <Input
                  id="name"
                  value={newExperience.name}
                  onChange={(e) => setNewExperience(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter experience name"
                  className="border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground">Type</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={newExperience.type === "PREMIUM"}
                    onCheckedChange={(checked) => 
                      setNewExperience(prev => ({...prev, type: checked ? "PREMIUM" : "FREE"}))
                    }
                  />
                  <Label className="text-foreground">
                    {newExperience.type === "PREMIUM" ? "Premium" : "Free"} Experience
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
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleAddExperience}
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
      {loading ? (
        <div>Loading experiences...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.isArray(experiences) && experiences.length > 0 ? experiences.map((experience, index) => (
            <Card 
              key={experience._id || index} 
              className="group transition-all duration-300 animate-slide-in-right border-0 bg-card hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredId(experience._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative">
                <img 
                  src={experience.idMuseum?.imageUrl ? `http://localhost:5000/uploads/${experience.idMuseum.imageUrl}` : "https://via.placeholder.com/300x200?text=No+Image"} 
                  alt={experience.name}
                  className="w-full h-48 object-cover rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                  style={{ border: hoveredId === experience._id ? '2px solid hsl(var(--primary))' : '2px solid transparent' }}
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-lg text-foreground">{experience.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{experience.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant={experience.type === "PREMIUM" ? "default" : "secondary"}
                      className={experience.type === "PREMIUM" ? "bg-primary/10 text-primary" : ""}
                    >
                      {experience.type}
                    </Badge>
                    {experience.Access_code && (
                      <span className="text-xs bg-muted px-2 py-1 rounded ml-2">Access Code: {experience.Access_code}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>Museum: {experience.idMuseum?.name || "-"}</span>
                    <span>|</span>
                    <span>Location: {experience.idMuseum?.location || "-"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Created: {experience.createdAt ? new Date(experience.createdAt).toLocaleString() : "-"}
                  </div>
                </div>
              </CardHeader>
              
              {editingId === experience._id ? (
  <div className="p-6 space-y-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-foreground">Edit Experience</h3>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={stopEditing}>
          <X className="w-4 h-4" />
        </Button>
        <Button size="sm" className="bg-primary text-primary-foreground" onClick={saveEditedExperience}>
          <Save className="w-4 h-4" />
        </Button>
      </div>
    </div>

    <div className="space-y-3">
      <Input 
        value={editedExperience.name}
        onChange={(e) => setEditedExperience(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Experience name"
      />
      <Textarea 
        value={editedExperience.description}
        onChange={(e) => setEditedExperience(prev => ({ ...prev, description: e.target.value }))}
        placeholder="Description"
      />
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Premium Experience</label>
        <Switch 
          checked={editedExperience.type === "PREMIUM"} 
          onCheckedChange={(checked) => setEditedExperience(prev => ({
            ...prev,
            type: checked ? "PREMIUM" : "FREE"
          }))}
        />
      </div>
    </div>
  </div>
) : (
  <CardContent>
    <div className="flex gap-2 pt-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="text-destructive hover:text-destructive border-destructive"
        onClick={() => handleDeleteExperience(experience._id)}
      >
        <Trash2 className="w-4 h-4 mr-1" /> Delete
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => startEditing(experience)}
      >
        <Edit className="w-4 h-4 mr-1" /> Edit
      </Button>
    </div>
  </CardContent>
)}

            </Card>
          )) : <div className="text-muted-foreground">No experiences found.</div>}
        </div>
      )}
    </div>
  );
}
