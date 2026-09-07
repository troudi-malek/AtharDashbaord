
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const museums = [
  "Metropolitan Museum of Art",
  "Louvre Museum", 
  "British Museum",
  "Science Discovery Center",
];

export function CreateAdminModal({ isOpen, onClose }: CreateAdminModalProps) {
  const [selectedMuseums, setSelectedMuseums] = useState<string[]>([]);
  const [role, setRole] = useState("");

  const handleMuseumToggle = (museum: string) => {
    setSelectedMuseums(prev => 
      prev.includes(museum) 
        ? prev.filter(m => m !== museum)
        : [...prev, museum]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Admin</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter full name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Admin Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select admin role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MuseumAdmin">Museum Admin</SelectItem>
                <SelectItem value="SuperAdmin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {role === "MuseumAdmin" && (
            <div className="space-y-2">
              <Label>Assign Museums</Label>
              <div className="space-y-2 border rounded-lg p-4 max-h-40 overflow-y-auto">
                {museums.map((museum) => (
                  <div key={museum} className="flex items-center space-x-2">
                    <Checkbox 
                      id={museum}
                      checked={selectedMuseums.includes(museum)}
                      onCheckedChange={() => handleMuseumToggle(museum)}
                    />
                    <Label htmlFor={museum} className="text-sm">
                      {museum}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              Create Admin
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
