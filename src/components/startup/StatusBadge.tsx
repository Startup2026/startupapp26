import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, Calendar, Send, User } from "lucide-react";

export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEW_SCHEDULED"
  | "SELECTED"
  | "REJECTED"
  | "PENDING";

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<ApplicationStatus, {
  label: string;
  className: string;
  icon: React.ElementType;
}> = {
  APPLIED: {
    label: "Applied",
    className: "bg-secondary text-secondary-foreground border-secondary",
    icon: Send,
  },
  SHORTLISTED: {
    label: "Shortlisted",
    className: "bg-accent/10 text-accent border-accent/20",
    icon: User,
  },
  INTERVIEW_SCHEDULED: {
    label: "Interview",
    className: "bg-warning/10 text-warning border-warning/20",
    icon: Calendar,
  },
  SELECTED: {
    label: "Accepted",
    className: "bg-success/10 text-success border-success/20",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
  PENDING: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border-muted",
    icon: Clock,
  },
};

export function StatusBadge({ status, className, showIcon = false }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline"
      className={cn(
        "font-medium border",
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
