import { useState } from "react";
import { HelpCircle, Plus, Trash2, CheckCircle, ListChecks } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface CreatePollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PollOption {
  text: string;
}

interface PollFormData {
  question: string;
  options: PollOption[];
}

export function CreatePollModal({ open, onOpenChange }: CreatePollModalProps) {
  const [formData, setFormData] = useState<PollFormData>({
    question: "",
    options: [{ text: "" }, { text: "" }],
  });

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, question: e.target.value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index].text = value;
    setFormData((prev) => ({ ...prev, options: updatedOptions }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { text: "" }],
    }));
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Poll Created:", formData);
    toast({
      title: "Poll Created",
      description: "Your poll has been published.",
    });
    onOpenChange(false);
    setFormData({ question: "", options: [{ text: "" }, { text: "" }] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <HelpCircle className="h-5 w-5 text-accent" />
            Create Poll
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <Label className="flex items-center gap-1">
              <ListChecks className="h-4 w-4" /> Poll Question <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formData.question}
              onChange={handleQuestionChange}
              required
              placeholder="Enter your poll question"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Options</Label>
            <div className="space-y-3 mt-2">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={addOption}
              className="mt-3 gap-2 text-accent hover:text-accent"
            >
              <Plus className="h-4 w-4" />
              Add Option
            </Button>
          </div>

          <Button type="submit" variant="hero" className="w-full gap-2">
            <CheckCircle className="h-4 w-4" />
            Create Poll
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
