import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type IncubatorProfile = {
  _id: string;
  name: string;
  website?: string;
  revenue_share_percentage: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function IncubatorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<IncubatorProfile | null>(null);
  const [form, setForm] = useState({ name: "", website: "" });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/incubator/profile");
      if (res.success && res.data) {
        const profileData = res.data as IncubatorProfile;
        setProfile(profileData);
        setForm({
          name: profileData.name || "",
          website: profileData.website || "",
        });
      } else {
        toast({
          title: "Failed to load profile",
          description: res.error || "Could not fetch incubator profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to load incubator profile", error);
      toast({
        title: "Failed to load profile",
        description: "Could not fetch incubator profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const res = await apiFetch("/incubator/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: form.name,
          website: form.website,
        }),
      });

      if (!res.success || !res.data) {
        toast({
          title: "Update failed",
          description: res.error || "Unable to update incubator profile.",
          variant: "destructive",
        });
        return;
      }

      setProfile(res.data as IncubatorProfile);
      toast({
        title: "Profile updated",
        description: "Incubator profile details were saved successfully.",
      });
    } catch (error) {
      console.error("Failed to update incubator profile", error);
      toast({
        title: "Update failed",
        description: "Unable to update incubator profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Incubator Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your incubator identity and public details.</p>
        </div>

        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your incubator name and website.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={handleSave}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Incubator Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={form.website}
                      onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                      placeholder="https://example.com"
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Program Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Revenue Share</span>
                  <span className="font-medium">{profile?.revenue_share_percentage ?? 10}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={profile?.isActive ? "default" : "secondary"}>
                    {profile?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
