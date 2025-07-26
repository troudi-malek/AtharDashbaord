
import { useState } from "react";
import { Key, Copy, Clock, CheckCircle, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const generatedCodes = [
  { code: "MET-2024-ABC123", generated: "2024-01-15 10:30", expires: "2024-02-15", used: false },
  { code: "MET-2024-XYZ789", generated: "2024-01-14 14:22", expires: "2024-02-14", used: true },
  { code: "MET-2024-DEF456", generated: "2024-01-13 09:15", expires: "2024-02-13", used: false },
];

export function AccessCodeInterface() {
  const [currentCode, setCurrentCode] = useState("");
  const [codeCount, setCodeCount] = useState(1);
  const [filter, setFilter] = useState<"all" | "used" | "unused">("all");
  const { toast } = useToast();

  const generateCodes = () => {
    const codes = Array.from({ length: codeCount }, () => 
      `MET-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    );
    setCurrentCode(codes.join(", "));
    toast({
      title: `${codeCount} Access Code${codeCount > 1 ? 's' : ''} Generated`,
      description: "New codes are ready to use and have been copied to clipboard.",
    });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Access code copied to clipboard.",
    });
  };

  const filteredCodes = generatedCodes.filter(code => {
    if (filter === "used") return code.used;
    if (filter === "unused") return !code.used;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Access Code Management</h2>
        <p className="text-muted-foreground mt-1">Generate and manage museum access codes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Generator */}
        <Card className="bg-primary text-primary-foreground border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Generate Access Codes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of codes to generate:</label>
              <Input 
                type="number"
                min="1"
                max="100"
                value={codeCount}
                onChange={(e) => setCodeCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
            </div>
            
            <Button 
              onClick={generateCodes}
              className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium"
            >
              Generate {codeCount > 1 ? `${codeCount} Codes` : 'Code'}
            </Button>
            
            {currentCode && (
              <div className="space-y-2 animate-scale-in">
                <label className="text-sm font-medium">Generated Code{codeCount > 1 ? 's' : ''}:</label>
                <div className="flex gap-2">
                  <Input 
                    value={currentCode} 
                    readOnly 
                    className="bg-white/10 border-white/20 text-primary-foreground"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => copyToClipboard(currentCode)}
                    className="bg-white/10 border-white/20 hover:bg-white/20 text-primary-foreground"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm opacity-80">
                  Expires in 30 days • Valid for all experiences
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Code Management */}
        <Card className="border-0 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Code Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unused">Unused</TabsTrigger>
                <TabsTrigger value="used">Used</TabsTrigger>
              </TabsList>
              
              <TabsContent value={filter} className="space-y-3">
                {filteredCodes.map((item, index) => (
                  <div 
                    key={item.code}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg animate-slide-in-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-1">
                      <div className="font-mono text-sm font-medium text-foreground">{item.code}</div>
                      <div className="text-xs text-muted-foreground">
                        Generated {item.generated}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={item.used ? "secondary" : "default"}
                        className={item.used ? "bg-muted-foreground/10 text-muted-foreground" : "bg-primary/10 text-primary"}
                      >
                        {item.used ? "Used" : "Active"}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(item.code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {filteredCodes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No {filter === "all" ? "" : filter} codes found
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
