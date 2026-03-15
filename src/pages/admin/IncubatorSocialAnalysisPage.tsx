import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  ArrowLeft
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Post } from "@/services/feedService";
import { format } from "date-fns";
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

import { AdminLayout } from "@/components/layouts/AdminLayout";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/* -------------------- HELPERS -------------------- */
// Same helpers as SocialMediaAnalysisPage
const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};

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

type IncubatorFeedItem = {
  _id: string;
  title?: string;
  content?: string;
  date?: string;
  type?: string;
  media?: {
    photo?: string;
    video?: string;
  };
  analytics?: {
    views_count?: number;
    unique_views_count?: number;
    likes_count?: number;
    comments_count?: number;
    saves_count?: number;
    shares_count?: number;
    engagement_rate?: number;
  };
};

export default function IncubatorSocialAnalysisPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("latest");

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<IncubatorFeedItem[]>("/incubator/feed");
      if (res.success && res.data) {
        const normalizedPosts: Post[] = res.data
          .filter((item) => item.type === "post")
          .map((item) => ({
            _id: item._id,
            title: item.title || "Untitled Post",
            description: item.content || "",
            media: item.media,
            createdAt: item.date || new Date().toISOString(),
            analytics: {
              views_count: item.analytics?.views_count || 0,
              unique_views_count: item.analytics?.unique_views_count || 0,
              likes_count: item.analytics?.likes_count || 0,
              comments_count: item.analytics?.comments_count || 0,
              saves_count: item.analytics?.saves_count || 0,
              shares_count: item.analytics?.shares_count || 0,
              engagement_rate: item.analytics?.engagement_rate || 0,
            },
          }));

        const sortedPosts = [...normalizedPosts].sort((a, b) => {
          if (filter === "most_viewed") {
            return (b.analytics?.views_count || 0) - (a.analytics?.views_count || 0);
          }
          if (filter === "most_engaged") {
            const aEngagement = (a.analytics?.likes_count || 0) + (a.analytics?.comments_count || 0);
            const bEngagement = (b.analytics?.likes_count || 0) + (b.analytics?.comments_count || 0);
            return bEngagement - aEngagement;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setPosts(sortedPosts);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  const analytics = useMemo(() => {
    const totalPosts = posts.length;
    // Use the populated analytics object
    const totalLikes = posts.reduce((sum, p) => sum + (p.analytics?.likes_count || 0), 0);
    const totalComments = posts.reduce((sum, p) => sum + (p.analytics?.comments_count || 0), 0);
    // Engagement Rate is avg of per-post engagement rates OR total engagement / total views?
    // Let's use average of per-post engagement rates for "Account Engagement" often, OR (Total Engagement / Total Posts)
    // The previous page calculated `(totalLikes + totalComments) / totalPosts`.
    const avgEngagement = totalPosts > 0 ? ((totalLikes + totalComments) / totalPosts).toFixed(1) : "0";

    // Engagement trend by week
    const weekMap = new Map<string, number>();
    posts.forEach((p) => {
      if (!p.createdAt) return;
      const week = getWeekLabel(p.createdAt);
      const engagement = (p.analytics?.likes_count || 0) + (p.analytics?.comments_count || 0);
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
        likes: p.analytics?.likes_count || 0,
        comments: p.analytics?.comments_count || 0,
        engagement: (p.analytics?.likes_count || 0) + (p.analytics?.comments_count || 0),
        type: getPostType(p),
        thumbnail: p.media?.photo,
      }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 5); // Top 5

    // Post type performance
    const typeMap: Record<string, { total: number; count: number }> = {};
    posts.forEach((p) => {
      const type = getPostType(p);
      if (!typeMap[type]) typeMap[type] = { total: 0, count: 0 };
      typeMap[type].total += (p.analytics?.likes_count || 0) + (p.analytics?.comments_count || 0);
      typeMap[type].count += 1;
    });
    const postTypePerformance = Object.entries(typeMap).map(([type, data]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      avgEngagement: Math.round(data.total / data.count),
    }));

    // Posting frequency
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // createdAt might be string or Date depending on interface but usually string from JSON
    const postsThisMonth = posts.filter((p) => p.createdAt && new Date(p.createdAt) >= thisMonthStart).length;
    const postsThisWeek = posts.filter((p) => p.createdAt && new Date(p.createdAt) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)).length;

    // Avg posts per month
    const dates = posts.length > 0 ? posts.map((p) => new Date(p.createdAt || new Date()).getTime()) : [now.getTime()];
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

  if (loading && posts.length === 0) {
    return (
      <AdminLayout>
          <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <span className="ml-3 text-muted-foreground font-medium">Analyzing your social presence...</span>
          </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: "Total Posts",
      value: analytics.totalPosts,
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      desc: "All time posts",
    },
    {
      title: "Avg. Engagement",
      value: analytics.avgEngagement,
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      desc: "Likes + Comments / Post",
    },
    {
      title: "Total Likes",
      value: analytics.totalLikes,
      icon: <Heart className="h-4 w-4 text-muted-foreground" />,
      desc: "Across all posts",
    },
    {
      title: "Total Comments",
      value: analytics.totalComments,
      icon: <MessageCircle className="h-4 w-4 text-muted-foreground" />,
      desc: "Community discussions",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
            <Link to="/incubator/dashboard" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2">
                <ArrowLeft className="h-3 w-3" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent bg-300% animate-gradient">
            Social Media Analysis
            </h1>
            <p className="text-muted-foreground text-lg">
            Detailed insights into your content performance and audience engagement.
            </p>
        </div>

        {/* OVERVIEW CARDS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="overflow-hidden border-l-4 border-l-primary/50 hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CHARTS ROW 1 */}
        <div className="grid gap-4 md:grid-cols-7">
          {/* ENGAGEMENT OVER TIME */}
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Engagement Trends</CardTitle>
              <CardDescription>Weekly likes + comments performance</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.engagementTrend}>
                    <defs>
                      <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="week" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`} 
                    />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Area 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorEngagement)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* TOP POSTS */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>Highest engagement content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topPosts.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">No posts yet</div>
                ) : (
                    analytics.topPosts.map((post) => (
                    <div key={post._id} className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-md bg-muted overflow-hidden flex-shrink-0">
                        {post.thumbnail ? (
                            <img src={post.thumbnail} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                <FileText className="h-5 w-5 text-gray-400" />
                            </div>
                        )}
                        </div>
                        <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" title={post.title}>{post.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" /> {post.likes}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" /> {post.comments}
                            </span>
                        </div>
                        </div>
                        <PostTypeBadge type={post.type} />
                    </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CHARTS ROW 2 */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* FORMAT PERFORMANCE */}
          <Card>
            <CardHeader>
              <CardTitle>Format Performance</CardTitle>
              <CardDescription>Average engagement by post type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.postTypePerformance} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="type" 
                      type="category" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      width={60}
                    />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={TOOLTIP_STYLE} />
                    <Bar 
                      dataKey="avgEngagement" 
                      fill="hsl(var(--accent))" 
                      radius={[0, 4, 4, 0]} 
                      barSize={30} 
                    />
                  </BarChart>
                </ResponsiveContainer>
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
                  {loading ? (
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
                  ) : posts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        You haven't posted any content yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    posts.map((post) => (
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
    </AdminLayout>
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
