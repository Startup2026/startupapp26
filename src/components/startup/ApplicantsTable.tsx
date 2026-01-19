import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge, ApplicationStatus } from "./StatusBadge";
import {
  MoreHorizontal,
  Search,
  FileText,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  ExternalLink,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Applicant {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  resumeUrl: string | null;
  appliedAt: string;
  status: ApplicationStatus;
  atsScore?: number;
  skills?: string[];
  experience?: number;
  education?: string;
}

interface ApplicantsTableProps {
  applicants: Applicant[];
  atsEnabled: boolean;
  selectedIds: string[];
  onSelectChange: (ids: string[]) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onViewDetails: (applicant: Applicant) => void;
  onScheduleInterview: (applicant: Applicant) => void;
  onSendEmail: (applicant: Applicant) => void;
}

type SortField = "name" | "appliedAt" | "status" | "atsScore";
type SortDirection = "asc" | "desc";

export function ApplicantsTable({
  applicants,
  atsEnabled,
  selectedIds,
  onSelectChange,
  onStatusChange,
  onViewDetails,
  onScheduleInterview,
  onSendEmail,
}: ApplicantsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<SortField>("appliedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const toggleSelect = (id: string) => {
    onSelectChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApplicants.length) {
      onSelectChange([]);
    } else {
      onSelectChange(filteredApplicants.map((a) => a.id));
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredApplicants = applicants
    .filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.jobTitle.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "appliedAt":
          comparison = new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "atsScore":
          comparison = (a.atsScore || 0) - (b.atsScore || 0);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1 -ml-3 font-medium"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44 bg-background">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="APPLIED">Applied</SelectItem>
            <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
            <SelectItem value="INTERVIEW_SCHEDULED">Interview</SelectItem>
            <SelectItem value="SELECTED">Accepted</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    filteredApplicants.length > 0 &&
                    selectedIds.length === filteredApplicants.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>
                <SortButton field="name">Candidate</SortButton>
              </TableHead>
              <TableHead>Job Position</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>
                <SortButton field="appliedAt">Applied Date</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="status">Status</SortButton>
              </TableHead>
              {atsEnabled && (
                <TableHead>
                  <SortButton field="atsScore">ATS Score</SortButton>
                </TableHead>
              )}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplicants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={atsEnabled ? 8 : 7}
                  className="h-32 text-center text-muted-foreground"
                >
                  No applicants found
                </TableCell>
              </TableRow>
            ) : (
              filteredApplicants.map((applicant) => (
                <TableRow
                  key={applicant.id}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedIds.includes(applicant.id) && "bg-accent/5"
                  )}
                  onClick={() => onViewDetails(applicant)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(applicant.id)}
                      onCheckedChange={() => toggleSelect(applicant.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{applicant.name}</p>
                      <p className="text-xs text-muted-foreground">{applicant.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{applicant.jobTitle}</span>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {applicant.resumeUrl ? (
                      <Button variant="ghost" size="sm" asChild className="h-8 gap-1">
                        <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">No resume</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{applicant.appliedAt}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={applicant.status} showIcon />
                  </TableCell>
                  {atsEnabled && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-accent" />
                        <span
                          className={cn(
                            "font-semibold",
                            (applicant.atsScore || 0) >= 80
                              ? "text-success"
                              : (applicant.atsScore || 0) >= 60
                              ? "text-warning"
                              : "text-muted-foreground"
                          )}
                        >
                          {applicant.atsScore || 0}%
                        </span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                        <DropdownMenuItem onClick={() => onSendEmail(applicant)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onScheduleInterview(applicant)}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Interview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onStatusChange(applicant.id, "SHORTLISTED")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2 text-accent" />
                          Shortlist
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(applicant.id, "SELECTED")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2 text-success" />
                          Accept
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(applicant.id, "REJECTED")}
                        >
                          <XCircle className="h-4 w-4 mr-2 text-destructive" />
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Selection Summary */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
          <span className="text-sm font-medium">
            {selectedIds.length} candidate{selectedIds.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onSelectChange([])}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
