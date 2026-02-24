import { useState, useEffect } from "react";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { User, Lock, Bell, Building, Globe, Shield, Loader2, Save } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { startupProfileService } from "@/services/startupProfileService";

export default function StartupSettingsPage() {
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
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch User Account
        const userRes = await apiFetch<any>("/users/me");
        if (userRes.success && userRes.data) {
          setUserAccount({
            username: userRes.data.username,
            email: userRes.data.email,
          });
        }

        // Fetch Startup Profile
        const profileRes = await startupProfileService.getMyProfile();
        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data);
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
    if (passwords.newPassword.length < 6) {
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

  const handleUpdateProfileSettings = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      const res = await startupProfileService.updateProfile(profile._id, {
         website: profile.website,
         industry: profile.industry,
         tagline: profile.tagline
      });
      if (res.success) {
        toast({ title: "Success", description: "Profile settings updated" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Update failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <StartupLayout>
        <div className="flex bg-background h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </StartupLayout>
    );
  }

  return (
    <StartupLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and startup configuration</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="account" className="gap-2">
              <User className="h-4 w-4" /> Account
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Public Profile Info</CardTitle>
                  <CardDescription>This information will be displayed on your public profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startupName">Startup Name</Label>
                    <Input id="startupName" value={profile?.startupName || ""} disabled />
                    <p className="text-xs text-muted-foreground">To change your legal name, contact support.</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input 
                        id="tagline" 
                        value={profile?.tagline || ""} 
                        onChange={(e) => setProfile({...profile, tagline: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="flex gap-2">
                        <Input 
                            id="website" 
                            value={profile?.website || ""} 
                            onChange={(e) => setProfile({...profile, website: e.target.value})}
                        />
                        <Button variant="outline" size="icon" asChild>
                            <a href={profile?.website} target="_blank" rel="noreferrer"><Globe className="h-4 w-4" /></a>
                        </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button onClick={handleUpdateProfileSettings} disabled={saving} className="gap-2">
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    <Save className="h-4 w-4" /> Save Profile Changes
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Update your login credentials and display name</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateAccount}>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        value={userAccount.username} 
                        onChange={(e) => setUserAccount({...userAccount, username: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" value={userAccount.email} disabled />
                      <p className="text-xs text-muted-foreground">Email cannot be changed currently.</p>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={saving} className="gap-2">
                       {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                       Update Account
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password to keep your account secure</CardDescription>
              </CardHeader>
              <form onSubmit={handleChangePassword}>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                        id="newPassword" 
                        type="password" 
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button type="submit" disabled={saving}>Change Password</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive daily summaries of job applications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Applicant Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified immediately when someone applies</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Interview Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminders 1 hour before scheduled interviews</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StartupLayout>
  );
}
