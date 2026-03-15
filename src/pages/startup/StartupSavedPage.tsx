import { useEffect, useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { apiFetch, getStoredUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function StartupSavedPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [jobsRes, postsRes] = await Promise.all([
        apiFetch("/save-job"),
        user?._id ? apiFetch(`/recommendations/posts/${user._id}?limit=50&page=1`) : Promise.resolve({ success: false, data: [] }),
      ]);

      if (jobsRes.success && Array.isArray(jobsRes.data)) {
        setSavedJobs(jobsRes.data);
      } else {
        setSavedJobs([]);
      }

      if (postsRes.success && Array.isArray(postsRes.data)) {
        setSavedPosts(postsRes.data.filter((post: any) => post?.isSaved));
      } else {
        setSavedPosts([]);
      }

      setLoading(false);
    };

    load();
  }, [user?._id]);

  return (
    <StartupLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Bookmark className="h-6 w-6 text-accent" />
          <h1 className="text-3xl font-bold">Saved</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
          <Tabs defaultValue="jobs" className="space-y-4">
            <TabsList>
              <TabsTrigger value="jobs">Saved Jobs ({savedJobs.length})</TabsTrigger>
              <TabsTrigger value="posts">Saved Posts ({savedPosts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-3">
              {savedJobs.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">No saved jobs found.</CardContent></Card>
              ) : (
                savedJobs.map((saved) => {
                  const job = saved?.jobId || saved;
                  const jobId = job?._id || job?.id;
                  return (
                    <Card key={saved?._id || job?._id}>
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-1">{job?.role || "Saved role"}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-1">{job?.startupId?.startupName || "Startup"}</p>
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!jobId}
                            onClick={() => {
                              if (!jobId) return;
                              navigate(`/startup/jobs/${jobId}/applications`);
                            }}
                          >
                            View Job
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="posts" className="space-y-3">
              {savedPosts.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">No saved posts found.</CardContent></Card>
              ) : (
                savedPosts.map((post) => {
                  const postId = post.contentId || post.postId || post._id || post.id;
                  return (
                  <Card key={postId || post._id || post.id}>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-1">{post.title || "Saved post"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-1">{post.startupid?.startupName || "Startup"}</p>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!postId}
                          onClick={() => {
                            if (!postId) return;
                            navigate(`/startup/posts/${postId}`);
                          }}
                        >
                          View Post
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
                })
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </StartupLayout>
  );
}
