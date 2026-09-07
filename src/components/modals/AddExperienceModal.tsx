
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddExperienceModal({ isOpen, onClose }: AddExperienceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Experience</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Experience Title</Label>
              <Input id="title" placeholder="Enter experience title" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Experience Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe the experience..."
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Thumbnail Image</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-slate-600">Upload thumbnail image</p>
              <Button variant="outline" size="sm" className="mt-2">
                Choose File
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              Create Experience
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
