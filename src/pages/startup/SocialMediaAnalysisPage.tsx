import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  FileText,
  TrendingUp,
  Image,
  Video,
  CalendarDays,
  BarChart3,
  Loader2,
  Eye,
  ThumbsUp,
  Bookmark,
} from "lucide-react";
import { postService, Post } from "@/services/postService";
import { feedService } from "@/services/feedService";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

import { StartupLayout } from "@/components/layouts/StartupLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Button } from "@/components/ui/button";

/* -------------------- HELPERS -------------------- */

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};
const BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

function getPostType(post: Post): "photo" | "video" | "text" {
  if (post.media?.video) return "video";
  if (post.media?.photo) return "photo";
  return "text";
}

function getWeekLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  return startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* -------------------- PAGE -------------------- */

export default function SocialMediaAnalysisPage() {
  const { 
    hasAccess, 
    loading: planLoading, 
    isUpgradeModalOpen, 
    closeUpgradeModal, 
    triggeredFeature,
    checkAccessAndShowModal
  } = usePlanAccess();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyticsPosts, setAnalyticsPosts] = useState<any[]>([]); // Posts with populated analytics
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [filter, setFilter] = useState("latest");

  // Fetch standard posts for summary cards
  useEffect(() => {
    const fetchPosts = async () => {
      if (!hasAccess("socialRecruiter")) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const result = await postService.getStartupPosts();
        if (result.success && result.data) {
          setPosts(result.data);
        } else {
            console.warn("Failed to fetch posts");
            setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [hasAccess]);

  // Fetch analytics-enriched posts for the table
  useEffect(() => {
    if (!hasAccess("socialRecruiter")) {
        setAnalyticsLoading(false);
        return;
    }
    const fetchAnalytics = async () => {
        setAnalyticsLoading(true);
        try {
            const res = await feedService.getMyPosts(filter);
            if (res.success && res.data) {
                setAnalyticsPosts(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch analytics posts", error);
        } finally {
            setAnalyticsLoading(false);
        }
    };
    fetchAnalytics();
  }, [filter, hasAccess]);

  const analytics = useMemo(() => {
    const totalPosts = posts.length;
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
    const totalComments = posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
    const avgEngagement = totalPosts > 0 ? ((totalLikes + totalComments) / totalPosts).toFixed(1) : "0";

    // Engagement trend by week
    const weekMap = new Map<string, number>();
    posts.forEach((p) => {
      const week = getWeekLabel(p.createdAt);
      const engagement = (p.likes?.length || 0) + (p.comments?.length || 0);
      weekMap.set(week, (weekMap.get(week) || 0) + engagement);
    });
    const engagementTrend = Array.from(weekMap.entries())
      .map(([week, engagement]) => ({ week, engagement }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());

    // Top performing posts
    const topPosts = [...posts]
      .map((p) => ({
        _id: p._id,
        title: p.title || "Untitled Post",
        likes: p.likes?.length || 0,
        comments: p.comments?.length || 0,
        engagement: (p.likes?.length || 0) + (p.comments?.length || 0),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        type: getPostType(p),
        thumbnail: p.media?.photo,
      }))
      .sort((a, b) => b.engagement - a.engagement);

    // Post type performance
    const typeMap: Record<string, { total: number; count: number }> = {};
    posts.forEach((p) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const type = getPostType(p);
      if (!typeMap[type]) typeMap[type] = { total: 0, count: 0 };
      typeMap[type].total += (p.likes?.length || 0) + (p.comments?.length || 0);
      typeMap[type].count += 1;
    });
    const postTypePerformance = Object.entries(typeMap).map(([type, data]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      avgEngagement: Math.round(data.total / data.count),
    }));

    // Posting frequency
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const postsThisMonth = posts.filter((p) => new Date(p.createdAt) >= thisMonthStart).length;
    const postsThisWeek = posts.filter((p) => new Date(p.createdAt) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)).length;

    // Avg posts per month (based on data range)
    const dates = posts.length > 0 ? posts.map((p) => new Date(p.createdAt).getTime()) : [now.getTime()];
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const rangeMonths = Math.max(1, Math.ceil((maxDate - minDate) / (30 * 24 * 60 * 60 * 1000)));
    const avgPostsPerMonth = (totalPosts / rangeMonths).toFixed(1);

    return {
      totalPosts,
      totalLikes,
      totalComments,
      avgEngagement,
      engagementTrend,
      topPosts,
      postTypePerformance,
      postsThisMonth,
      postsThisWeek,
      avgPostsPerMonth,
    };
  }, [posts]);

  if (loading) {
    return (
      <StartupLayout>
          <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <span className="ml-3 text-muted-foreground font-medium">Analyzing your social presence...</span>
          </div>
      </StartupLayout>
    );
  }

  const statCards = [
    {
      title: "Total Posts",
      value: analytics.totalPosts.toLocaleString(),
      icon: FileText,
    },
    {
      title: "Total Likes",
      value: analytics.totalLikes.toLocaleString(),
      icon: Heart,
    },
    {
      title: "Total Comments",
      value: analytics.totalComments.toLocaleString(),
      icon: MessageCircle,
    },
    {
      title: "Avg Engagement / Post",
      value: analytics.avgEngagement,
      icon: TrendingUp,
    },
  ];

  if (planLoading) {
    return (
      <StartupLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </StartupLayout>
    );
  }

  if (!hasAccess("socialRecruiter")) {
    return (
      <StartupLayout>
          <div className="h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-card rounded-xl border-2 border-dashed">
              <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Content Performance Insights</h2>
                <p className="text-muted-foreground max-w-md mb-6">
                  Analyze your social presence, engagement rates, and content efficiency. 
                  Upgrade to the Sprint (3-Month) or Partner (12-Month) plan to access this feature.
                </p>
              <Button size="lg" onClick={() => navigate("/startup/select-plan")}>
                  Upgrade to Premium
              </Button>
          </div>
      </StartupLayout>
    );
  }

  return (
    <StartupLayout>
      <div className="space-y-8 animate-fade-in">
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-accent" />
            Social Media Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Post engagement metrics and content performance insights
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title} variant="glass">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <stat.icon className="h-5 w-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ENGAGEMENT TREND + POST TYPE PERFORMANCE */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* ENGAGEMENT TREND */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Engagement Trend
              </CardTitle>
              <CardDescription>
                Total likes + comments grouped by week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.engagementTrend}>
                    <defs>
                      <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="week"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Area
                      type="monotone"
                      dataKey="engagement"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      fill="url(#engagementGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* POST TYPE PERFORMANCE */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-accent" />
                Post Type Performance
              </CardTitle>
              <CardDescription>
                Avg engagement by content type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.postTypePerformance}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="type"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar
                      dataKey="avgEngagement"
                      fill="hsl(var(--accent))"
                      radius={[6, 6, 0, 0]}
                      barSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TOP PERFORMING POSTS + POSTING FREQUENCY */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* TOP POSTS TABLE */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Top Performing Posts
              </CardTitle>
              <CardDescription>
                Ranked by total engagement (likes + comments)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8">#</TableHead>
                      <TableHead>Post Title</TableHead>
                      <TableHead className="text-center">Type</TableHead>
                      <TableHead className="text-right">Likes</TableHead>
                      <TableHead className="text-right">Comments</TableHead>
                      <TableHead className="text-right">Engagement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.topPosts.slice(0, 6).map((post, i) => (
                      <TableRow
                        key={post._id}
                        className="cursor-pointer hover:bg-accent/5 transition-colors"
                        onClick={() => navigate(`/startup/posts/${post._id}`)}
                      >
                        <TableCell className="font-medium text-muted-foreground">
                          {i + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {post.thumbnail && (
                              <img
                                src={`${BASE_URL}${post.thumbnail}`}
                                alt=""
                                className="h-8 w-8 rounded object-cover shrink-0"
                              />
                            )}
                            <span className="font-medium truncate max-w-[200px]">
                              {post.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <PostTypeBadge type={post.type} />
                        </TableCell>
                        <TableCell className="text-right">
                          {post.likes.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {post.comments.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className="border-accent/30 text-accent"
                          >
                            {post.engagement.toLocaleString()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* POSTING FREQUENCY */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-accent" />
                Posting Frequency
              </CardTitle>
              <CardDescription>How often you post content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <FrequencyRow
                label="Posts this week"
                value={analytics.postsThisWeek}
                icon={<CalendarDays className="h-4 w-4 text-accent" />}
              />
              <FrequencyRow
                label="Posts this month"
                value={analytics.postsThisMonth}
                icon={<FileText className="h-4 w-4 text-accent" />}
              />
              <FrequencyRow
                label="Avg posts / month"
                value={analytics.avgPostsPerMonth}
                icon={<TrendingUp className="h-4 w-4 text-accent" />}
              />
            </CardContent>
          </Card>
        </div>

        {/* Analytics Table */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Post Performance</CardTitle>
            <div className="w-[200px]">
                <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="latest">Latest Created</SelectItem>
                    <SelectItem value="most_viewed">Most Viewed</SelectItem>
                    <SelectItem value="most_engaged">Highest Engagement</SelectItem>
                </SelectContent>
                </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Post Title / Content</TableHead>
                    <TableHead>Published Date</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Unique Views</TableHead>
                    <TableHead className="text-right">Likes</TableHead>
                    <TableHead className="text-right">Comments</TableHead>
                    <TableHead className="text-right">Saves</TableHead>
                    <TableHead className="text-right">Engagement Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-48 mb-2" /><Skeleton className="h-3 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : analyticsPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        You haven't posted any content yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    analyticsPosts.map((post) => (
                      <TableRow key={post._id}>
                        <TableCell>
                          <div className="font-medium truncate max-w-[280px]" title={post.title || "Untitled"}>
                            {post.title || "Untitled Post"}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[280px]">
                            {post.description?.substring(0, 50)}...
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {post.createdAt ? format(new Date(post.createdAt), "MMM d, yyyy") : "-"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <div className="flex items-center justify-end gap-1">
                            <Eye className="h-3 w-3 text-muted-foreground" />
                            {post.analytics?.views_count || 0}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {post.analytics?.unique_views_count || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <ThumbsUp className="h-3 w-3 text-muted-foreground" />
                            {post.analytics?.likes_count || 0}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <MessageCircle className="h-3 w-3 text-muted-foreground" />
                            {post.analytics?.comments_count || 0}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Bookmark className="h-3 w-3 text-muted-foreground" />
                            {post.analytics?.saves_count || 0}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={post.analytics?.engagement_rate > 5 ? "default" : "secondary"}>
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {post.analytics?.engagement_rate?.toFixed(2)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={closeUpgradeModal} featureName={triggeredFeature || "Social Media Analysis"} />
    </StartupLayout>
  );
}

/* -------------------- SUB-COMPONENTS -------------------- */

function PostTypeBadge({ type }: { type: "photo" | "video" | "text" }) {
  const config = {
    photo: { icon: Image, label: "Photo", className: "border-accent/30 text-accent" },
    video: { icon: Video, label: "Video", className: "border-primary/30 text-primary" },
    text: { icon: FileText, label: "Text", className: "border-muted-foreground/30 text-muted-foreground" },
  };
  const { icon: Icon, label, className } = config[type];
  return (
    <Badge variant="outline" className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}


function FrequencyRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-xl font-bold">{value}</span>
    </div>
  );
}
