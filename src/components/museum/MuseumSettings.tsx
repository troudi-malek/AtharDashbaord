
import { useState } from "react";
import { Save, Upload, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MuseumSettings() {
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "Metropolitan Museum of Art",
    description: "The Metropolitan Museum of Art presents over 5,000 years of art from every part of the globe.",
    location: "1000 Fifth Avenue, New York, NY 10028",
    phone: "(212) 535-7710",
    openingHours: "10:00 AM - 5:30 PM",
    website: "https://www.metmuseum.org",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Museum Settings</h2>
          <p className="text-slate-600 mt-1">Update your museum information and preferences</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => setPreviewMode(!previewMode)}
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          {previewMode ? "Edit Mode" : "Preview Mode"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Form */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
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
                  <Label htmlFor="hours">Opening Hours</Label>
                  <Input
                    id="hours"
                    value={formData.openingHours}
                    onChange={(e) => handleInputChange("openingHours", e.target.value)}
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
                    <Button variant="outline" size="sm" className="mt-2">
                      Choose Files
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {!previewMode && (
              <Button className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-slate-900">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
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
                  <span className="font-medium text-slate-900">Hours:</span>
                  <span className="text-slate-600 ml-2">{formData.openingHours}</span>
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
