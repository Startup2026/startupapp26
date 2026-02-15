


import { useState, ChangeEvent } from "react";
import { FileText, Image, Video, Loader2 } from "lucide-react";
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
import { postService } from "@/services/postService";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface PostFormData {
  title: string;
  description: string;
  image: File | null;
  video: File | null;
}

export function CreatePostModal({ open, onOpenChange, onSuccess }: CreatePostModalProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    description: "",
    image: null,
    video: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description && !formData.title) {
        toast({ title: "Error", description: "Please provide a title or description", variant: "destructive" });
        return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      if (formData.image) data.append("image", formData.image);
      if (formData.video) data.append("video", formData.video);

      const result = await postService.createPost(data);
      if (result.success) {
        toast({
          title: "Post Published",
          description: "Your update has been shared with students.",
        });
        onOpenChange(false);
        setFormData({ title: "", description: "", image: null, video: null });
        if (onSuccess) onSuccess();
      } else {
          toast({ title: "Failed", description: result.error || "Could not create post", variant: "destructive" });
      }
    } catch (error) {
      console.error("Post creation error:", error);
      toast({ title: "Error", description: "A network error occurred", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
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
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1.5 cursor-pointer"
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
                className="mt-1.5 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button variant="accent" className="gap-2 px-8" disabled={isSubmitting}>
              {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                  </>
              ) : "Post Now"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}