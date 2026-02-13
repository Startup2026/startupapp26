import { useState, useEffect } from "react";
import { 
  Bookmark, 
  BookmarkMinus, 
  Briefcase, 
  Rss, 
  MapPin, 
  DollarSign, 
  ArrowRight,
  Loader2,
  MessageCircle,
  Heart
} from "lucide-react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch, getStoredUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function SavedItemsPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();
  const navigate = useNavigate();

  const fetchSavedItems = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      // Fetching from your specific saved jobs route and the recommendation posts route
      const [jobsRes, postsRes] = await Promise.all([
        apiFetch("/save-job"), // Your provided specific route
        apiFetch(`/recommendations/posts/${user._id}`)
      ]);

      if (jobsRes.success) {
        setSavedJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      }
      
      if (postsRes.success) {
        // Filter posts that have the isSaved flag from the recommendation system
        setSavedPosts((postsRes.data as any[]).filter((p: any) => p.isSaved));
      }
    } catch (error) {
      console.error("Error fetching saved items:", error);
      toast({ title: "Error", description: "Failed to load saved items", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedItems();
  }, [user?._id]);

  const handleUnsave = async (id: string, type: 'job' | 'post') => {
    try {
      // Using DELETE method based on standard practices
      const endpoint = type === 'post' ? `/sav-posts/${id}` : `/save-job/${id}`;
      
      const res = await apiFetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user._id })
      });

      if (res.success !== false) {
        toast({ title: "Removed from saved items" });
        if (type === 'post') {
          setSavedPosts(prev => prev.filter(p => p._id !== id));
        } else {
          setSavedJobs(prev => prev.filter(j => j._id !== id));
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not remove item", variant: "destructive" });
    }
  };

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Bookmark className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-3xl font-bold">Saved Items</h1>
          </div>
          <p className="text-muted-foreground">Manage your bookmarked opportunities and updates.</p>
        </div>

        <Tabs defaultValue="jobs" className="max-w-5xl mx-auto">
          <TabsList className="mb-6">
            <TabsTrigger value="jobs" className="gap-2">
              <Briefcase className="h-4 w-4" /> Saved Jobs ({savedJobs.length})
            </TabsTrigger>
            <TabsTrigger value="posts" className="gap-2">
              <Rss className="h-4 w-4" /> Saved Posts ({savedPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
            ) : savedJobs.length > 0 ? (
              savedJobs.map((item) => {
                // Ensure we handle both direct job objects or populated wrappers
                const job = item.jobId || item; 
                return (
                  <Card key={job._id} className="hover:border-accent/40 transition-colors">
                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center font-bold text-accent">
                          {(job.startupId?.startupName || "S").substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{job.role}</h3>
                          <p className="text-sm text-muted-foreground">{job.startupId?.startupName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location || "Remote"}</div>
                        <div className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> {job.salary || "Paid"}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleUnsave(item._id, 'job')}
                        >
                          <BookmarkMinus className="h-5 w-5" />
                        </Button>
                        <Button onClick={() => navigate(`/student/jobs/${job._id}`)} variant="outline" className="gap-2">
                          View <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <EmptyState message="No saved jobs yet." />
            )}
          </TabsContent>

          <TabsContent value="posts" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
            ) : savedPosts.length > 0 ? (
              savedPosts.map((post) => (
                <Card key={post._id} className="hover:border-accent/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                          {(post.startupid?.startupName || "S").substring(0, 1)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{post.startupid?.startupName}</h4>
                          <p className="text-xs text-muted-foreground">Saved Post</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleUnsave(post._id, 'post')}
                      >
                        <BookmarkMinus className="h-5 w-5" />
                      </Button>
                    </div>
                    <h3 className="font-bold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.description}</p>
                    <div className="flex items-center justify-between">
                       <div className="flex gap-4 text-muted-foreground">
                          <span className="flex items-center gap-1 text-xs"><Heart className="h-3 w-3" /> {post.likes}</span>
                          <span className="flex items-center gap-1 text-xs"><MessageCircle className="h-3 w-3" /> {post.comments?.length || 0}</span>
                       </div>
                       <Button variant="ghost" size="sm" onClick={() => navigate(`/student/feed`)}>View in Feed</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <EmptyState message="No saved posts yet." />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 border-2 border-dashed rounded-xl">
      <Bookmark className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}