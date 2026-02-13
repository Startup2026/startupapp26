import { useState, useEffect } from "react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { User, Lock, Bell, Shield, Loader2, Save } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function StudentSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userAccount, setUserAccount] = useState({
    username: "",
    email: "",
  });
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await apiFetch<any>("/users/me");
        if (userRes.success && userRes.data) {
          setUserAccount({
            username: userRes.data.username,
            email: userRes.data.email,
          });
        }
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load settings", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await apiFetch<any>("/users/me", {
        method: "PUT",
        body: JSON.stringify({ username: userAccount.username }),
      });
      if (res.success) {
        toast({ title: "Success", description: "Account settings updated" });
      } else {
        toast({ title: "Error", description: res.error || "Update failed", variant: "destructive" });
      }
    } catch (error) {
       toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: "Validation Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (passwords.newPassword && passwords.newPassword.length < 6) {
      toast({ title: "Validation Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    try {
      setSaving(true);
      const res = await apiFetch<any>("/users/me", {
        method: "PUT",
        body: JSON.stringify({ password: passwords.newPassword }),
      });
      if (res.success) {
        toast({ title: "Success", description: "Password changed successfully" });
        setPasswords({ newPassword: "", confirmPassword: "" });
      } else {
        toast({ title: "Error", description: res.error || "Update failed", variant: "destructive" });
      }
    } catch (error) {
       toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account preferences and security</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="bg-muted/50 p-1 mb-6">
            <TabsTrigger value="account" className="gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your basic account details</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateAccount}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={userAccount.username} 
                      onChange={(e) => setUserAccount({...userAccount, username: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" value={userAccount.email} disabled className="bg-muted/50" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed. Contact support for assistance.</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/5 p-4 flex justify-end">
                  <Button type="submit" variant="hero" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
              </CardHeader>
              <form onSubmit={handleChangePassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/5 p-4 flex justify-end">
                  <Button type="submit" variant="hero" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Lock className="h-4 w-4 mr-2" />}
                    Update Password
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how you want to be notified about updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Application Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications when your application status changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Job Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new jobs matching your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features and newsletters</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
}
