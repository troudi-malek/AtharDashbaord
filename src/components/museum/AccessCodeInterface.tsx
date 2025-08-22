import { useState } from "react";
import { Copy, Plus, Filter, Download, Check, Eye, FileSpreadsheet, Sparkles, Key, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const generatedCodes = [
  { id: 1, code: "MET-2024-ABC123", generated: "2024-01-15 10:30", expires: "2024-02-15", used: false, experience: "Ancient Egypt Gallery" },
  { id: 2, code: "MET-2024-XYZ789", generated: "2024-01-14 14:22", expires: "2024-02-14", used: true, experience: "Renaissance Art Tour" },
  { id: 3, code: "MET-2024-DEF456", generated: "2024-01-13 09:15", expires: "2024-02-13", used: false, experience: "All Experiences" },
  { id: 4, code: "MET-2024-GHI321", generated: "2024-01-12 16:45", expires: "2024-02-12", used: true, experience: "Modern Art Exhibition" },
  { id: 5, code: "MET-2024-JKL654", generated: "2024-01-11 11:20", expires: "2024-02-11", used: false, experience: "Sculpture Garden" },
];

export function AccessCodeInterface() {
  const [currentCode, setCurrentCode] = useState("");
  const [codeCount, setCodeCount] = useState(1);
  const [filter, setFilter] = useState<"all" | "used" | "unused">("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const generateCodes = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const codes = Array.from({ length: codeCount }, () => 
        `MET-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      );
      setCurrentCode(codes.join(", "));
      setIsGenerating(false);
      setShowConfirmModal(true);
      
      toast({
        title: `✨ ${codeCount} Access Code${codeCount > 1 ? 's' : ''} Generated!`,
        description: "New codes are ready to use and will be available for download.",
      });
    }, 1500);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied! 📋",
      description: "Access code copied to clipboard.",
    });
  };

  const exportToExcel = () => {
    toast({
      title: "📊 Excel Export Started",
      description: "Your access codes report is being prepared for download.",
    });
    
    // Simulate Excel export
    setTimeout(() => {
      toast({
        title: "✅ Export Complete",
        description: "Access codes report has been downloaded successfully.",
      });
    }, 2000);
  };

  const filteredCodes = generatedCodes.filter(code => {
    const matchesFilter = filter === "all" || 
      (filter === "used" && code.used) || 
      (filter === "unused" && !code.used);
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.experience.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-foreground mb-3 font-poppins">Access Code Management</h2>
        <p className="text-muted-foreground text-lg">Generate beautiful, secure access codes for your museum experiences</p>
        <div className="flex justify-center mt-4">
          <div className="w-24 h-1 bg-dreamy rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Code Generator Card */}
        <Card className="glass-card border-0 shadow-2xl hover-lift relative overflow-hidden">
          <div className="absolute inset-0 bg-dreamy opacity-10"></div>
          <CardHeader className="relative z-10 pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-poppins">
              <div className="p-2 bg-primary/20 rounded-xl">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              Generate Access Codes
            </CardTitle>
            <p className="text-muted-foreground">Create new access codes for your visitors</p>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="space-y-3">
              <Label className="text-foreground font-medium font-poppins">Number of codes to generate</Label>
              <Input 
                type="number"
                min="1"
                max="100"
                value={codeCount}
                onChange={(e) => setCodeCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-12 rounded-xl border-border/50 bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 font-poppins"
                placeholder="Enter number of codes"
              />
              <p className="text-xs text-muted-foreground">Generate up to 100 codes at once</p>
            </div>
            
            <Button 
              onClick={generateCodes}
              disabled={isGenerating}
              className="w-full h-12 btn-glow text-white font-semibold rounded-xl hover-glow transition-all duration-300 font-poppins"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Generate {codeCount > 1 ? `${codeCount} Codes` : 'Code'}</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Code Management Card */}
        <Card className="glass-card border-0 shadow-2xl hover-lift">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-2xl font-poppins">
                <div className="p-2 bg-secondary/20 rounded-xl">
                  <Eye className="w-6 h-6 text-secondary" />
                </div>
                Code Library
              </CardTitle>
              <Button 
                onClick={exportToExcel}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-poppins"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
            <p className="text-muted-foreground">Manage and monitor your access codes</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Search codes or experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 rounded-xl border-border/50 bg-background/80 backdrop-blur-sm font-poppins"
                />
              </div>
              <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
                <SelectTrigger className="w-full sm:w-32 h-10 rounded-xl border-border/50 bg-background/80 backdrop-blur-sm font-poppins">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Codes</SelectItem>
                  <SelectItem value="unused">Unused</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Code Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <div className="text-2xl font-bold text-foreground font-poppins">{generatedCodes.length}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <div className="text-2xl font-bold text-success font-poppins">{generatedCodes.filter(c => !c.used).length}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <div className="text-2xl font-bold text-muted-foreground font-poppins">{generatedCodes.filter(c => c.used).length}</div>
                <div className="text-xs text-muted-foreground">Used</div>
              </div>
            </div>

            {/* Code List */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredCodes.map((item, index) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all duration-200 animate-slide-in-right group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-1">
                    <div className="font-mono text-sm font-semibold text-foreground font-poppins">{item.code}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.experience}</div>
                    <div className="text-xs text-muted-foreground">Generated {item.generated}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={`${item.used ? 'badge-used' : 'badge-unused'} px-3 py-1 rounded-full text-xs font-medium`}
                    >
                      {item.used ? "Used" : "Active"}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(item.code)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredCodes.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium font-poppins">No codes found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md glass-card border-0 shadow-2xl">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground font-poppins">
              Codes Generated Successfully! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground font-poppins">
              Your access codes have been generated and are ready to use.
            </p>
            
            {currentCode && (
              <div className="space-y-2">
                <Label className="text-sm font-medium font-poppins">Generated Code(s):</Label>
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="font-mono text-sm text-foreground break-all">{currentCode}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(currentCode)}
                  className="w-full rounded-xl font-poppins"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Codes
                </Button>
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={exportToExcel}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-poppins"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export to Excel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-xl font-poppins"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}