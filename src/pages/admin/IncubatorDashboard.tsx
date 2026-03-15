import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch, getStoredUser } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Users, Building, DollarSign, CheckCircle, Plus, BarChart3, Loader2, XCircle, Eye } from "lucide-react";
import { CreatePostModal } from "@/components/startup/CreatePostModal";

type InvitationCodeRecord = {
  _id: string;
  code: string;
  companyName: string;
  recipientEmail: string;
  sentAt?: string;
  usedAt?: string | null;
  usedByStartupId?: {
    _id: string;
    startupName: string;
  } | null;
};

export default function IncubatorDashboard() {
  const user = getStoredUser();
  const [stats, setStats] = useState<any>(null);
  const [startups, setStartups] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<any[]>([]);
  const [trendingJobs, setTrendingJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [processingStartupId, setProcessingStartupId] = useState<string | null>(null);
  const [payoutLoading, setPayoutLoading] = useState(true);
  const [payoutSaving, setPayoutSaving] = useState(false);
  const [showUpiId, setShowUpiId] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showIfscCode, setShowIfscCode] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<"upi" | "bank">("upi");
  const [invitationCodes, setInvitationCodes] = useState<InvitationCodeRecord[]>([]);
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    companyName: "",
    recipientEmail: "",
  });
  const [payoutForm, setPayoutForm] = useState({
    upiId: "",
    bankAccountHolderName: "",
    bankAccountNumber: "",
    bankName: "",
    ifscCode: "",
    branchName: "",
  });

  const maskUpiId = (upiId: string) => {
    const value = upiId.trim();
    if (!value) return "";
    const [username, domain] = value.split("@");
    if (!domain) return `${value.slice(0, 2)}${"*".repeat(Math.max(value.length - 2, 1))}`;
    const safePrefix = username.slice(0, 2);
    const maskedUsername = `${safePrefix}${"*".repeat(Math.max(username.length - 2, 1))}`;
    return `${maskedUsername}@${domain}`;
  };

  const maskAccountNumber = (accountNumber: string) => {
    const digits = accountNumber.replace(/\s+/g, "");
    if (!digits) return "";
    if (digits.length <= 4) return "*".repeat(digits.length);
    return `${"*".repeat(digits.length - 4)}${digits.slice(-4)}`;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setPayoutLoading(true);
    try {
      const recommendationUserId = user?._id;

      const [statsRes, startupsRes, feedRes, payoutRes, invitationCodesRes, recommendedPostsRes, trendingJobsRes] = await Promise.all([
        apiFetch("/incubator/dashboard"),
        apiFetch("/incubator/startups"),
        apiFetch("/incubator/feed"),
        apiFetch("/incubator/payout-details"),
        apiFetch("/incubator/invitation-codes"),
        apiFetch(
          recommendationUserId
            ? `/recommendations/posts/${recommendationUserId}?limit=3&page=1`
            : "/recommendations/cold-start/posts?limit=3&page=1"
        ),
        apiFetch(`/recommendations/trending/jobs?limit=3&page=1${recommendationUserId ? `&userId=${recommendationUserId}` : ""}`),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (startupsRes.success && startupsRes.data) {
        setStartups(startupsRes.data);
      }
      if (feedRes.success && feedRes.data) {
        setUpdates(feedRes.data);
      }
      if (payoutRes.success && payoutRes.data) {
        const payoutData = payoutRes.data;
        setPayoutMethod(payoutData.method === "bank" ? "bank" : "upi");
        setPayoutForm({
          upiId: payoutData.upiId || "",
          bankAccountHolderName: payoutData.bankAccountHolderName || "",
          bankAccountNumber: payoutData.bankAccountNumber || "",
          bankName: payoutData.bankName || "",
          ifscCode: payoutData.ifscCode || "",
          branchName: payoutData.branchName || "",
        });
      }
      if (invitationCodesRes.success && invitationCodesRes.data) {
        setInvitationCodes(invitationCodesRes.data);
      }
      if (recommendedPostsRes.success && Array.isArray(recommendedPostsRes.data)) {
        setRecommendedPosts(recommendedPostsRes.data.slice(0, 3));
      }
      if (trendingJobsRes.success && Array.isArray(trendingJobsRes.data)) {
        setTrendingJobs(trendingJobsRes.data.slice(0, 3));
      }
    } catch (error) {
      console.error("Failed to fetch incubator data", error);
    } finally {
      setLoading(false);
      setPayoutLoading(false);
    }
  };

  const handlePayoutFieldChange = (field: string, value: string) => {
    setPayoutForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleInviteFieldChange = (field: "companyName" | "recipientEmail", value: string) => {
    setInviteForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateIncubationCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteForm.companyName.trim() || !inviteForm.recipientEmail.trim()) {
      toast({
        title: "Missing details",
        description: "Company name and company email are required.",
        variant: "destructive",
      });
      return;
    }

    setInviteSubmitting(true);
    try {
      const res = await apiFetch("/incubator/invitation-codes", {
        method: "POST",
        body: JSON.stringify(inviteForm),
      });

      if (!res.success) {
        toast({
          title: "Code creation failed",
          description: res.error || "Failed to create and email incubation code.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Incubation code sent",
        description: `A Wostup email has been sent to ${inviteForm.recipientEmail.trim()}.`,
      });
      setInviteForm({ companyName: "", recipientEmail: "" });
      await fetchDashboardData();
    } catch (error) {
      console.error("Failed to create incubation code", error);
      toast({
        title: "Code creation failed",
        description: "Failed to create and email incubation code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setInviteSubmitting(false);
    }
  };

  const handleSavePayoutDetails = async (e: React.FormEvent) => {
    e.preventDefault();

    if (payoutMethod === "upi" && !payoutForm.upiId.trim()) {
      toast({
        title: "Missing UPI ID",
        description: "Please enter your UPI ID.",
        variant: "destructive",
      });
      return;
    }

    if (
      payoutMethod === "bank" &&
      (!payoutForm.bankAccountHolderName.trim() ||
        !payoutForm.bankAccountNumber.trim() ||
        !payoutForm.bankName.trim() ||
        !payoutForm.ifscCode.trim())
    ) {
      toast({
        title: "Missing bank details",
        description: "Please fill required bank fields.",
        variant: "destructive",
      });
      return;
    }

    setPayoutSaving(true);
    try {
      const res = await apiFetch("/incubator/payout-details", {
        method: "PUT",
        body: JSON.stringify({ method: payoutMethod, ...payoutForm }),
      });

      if (!res.success) {
        toast({
          title: "Save failed",
          description: res.error || "Failed to save payout details.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Payout details saved",
        description: "Your payout information has been stored.",
      });
    } catch (error) {
      console.error("Failed to save payout details", error);
      toast({
        title: "Save failed",
        description: "Failed to save payout details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPayoutSaving(false);
    }
  };

  const handleAffiliationAction = async (startupId: string, action: "verify" | "reject") => {
    const actionLabel = action === "verify" ? "approve" : "reject";
    if (action === "reject") {
      const confirmed = window.confirm(
        "Reject this startup's incubator affiliation? The startup will remain on platform but be removed from your incubator affiliation."
      );
      if (!confirmed) return;
    }

    setProcessingStartupId(startupId);
    try {
      const res = await apiFetch(`/incubator/startup/${startupId}/${action}`, {
        method: "PUT",
      });

      if (!res.success) {
        toast({
          title: "Action failed",
          description: res.error || `Failed to ${actionLabel} startup affiliation.`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: action === "verify" ? "Startup approved" : "Startup rejected",
        description:
          action === "verify"
            ? "Startup is now affiliated and eligible for incubator margin share."
            : "Startup remains on platform but affiliation has been removed.",
      });

      await fetchDashboardData();
    } catch (error) {
      console.error(`Failed to ${actionLabel} startup affiliation`, error);
      toast({
        title: "Action failed",
        description: `Failed to ${actionLabel} startup affiliation. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setProcessingStartupId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Incubator Dashboard</h1>
            <p className="text-muted-foreground mt-1">Platform overview and startup performance</p>
          </div>
          <div className="flex gap-2">
            <Link to="/incubator/profile">
              <Button variant="outline" className="gap-2">
                <Building className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
            <Link to="/incubator/social-analysis">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Social Analysis
              </Button>
            </Link>
            <Button onClick={() => setIsCreatePostOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Post
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : stats?.totalStartups || 0}</div>
                <p className="text-xs text-muted-foreground">Claimed + Verified</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Hiring</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : stats?.activeHiringStartups || 0}</div>
                <p className="text-xs text-muted-foreground">Startups with open jobs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Incentive Earned</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : `₹${stats?.totalIncubatorShare || 0}`}</div>
                <p className="text-xs text-muted-foreground">All-time incubator incentive</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Incentive</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : `₹${stats?.revenueThisMonth || 0}`}</div>
              </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mt-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recommended Feed</CardTitle>
              <Link to="/incubator/feed">
                <Button variant="ghost" size="sm">View Feed</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendedPosts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recommended posts right now.</p>
              ) : (
                recommendedPosts.map((post) => (
                  <div key={post._id} className="rounded-lg border p-3">
                    <p className="font-medium line-clamp-1">{post.title || "Startup Update"}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {post.description || "Fresh update from startup ecosystem."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">{post.startupid?.startupName || "Startup"}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Trending Jobs</CardTitle>
              <Link to="/incubator/trending">
                <Button variant="ghost" size="sm">View Trending</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No trending jobs available right now.</p>
              ) : (
                trendingJobs.map((job) => (
                  <div key={job._id} className="rounded-lg border p-3">
                    <p className="font-medium line-clamp-1">{job.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {job.startup?.startupName || "Startup"} • {job.location || "Remote"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{job.jobType || "Role"}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mt-8">
          {/* Startups Table - Read Only */}
          <div className="lg:col-span-2 border rounded-lg bg-card bg-white overflow-hidden h-fit">
            <div className="p-4 border-b bg-muted/20">
                <h2 className="text-lg font-semibold">Affiliated Startups</h2>
            </div>
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Startup Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Hiring</TableHead>
                    <TableHead>Status</TableHead>
                  <TableHead className="text-right">Affiliation Action</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ) : startups.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">No startups found.</TableCell></TableRow>
                ) : (
                    startups.map((startup) => (
                    <TableRow key={startup._id}>
                        <TableCell className="font-medium">
                            <Link to={`/admin/incubation/startup/${startup._id}`} className="hover:underline text-primary">
                                {startup.startupName}
                            </Link>
                        </TableCell>
                        <TableCell>{startup.industry}</TableCell>
                        <TableCell>{startup.stage}</TableCell>
                        <TableCell>
                          {(startup.activeHiring ?? startup.hiring) ? (
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                        {startup.incubator_verified ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex gap-1 w-fit"><CheckCircle className="w-3 h-3"/> Verified</Badge>
                        ) : (
                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending Approval</Badge>
                        )}
                        </TableCell>
                        <TableCell className="text-right">
                          {startup.incubator_verified ? (
                            <span className="text-xs text-muted-foreground">Approved</span>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAffiliationAction(startup._id, "verify")}
                                disabled={processingStartupId === startup._id}
                              >
                                {processingStartupId === startup._id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => handleAffiliationAction(startup._id, "reject")}
                                disabled={processingStartupId === startup._id}
                              >
                                <XCircle className="h-3 w-3" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Incubation Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4" onSubmit={handleCreateIncubationCode}>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={inviteForm.companyName}
                      onChange={(e) => handleInviteFieldChange("companyName", e.target.value)}
                      placeholder="Startup or company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail">Company Email</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      value={inviteForm.recipientEmail}
                      onChange={(e) => handleInviteFieldChange("recipientEmail", e.target.value)}
                      placeholder="founder@company.com"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={inviteSubmitting}>
                    {inviteSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create and Email Code"}
                  </Button>
                </form>

                <div className="rounded-md border p-3 bg-muted/30 text-sm space-y-3">
                  <p className="font-medium">Recent Codes</p>
                  {invitationCodes.length === 0 ? (
                    <p className="text-muted-foreground">No incubation codes sent yet.</p>
                  ) : (
                    invitationCodes.slice(0, 5).map((record) => (
                      <div key={record._id} className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium">{record.companyName}</p>
                            <p className="text-muted-foreground">{record.recipientEmail}</p>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {record.usedAt ? "Used" : "Sent"}
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-xs text-foreground">{record.code}</p>
                        {record.usedByStartupId?.startupName ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Redeemed by {record.usedByStartupId.startupName}
                          </p>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Details</CardTitle>
              </CardHeader>
              <CardContent>
                {payoutLoading ? (
                  <Skeleton className="h-40 w-full" />
                ) : (
                  <form className="space-y-4" onSubmit={handleSavePayoutDetails}>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={payoutMethod === "upi" ? "default" : "outline"}
                        onClick={() => setPayoutMethod("upi")}
                      >
                        UPI ID
                      </Button>
                      <Button
                        type="button"
                        variant={payoutMethod === "bank" ? "default" : "outline"}
                        onClick={() => setPayoutMethod("bank")}
                      >
                        Bank Details
                      </Button>
                    </div>

                    {payoutMethod === "upi" ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="upiId">UPI ID</Label>
                          <Button type="button" variant="ghost" size="sm" onClick={() => setShowUpiId((prev) => !prev)}>
                            {showUpiId ? "Hide" : "Show"}
                          </Button>
                        </div>
                        <Input
                          id="upiId"
                          type={showUpiId ? "text" : "password"}
                          value={payoutForm.upiId}
                          onChange={(e) => handlePayoutFieldChange("upiId", e.target.value)}
                          placeholder="example@upi"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="accountHolder">Account Holder Name</Label>
                          <Input
                            id="accountHolder"
                            value={payoutForm.bankAccountHolderName}
                            onChange={(e) => handlePayoutFieldChange("bankAccountHolderName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAccountNumber((prev) => !prev)}>
                              {showAccountNumber ? "Hide" : "Show"}
                            </Button>
                          </div>
                          <Input
                            id="accountNumber"
                            type={showAccountNumber ? "text" : "password"}
                            value={payoutForm.bankAccountNumber}
                            onChange={(e) => handlePayoutFieldChange("bankAccountNumber", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            value={payoutForm.bankName}
                            onChange={(e) => handlePayoutFieldChange("bankName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="ifscCode">IFSC Code</Label>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setShowIfscCode((prev) => !prev)}>
                              {showIfscCode ? "Hide" : "Show"}
                            </Button>
                          </div>
                          <Input
                            id="ifscCode"
                            type={showIfscCode ? "text" : "password"}
                            value={payoutForm.ifscCode}
                            onChange={(e) => handlePayoutFieldChange("ifscCode", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="branchName">Branch Name (Optional)</Label>
                          <Input
                            id="branchName"
                            value={payoutForm.branchName}
                            onChange={(e) => handlePayoutFieldChange("branchName", e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <Button type="submit" disabled={payoutSaving} className="w-full">
                      {payoutSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Payout Details"}
                    </Button>

                    {(payoutForm.upiId || payoutForm.bankAccountNumber) && (
                      <div className="rounded-md border p-3 bg-muted/30 text-sm space-y-1">
                        <p className="font-medium">Saved Preview (Masked)</p>
                        {payoutMethod === "upi" ? (
                          <p className="text-muted-foreground">UPI: {maskUpiId(payoutForm.upiId)}</p>
                        ) : (
                          <>
                            <p className="text-muted-foreground">Account: {maskAccountNumber(payoutForm.bankAccountNumber)}</p>
                            <p className="text-muted-foreground">IFSC: {payoutForm.ifscCode ? `${payoutForm.ifscCode.slice(0, 2)}******` : ""}</p>
                          </>
                        )}
                      </div>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>

            <div className="border rounded-lg bg-card bg-white h-fit">
              <div className="p-4 border-b bg-muted/20">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" /> Portfolio Updates
                  </h2>
              </div>
              <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                  {loading ? (
                      <div className="space-y-3">
                          <Skeleton className="h-20 w-full" />
                          <Skeleton className="h-20 w-full" />
                      </div>
                  ) : updates.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                          <p>No recent updates from your startups.</p>
                      </div>
                  ) : (
                      updates.map((update, idx) => (
                          <div key={idx} className="border-b pb-3 last:border-0 last:pb-0">
                              <div className="flex justify-between items-start mb-1">
                                  <span className="font-semibold text-sm">{update.startupName}</span>
                                  <span className="text-xs text-muted-foreground">
                                      {new Date(update.date).toLocaleDateString()}
                                  </span>
                              </div>
                              <h3 className="font-medium text-primary text-sm mb-1">{update.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-3">{update.content}</p>
                              {update.type === "post" && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                  <Eye className="h-3 w-3" />
                                  {update.analytics?.views_count || 0} views
                                </div>
                              )}
                          </div>
                      ))
                  )}
              </div>
            </div>
          </div>
        </div>

      </div>
      <CreatePostModal open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
    </AdminLayout>
  );
}
