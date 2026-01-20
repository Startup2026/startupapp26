import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectableCandidate {
  id: string;
  name: string;
  email: string;
  status?: string;
  jobTitle?: string;
}

interface ApplicantSelectionTableProps {
  candidates: SelectableCandidate[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  showStatus?: boolean;
  maxHeight?: string;
}

export function ApplicantSelectionTable({
  candidates,
  selectedIds,
  onSelectionChange,
  showStatus = true,
  maxHeight = "280px",
}: ApplicantSelectionTableProps) {
  const [search, setSearch] = useState("");

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const allFilteredSelected =
    filteredCandidates.length > 0 &&
    filteredCandidates.every((c) => selectedIds.includes(c.id));

  const toggleCandidate = (id: string) => {
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newIds = new Set([...selectedIds, ...filteredCandidates.map((c) => c.id)]);
      onSelectionChange(Array.from(newIds));
    } else {
      const filteredIds = new Set(filteredCandidates.map((c) => c.id));
      onSelectionChange(selectedIds.filter((id) => !filteredIds.has(id)));
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "APPLIED":
        return "bg-secondary text-secondary-foreground";
      case "SHORTLISTED":
        return "bg-accent/10 text-accent border-accent/20";
      case "INTERVIEW_SCHEDULED":
        return "bg-warning/10 text-warning border-warning/20";
      case "SELECTED":
        return "bg-success/10 text-success border-success/20";
      case "REJECTED":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatStatus = (status?: string) => {
    if (!status) return "N/A";
    return status.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-3">
      {/* Header with search and selection count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {selectedIds.length} of {candidates.length} selected
          </span>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="border rounded-lg overflow-hidden"
        style={{ maxHeight }}
      >
        <div className="overflow-auto" style={{ maxHeight }}>
          <Table>
            <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
              <TableRow className="hover:bg-muted/80">
                <TableHead className="w-12 py-3">
                  <Checkbox
                    checked={allFilteredSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="py-3 font-semibold">Candidate Name</TableHead>
                <TableHead className="py-3 font-semibold">Email</TableHead>
                {showStatus && (
                  <TableHead className="py-3 font-semibold text-right">Status</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={showStatus ? 4 : 3}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {search ? "No candidates match your search" : "No candidates available"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCandidates.map((candidate) => (
                  <TableRow
                    key={candidate.id}
                    className={cn(
                      "cursor-pointer transition-colors",
                      selectedIds.includes(candidate.id) && "bg-accent/5"
                    )}
                    onClick={() => toggleCandidate(candidate.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.includes(candidate.id)}
                        onCheckedChange={() => toggleCandidate(candidate.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{candidate.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm">{candidate.email}</span>
                    </TableCell>
                    {showStatus && (
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", getStatusColor(candidate.status))}
                        >
                          {formatStatus(candidate.status)}
                        </Badge>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Selection summary */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-accent/5 rounded-lg border border-accent/10">
          <span className="text-sm text-accent font-medium">
            {selectedIds.length} candidate{selectedIds.length !== 1 ? "s" : ""} selected
          </span>
          <button
            onClick={() => onSelectionChange([])}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
