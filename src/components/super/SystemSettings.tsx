
import { Save, Shield, Clock, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SystemSettings() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">System Settings</h2>
        <p className="text-slate-600 mt-1">Configure global system parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codeExpiry">Access Code Expiry (days)</Label>
              <Input id="codeExpiry" type="number" defaultValue="30" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxFailedLogins">Max Failed Login Attempts</Label>
              <Input id="maxFailedLogins" type="number" defaultValue="5" />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="twoFactor">Require Two-Factor Authentication</Label>
              <Switch id="twoFactor" />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sessionTimeout">Auto Session Timeout</Label>
              <Switch id="sessionTimeout" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backupFreq">Backup Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Every Hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logRetention">Log Retention Period (days)</Label>
              <Input id="logRetention" type="number" defaultValue="90" />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance">Automatic Maintenance</Label>
              <Switch id="maintenance" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics">Anonymous Analytics</Label>
              <Switch id="analytics" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Experience Categories */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Default Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {["Art & Paintings", "Historical Artifacts", "Interactive Tours", "Virtual Reality", "Educational Programs"].map((category, index) => (
                <div 
                  key={category}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-sm text-slate-900">{category}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              Add New Category
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { service: "Database", status: "Operational", color: "bg-green-500" },
                { service: "Payment Gateway", status: "Operational", color: "bg-green-500" },
                { service: "File Storage", status: "Operational", color: "bg-green-500" },
                { service: "Email Service", status: "Maintenance", color: "bg-amber-500" },
                { service: "Analytics", status: "Operational", color: "bg-green-500" },
              ].map((service, index) => (
                <div 
                  key={service.service}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-sm text-slate-900">{service.service}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${service.color}`} />
                    <span className="text-xs text-slate-600">{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium">
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
