
import { useEffect, useRef, useState } from "react";
import { Save, Upload, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpdateMuseum, GetMuseumById } from "@/services/museumsService";

interface MuseumSettingsProps {
  museumId: string;
}

export function MuseumSettings({ museumId }: MuseumSettingsProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    phone: "",
    email: "",
    website: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!museumId) return;
    GetMuseumById(museumId).then((resp) => {
      const m = resp?.data || {};
      setFormData({
        name: m.name || "",
        description: m.description || "",
        location: m.location || m.address || "",
        phone: m.phone || m.phoneNumber || m.contactPhone || m.contact?.phone || "",
        email: m.email || m.contactEmail || m.contact?.email || m.adminEmail || "",
        website: m.website || m.site || m.url || "",
      });
    });
  }, [museumId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-2">
        <h2 className="text-4xl font-bold text-foreground mb-2">Museum Settings</h2>
        <p className="text-muted-foreground text-lg">Update your museum information and preferences</p>
        <div className="flex justify-center mt-4">
          <div className="w-24 h-1 bg-primary rounded-full"></div>
        </div>
        <div className="mt-4 flex justify-center">
          <Button 
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Form */}
        <Card className="border-0 bg-card">
          <CardHeader>
            <CardTitle>Museum Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Museum Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={previewMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    disabled={previewMode}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    disabled={previewMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={previewMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={previewMode}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="media" className="space-y-4">
                <div className="space-y-2">
                  <Label>Museum Images</Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-600">Upload museum images</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setSelectedImage(file);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Files
                    </Button>
                    {selectedImage && (
                      <div className="mt-2 text-xs text-slate-600 truncate">{selectedImage.name}</div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {!previewMode && (
              <Button
                className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-slate-900"
                onClick={async () => {
                  if (!museumId) return;
                  try {
                    const fd = new FormData();
                    fd.append("name", formData.name);
                    fd.append("description", formData.description);
                    fd.append("location", formData.location);
                    fd.append("phone", formData.phone ?? "");
                    fd.append("email", formData.email ?? "");
                    fd.append("website", formData.website ?? "");
                    if (selectedImage) {
                      fd.append("imageUrl", selectedImage);
                    }
                    await UpdateMuseum(museumId, fd);
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 bg-card">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 animate-scale-in">
              <div className="gradient-museum text-white p-6 rounded-lg">
                <h3 className="text-2xl font-bold">{formData.name}</h3>
                <p className="text-slate-200 mt-2">{formData.description}</p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-slate-900">Location:</span>
                  <span className="text-slate-600 ml-2">{formData.location}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-900">Phone:</span>
                  <span className="text-slate-600 ml-2">{formData.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-900">Email:</span>
                  <span className="text-slate-600 ml-2">{formData.email}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-900">Website:</span>
                  <span className="text-blue-600 ml-2">{formData.website}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
