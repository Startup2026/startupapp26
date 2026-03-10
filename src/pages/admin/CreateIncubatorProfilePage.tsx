import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { AdminLayout } from "@/components/layouts/AdminLayout";


import { useAuth } from "@/contexts/AuthContext";

export default function CreateIncubatorProfilePage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    website: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch("/incubator/create-profile", {
        method: "POST",
        body: JSON.stringify(form)
      });
      if (res.success) {
        toast({ title: "Profile Created", description: "Your incubator profile is now live." });
        await refreshUser(); // Update context to reflect profile completion
        navigate("/incubator/dashboard");
      } else {
        toast({ title: "Error", description: res.error || "Failed to create profile.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Incubator Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Incubator Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" value={form.website} onChange={handleChange} />
              </div>
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Profile"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
