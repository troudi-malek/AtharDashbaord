
import { useState, useEffect } from "react";
import { Building2, MapPin, Eye, Users, Plus, X } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar } from "recharts";
import { CreateMuseum, GetMuseums } from '@/services/museumsService';
import { DeleteMuseum } from '@/services/museumsService';
import { getMediaUrl } from "@/lib/media";

// Removed static museums array

const tunisianGovernorates = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", "Bizerte",
  "Béja", "Jendouba", "Kef", "Siliana", "Kairouan", "Kasserine", "Sidi Bouzid",
  "Sousse", "Monastir", "Mahdia", "Sfax", "Gafsa", "Tozeur", "Kebili",
  "Gabès", "Medenine", "Tataouine"
];

const chartConfig = {
  visits: { label: "Visits", color: "hsl(var(--primary))" }
};

export function MuseumDirectory() {
  const [selectedMuseum, setSelectedMuseum] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    imageUrl: "",
    description: "",
    imageFile: null as File | null,
    cost: 0,
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    location: false,
    imageUrl: false,
    description: false,
    cost: false,
  });
  const [museums, setMuseums] = useState<any[]>([]);
  const [loadingMuseums, setLoadingMuseums] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, museum: any | null }>({ open: false, museum: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchMuseums = async () => {
      setLoadingMuseums(true);
      const data = await GetMuseums();
      setMuseums(Array.isArray(data) ? data : []);
      setLoadingMuseums(false);
    };
    fetchMuseums();
  }, []);

  const refreshMuseums = async () => {
    setLoadingMuseums(true);
    const data = await GetMuseums();
    setMuseums(Array.isArray(data) ? data : []);
    setLoadingMuseums(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file, imageUrl: file.name }));
      // Optionally, you can show a preview or do further validation here
    }
  };

  const handleSaveMuseum = async () => {
    // Validate required fields
    const errors = {
      name: !formData.name.trim(),
      location: !formData.location.trim(),
      imageUrl: !formData.imageUrl.trim(),
      description: !formData.description.trim(),
      imageFile: !formData.imageFile,
      cost: formData.cost === undefined || formData.cost === null || isNaN(Number(formData.cost)),
    };
    setFormErrors(errors as any);
    // If no errors, save the museum
    if (!Object.values(errors).some(error => error)) {
      try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('location', formData.location);
        data.append('description', formData.description);
        data.append('cost', String(formData.cost));
        if (formData.imageFile) {
          data.append('imageUrl', formData.imageFile);
        }
        // Log FormData contents before sending
        for (let pair of data.entries()) {
          console.log(pair[0]+ ':', pair[1]);
        }
        const result = await CreateMuseum(data);
        if (result) {
          setShowCreateForm(false);
          setFormData({ name: "", location: "", imageUrl: "", description: "", imageFile: null, cost: 0 });
          setFormErrors({ name: false, location: false, imageUrl: false, description: false, cost: false });
          refreshMuseums();
        } else {
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteMuseum = async () => {
    if (!deleteDialog.museum) return;
    setDeleting(true);
    await DeleteMuseum(deleteDialog.museum._id || deleteDialog.museum.id);
    setDeleting(false);
    setDeleteDialog({ open: false, museum: null });
    refreshMuseums();
  };

  if (selectedMuseum) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedMuseum(null)}
            className="border-border"
          >
            ← Back to Museums
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Museum Details</h2>
            <p className="text-muted-foreground mt-1">Detailed information and administration</p>
          </div>
        </div>

        {/* Museum Details Header */}
        <Card className="border bg-card">
          <div className="relative h-48 w-full">
            <img 
              src={getMediaUrl(selectedMuseum.imageUrl ?? selectedMuseum.image ?? selectedMuseum.logoUrl)}
              alt={selectedMuseum.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-3xl font-bold">{selectedMuseum.name}</h1>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                <span className="text-white/90">{selectedMuseum.location}</span>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Museum Information</h3>
                <p className="text-muted-foreground mb-4">{selectedMuseum.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Visits:</span>
                    <span className="font-medium text-foreground">{selectedMuseum.totalVisits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AR Experiences:</span>
                    <span className="font-medium text-foreground">{selectedMuseum.nb_ArExperience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid Ratio:</span>
                    <span className="font-medium text-foreground">{selectedMuseum.paidRatio}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-medium text-foreground">{selectedMuseum.cost}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Administrator Details</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{selectedMuseum.adminName}</h4>
                        <p className="text-sm text-muted-foreground">Museum Administrator</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-foreground">{selectedMuseum.adminEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contact:</span>
                        <span className="text-foreground">{selectedMuseum.adminContact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Museum Directory</h2>
          <p className="text-muted-foreground mt-1">Manage all museums in the system</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          {showCreateForm ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Museum
            </>
          )}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="border-2 border-primary/20 bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Create New Museum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="museumName" 
                  className={`text-foreground ${formErrors.name ? 'label-error' : ''}`}
                >
                  Museum Name *
                </Label>
                <Input
                  id="museumName"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter museum name"
                  className={`border-input bg-background ${formErrors.name ? 'input-error' : ''}`}
                  required
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive">Museum name is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label 
                  htmlFor="location" 
                  className={`text-foreground ${formErrors.location ? 'label-error' : ''}`}
                >
                  Location (Governorate) *
                </Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                  <SelectTrigger className={`border-input bg-background ${formErrors.location ? 'input-error' : ''}`}>
                    <SelectValue placeholder="Select governorate" />
                  </SelectTrigger>
                  <SelectContent>
                    {tunisianGovernorates.map((governorate) => (
                      <SelectItem key={governorate} value={governorate}>
                        {governorate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.location && (
                  <p className="text-xs text-destructive">Location is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost" className={`text-foreground ${formErrors.cost ? 'label-error' : ''}`}>Cost *</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => handleInputChange("cost", Number(e.target.value))}
                  placeholder="Enter cost"
                  className={`border-input bg-background ${formErrors.cost ? 'input-error' : ''}`}
                  required
                />
                {formErrors.cost && (
                  <p className="text-xs text-destructive">Cost is required</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label 
                htmlFor="imageUrl" 
                className={`text-foreground ${formErrors.imageUrl ? 'label-error' : ''}`}
              >
                Image  *
              </Label>
              <div
                className={`w-full border border-input rounded-md bg-background px-3 py-2 cursor-pointer flex items-center justify-center min-h-[64px] ${formErrors.imageUrl ? 'input-error' : ''}`}
                onClick={() => document.getElementById('museum-image-upload')?.click()}
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('museum-image-upload')?.click(); }}
                role="button"
                aria-label="Choose image file"
              >
                <span className={`text-sm ${formData.imageFile ? 'text-foreground' : 'text-muted-foreground'} w-full text-center`}>
                  {formData.imageFile ? formData.imageFile.name : 'Click here to choose an image'}
                </span>
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="museum-image-upload"
              />
              {formErrors.imageUrl && (
                <p className="text-xs text-destructive">Image URL is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="description" 
                className={`text-foreground ${formErrors.description ? 'label-error' : ''}`}
              >
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter a detailed description of the museum..."
                className={`border-input bg-background min-h-[100px] ${formErrors.description ? 'input-error' : ''}`}
                required
              />
              {formErrors.description && (
                <p className="text-xs text-destructive">Description is required</p>
              )}
            </div>


            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSaveMuseum}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Save Museum
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                className="border-border"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loadingMuseums ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">Loading museums...</div>
        ) : museums.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">No museums found.</div>
        ) : museums.map((museum, index) => (
          <Card 
            key={museum._id || museum.id || index}
            className="group hover:shadow-lg transition-all duration-300 animate-slide-in-right border-0 bg-card cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative">
              <img 
                src={getMediaUrl(museum.imageUrl ?? museum.image ?? museum.logoUrl)}
                alt={museum.name}
                className="w-full h-32 object-cover rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                style={{ border: '2px solid transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.border = '2px solid hsl(var(--primary))'}
                onMouseLeave={(e) => e.currentTarget.style.border = '2px solid transparent'}
              />
              <Badge 
                variant={museum.status === "active" ? "default" : "secondary"}
                className={`absolute top-2 right-2 ${museum.status === "active" ? "bg-primary/10 text-primary" : ""}`}
              >
                {museum.status}
              </Badge>
            </div>

            <CardContent className="p-4 space-y-3">
              <div>
                <CardTitle className="text-lg text-foreground">{museum.name}</CardTitle>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{museum.location}</span>
                  {museum.cost !== undefined && (
                    <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">Cost: {museum.cost} DT</span>
                  )}
                </div>
              </div>

              {/* You may need to adjust these fields based on your API response */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="font-semibold text-foreground">{museum.totalVisits?.toLocaleString?.() ?? '-'}</div>
                  <div className="text-muted-foreground">Visits</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{museum.nb_ArExperience ?? '-'}</div>
                  <div className="text-muted-foreground">Experiences</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{museum.paidRatio ?? '-'}</div>
                  <div className="text-muted-foreground">Paid</div>
                </div>
              </div>

              {/* If you have monthlyData, you can show the chart, otherwise skip */}
              {museum.monthlyData && (
                <ChartContainer config={chartConfig} className="h-12">
                  <BarChart data={museum.monthlyData.slice(-4)}>
                    <Bar dataKey="visits" fill="hsl(var(--primary))" radius={2} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ChartContainer>
              )}

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedMuseum(museum)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-auto px-3 flex-shrink-0"
                  title="Delete Museum"
                  onClick={() => setDeleteDialog({ open: true, museum })}
                  disabled={deleting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="z-50 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-sm border border-border">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Are you sure you want to delete this museum?</h2>
            <p className="mb-6 text-muted-foreground">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/80"
                onClick={() => setDeleteDialog({ open: false, museum: null })}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-destructive text-white hover:bg-destructive/90"
                onClick={handleDeleteMuseum}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
