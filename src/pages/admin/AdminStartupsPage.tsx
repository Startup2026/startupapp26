import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { Check, X, Eye, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminStartupsPage() {
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<any[]>("/startupProfiles");
      if (response.success && response.data) {
        setStartups(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch startups:", error);
    } finally {
      setLoading(false);
    }
  };

  const reviewStartup = async (id: string, updates: any) => {
    try {
      const response = await apiFetch<{ success: boolean, startup: any }>(`/startupProfile/${id}/admin-review`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      if (response.success) {
        setStartups(prev => prev.map(s => s._id === id ? response.startup : s));
        toast({ title: "Updated successfully", description: "Startup review details have been updated." });
      } else {
        toast({ title: "Error", description: "Failed to update review status.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error occurred.", variant: "destructive" });
    }
  };

  const getApprovalBadge = (status: string) => {
    if (status === 'Approved') return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
    if (status === 'Rejected') return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Startup Eligibility Review</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage verification, eligibility, and incubation statuses.
          </p>
        </div>

        <div className="border rounded-lg bg-card bg-white overflow-x-auto">
          <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead>Startup Name</TableHead>
                <TableHead>Score & Status</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Incubator</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : startups.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">No startups found.</TableCell>
                </TableRow>
              ) : (
                startups.map((startup) => (
                  <TableRow key={startup._id}>
                    <TableCell className="font-medium">{startup.startupName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">Score: {startup.eligibility_score || 0}</span>
                        <span className="text-xs text-muted-foreground">{startup.eligibility_status || 'Pending'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getApprovalBadge(startup.approval_status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        {startup.incubator ? <span>{startup.incubator}</span> : <span className="text-muted-foreground">None</span>}
                        {startup.incubator_claimed && (
                          <Badge variant="outline" className={startup.incubator_verified ? "border-green-300 text-green-700 bg-green-50" : "border-yellow-300 text-yellow-700 bg-yellow-50"}>
                            {startup.incubator_verified ? "Verified" : "Unverified"}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(startup.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                         {startup.approval_status !== 'Approved' && (
                             <Button size="sm" variant="outline" className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100" onClick={() => reviewStartup(startup._id, { approval_status: 'Approved' })}>
                               Approve
                             </Button>
                         )}
                         {startup.approval_status !== 'Rejected' && (
                             <Button size="sm" variant="outline" className="text-destructive border-red-200 bg-red-50 hover:bg-red-100" onClick={() => reviewStartup(startup._id, { approval_status: 'Rejected' })}>
                               Reject
                             </Button>
                         )}
                         {startup.incubator_claimed && !startup.incubator_verified && (
                             <Button size="sm" variant="outline" onClick={() => reviewStartup(startup._id, { incubator_verified: true })}>
                               ✓ Incubator
                             </Button>
                         )}
                         <Button variant="ghost" size="icon" onClick={() => {
                             const override = prompt("Override Eligibility Status? (Eligible Startup, Needs Manual Review, Not Eligible)", startup.eligibility_status);
                             if (override) reviewStartup(startup._id, { eligibility_status: override });
                         }}>
                             <Edit className="h-4 w-4 text-muted-foreground" />
                         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
