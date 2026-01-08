import { useState, ChangeEvent } from "react";
import { FileText, Image, Video, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PostFormData {
  title: string;
  description: string;
  photo: File | null;
  video: File | null;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    description: "",
    photo: null,
    video: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Post Created:", formData);
    toast({
      title: "Post Published",
      description: "Your update has been shared with students.",
    });
    onOpenChange(false);
    setFormData({ title: "", description: "", photo: null, video: null });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-accent" />
            Create Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post title (optional)"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Share an update, announcement, or news..."
              rows={4}
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-1">
                <Image className="h-4 w-4" /> Photo
              </Label>
              <Input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Video className="h-4 w-4" /> Video
              </Label>
              <Input
                type="file"
                name="video"
                accept="video/*"
                onChange={handleFileChange}
                className="mt-1.5"
              />
            </div>
          </div>

          <Button type="submit" variant="hero" className="w-full gap-2">
            <CheckCircle className="h-4 w-4" />
            Publish Post
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
