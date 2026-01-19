import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bot, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

interface ATSToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

export function ATSToggle({ enabled, onToggle, className }: ATSToggleProps) {
  return (
    <div className={cn("flex items-center gap-4 p-4 rounded-xl border bg-card", className)}>
      <div className="flex items-center gap-3 flex-1">
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          enabled ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
        )}>
          {enabled ? <Bot className="h-5 w-5" /> : <Hand className="h-5 w-5" />}
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium">
            {enabled ? "ATS Automation Enabled" : "Manual Shortlisting Mode"}
          </Label>
          <p className="text-xs text-muted-foreground">
            {enabled 
              ? "AI-powered scoring and automated ranking active" 
              : "Review and shortlist candidates manually"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className={cn(
          "text-xs font-medium transition-colors",
          !enabled ? "text-foreground" : "text-muted-foreground"
        )}>
          Manual
        </span>
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-accent"
        />
        <span className={cn(
          "text-xs font-medium transition-colors",
          enabled ? "text-accent" : "text-muted-foreground"
        )}>
          ATS
        </span>
      </div>
    </div>
  );
}
