import { useState, useEffect } from "react";
import { Copy, Plus, Eye, FileSpreadsheet, Sparkles, Key, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { GenerateCodes, GetCodesByMuseum } from "@/services/codeService";
import * as XLSX from 'xlsx';

type Code = {
  _id: string;
  code: string;
  createdAt: string;
  submitted: boolean;
  museumName?: string;
};

export function AccessCodeInterface() {
  const [currentCode, setCurrentCode] = useState("");
  const [codeCount, setCodeCount] = useState(1);
  const [filter, setFilter] = useState<"all" | "used" | "unused">("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [codes, setCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(true);
  const [museumName, setMuseumName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const data = await GetCodesByMuseum();
      const codesData = Array.isArray(data) ? data : data?.codes || [];
      setCodes(codesData);
      setMuseumName(data?.museumName || "");
    } catch (error) {
      console.error("Failed to fetch codes:", error);
      toast({
        title: "Failed to load codes",
        description: "Could not fetch access codes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCodes = async () => {
    try {
      setIsGenerating(true);
      const res = await GenerateCodes(codeCount);

      // Robust extraction of codes from various API shapes
      let codesFromRes: string[] = [];
      const normalize = (arr: any[]): string[] => {
        return arr
          .map((item: any) => {
            if (typeof item === "string") return item;
            if (item && typeof item === "object") return String(item.code || item.value || "");
            return "";
          })
          .filter(Boolean);
      };

      if (Array.isArray(res)) {
        codesFromRes = normalize(res);
      } else if (Array.isArray(res?.data)) {
        // handles { message, data: [...] } where elements can be strings or objects
        codesFromRes = normalize(res.data);
      } else if (Array.isArray(res?.codes)) {
        codesFromRes = normalize(res.codes);
      } else if (Array.isArray(res?.data?.codes)) {
        codesFromRes = normalize(res.data.codes);
      } else if (typeof res === "string") {
        codesFromRes = [res];
      }

      if (codesFromRes.length > 0) {
        setCurrentCode(codesFromRes.join(", "));
      } else {
        // If we couldn't extract codes as an array, avoid dumping entire payload; show a friendly message
        setCurrentCode("");
      }

      setShowConfirmModal(true);
      toast({
        title: `✨ ${codeCount} Access Code${codeCount > 1 ? "s" : ""} Generated!`,
        description: "New codes are ready to use and will be available for download.",
      });
      
      // Refresh the codes list after generation
      fetchCodes();
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error?.message || "Could not generate codes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied! 📋",
      description: "Access code copied to clipboard.",
    });
  };

  const exportToExcel = () => {
    try {
      // Prepare data for Excel export
      const excelData = codes.map((code, index) => ({
        'S.No': index + 1,
        'Access Code': code.code,
        'Status': code.submitted ? 'Used' : 'Active',
        'Generated Date': new Date(code.createdAt).toLocaleDateString(),
        'Generated Time': new Date(code.createdAt).toLocaleTimeString(),
        'Museum': museumName || 'Unknown Museum'
      }));

      // Create a new workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 8 },   // S.No
        { wch: 15 },  // Access Code
        { wch: 10 },  // Status
        { wch: 15 },  // Generated Date
        { wch: 15 },  // Generated Time
        { wch: 25 }   // Museum
      ];
      ws['!cols'] = colWidths;

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Access Codes');

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `Access_Codes_${museumName?.replace(/\s+/g, '_') || 'Museum'}_${currentDate}.xlsx`;

      // Write and download the file
      XLSX.writeFile(wb, filename);

      toast({
        title: "✅ Export Complete",
        description: `Access codes report has been downloaded as ${filename}`,
      });
    } catch (error) {
      console.error('Excel export error:', error);
      toast({
        title: "Export Failed",
        description: "Could not export to Excel. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredCodes = codes.filter(code => {
    const matchesFilter = filter === "all" || 
      (filter === "used" && code.submitted) || 
      (filter === "unused" && !code.submitted);
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase());
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
                <div className="text-2xl font-bold text-foreground font-poppins">{codes.length}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <div className="text-2xl font-bold text-success font-poppins">{codes.filter(c => !c.submitted).length}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <div className="text-2xl font-bold text-muted-foreground font-poppins">{codes.filter(c => c.submitted).length}</div>
                <div className="text-xs text-muted-foreground">Used</div>
              </div>
            </div>

            {/* Code List */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-lg font-medium font-poppins">Loading codes...</p>
                </div>
              ) : filteredCodes.length > 0 ? (
                filteredCodes.map((item, index) => (
                  <div 
                    key={item._id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all duration-200 animate-slide-in-right group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold text-foreground">{item.code}</div>
                      <div className="text-xs text-muted-foreground mt-1">{museumName || "Museum"}</div>
                      <div className="text-xs text-muted-foreground">Generated {new Date(item.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        className={`${item.submitted ? 'badge-used' : 'badge-unused'} px-3 py-1 rounded-full text-xs font-medium`}
                      >
                        {item.submitted ? "Used" : "Active"}
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
                ))
              ) : (
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