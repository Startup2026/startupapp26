import { useMemo } from "react";
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
} from "lucide-react";
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

/* -------------------- MOCK DATA (matches post schema) -------------------- */

const mockPosts = [
  {
    _id: "1",
    title: "Excited to announce our Series A!",
    description: "We just closed our Series A funding round...",
    media: { photo: "https://picsum.photos/seed/post1/400/300" },
    likes: Array(124).fill("userId"),
    comments: Array(38).fill({ user: "userId", text: "Congrats!", createdAt: new Date() }),
    createdAt: "2026-02-08T10:00:00Z",
  },
  {
    _id: "2",
    title: "Behind the scenes of our product sprint",
    description: "Take a look at how our engineering team works...",
    media: { video: "https://example.com/video.mp4" },
    likes: Array(98).fill("userId"),
    comments: Array(27).fill({ user: "userId", text: "Great!", createdAt: new Date() }),
    createdAt: "2026-02-05T14:30:00Z",
  },
  {
    _id: "3",
    title: "Meet our new CTO",
    description: "We're thrilled to welcome...",
    media: { photo: "https://picsum.photos/seed/post3/400/300" },
    likes: Array(210).fill("userId"),
    comments: Array(56).fill({ user: "userId", text: "Welcome!", createdAt: new Date() }),
    createdAt: "2026-02-01T09:00:00Z",
  },
  {
    _id: "4",
    title: "Our journey to 10k users",
    description: "A milestone we're proud of...",
    media: { photo: "https://picsum.photos/seed/post4/400/300" },
    likes: Array(175).fill("userId"),
    comments: Array(44).fill({ user: "userId", text: "Amazing!", createdAt: new Date() }),
    createdAt: "2026-01-28T11:00:00Z",
  },
  {
    _id: "5",
    title: "Team offsite recap",
    description: "What a week it has been...",
    media: { video: "https://example.com/video2.mp4" },
    likes: Array(67).fill("userId"),
    comments: Array(19).fill({ user: "userId", text: "Love it!", createdAt: new Date() }),
    createdAt: "2026-01-20T16:00:00Z",
  },
  {
    _id: "6",
    title: "Product update: Dark mode is here",
    description: "We listened to your feedback...",
    media: { photo: "https://picsum.photos/seed/post6/400/300" },
    likes: Array(156).fill("userId"),
    comments: Array(62).fill({ user: "userId", text: "Finally!", createdAt: new Date() }),
    createdAt: "2026-01-15T08:00:00Z",
  },
  {
    _id: "7",
    title: "Why we chose React Native",
    description: "A deep dive into our tech stack decisions...",
    media: {},
    likes: Array(89).fill("userId"),
    comments: Array(31).fill({ user: "userId", text: "Interesting!", createdAt: new Date() }),
    createdAt: "2026-01-10T13:00:00Z",
  },
  {
    _id: "8",
    title: "Hiring: We're looking for designers",
    description: "Join our growing design team...",
    media: { photo: "https://picsum.photos/seed/post8/400/300" },
    likes: Array(45).fill("userId"),
    comments: Array(12).fill({ user: "userId", text: "Shared!", createdAt: new Date() }),
    createdAt: "2026-01-05T10:30:00Z",
  },
];

/* -------------------- HELPERS -------------------- */

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};

function getPostType(post: typeof mockPosts[0]): "photo" | "video" | "text" {
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
  const navigate = useNavigate();

  const analytics = useMemo(() => {
    const totalPosts = mockPosts.length;
    const totalLikes = mockPosts.reduce((sum, p) => sum + p.likes.length, 0);
    const totalComments = mockPosts.reduce((sum, p) => sum + p.comments.length, 0);
    const avgEngagement = totalPosts > 0 ? ((totalLikes + totalComments) / totalPosts).toFixed(1) : "0";

    // Engagement trend by week
    const weekMap = new Map<string, number>();
    mockPosts.forEach((p) => {
      const week = getWeekLabel(p.createdAt);
      const engagement = p.likes.length + p.comments.length;
      weekMap.set(week, (weekMap.get(week) || 0) + engagement);
    });
    const engagementTrend = Array.from(weekMap.entries())
      .map(([week, engagement]) => ({ week, engagement }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());

    // Top performing posts
    const topPosts = [...mockPosts]
      .map((p) => ({
        _id: p._id,
        title: p.title,
        likes: p.likes.length,
        comments: p.comments.length,
        engagement: p.likes.length + p.comments.length,
        type: getPostType(p),
        thumbnail: p.media?.photo,
      }))
      .sort((a, b) => b.engagement - a.engagement);

    // Post type performance
    const typeMap: Record<string, { total: number; count: number }> = {};
    mockPosts.forEach((p) => {
      const type = getPostType(p);
      if (!typeMap[type]) typeMap[type] = { total: 0, count: 0 };
      typeMap[type].total += p.likes.length + p.comments.length;
      typeMap[type].count += 1;
    });
    const postTypePerformance = Object.entries(typeMap).map(([type, data]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      avgEngagement: Math.round(data.total / data.count),
    }));

    // Posting frequency
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const postsThisMonth = mockPosts.filter((p) => new Date(p.createdAt) >= thisMonthStart).length;
    const postsThisWeek = mockPosts.filter((p) => new Date(p.createdAt) >= oneWeekAgo).length;

    // Avg posts per month (based on data range)
    const dates = mockPosts.map((p) => new Date(p.createdAt).getTime());
    const rangeMonths = Math.max(1, Math.ceil((Math.max(...dates) - Math.min(...dates)) / (30 * 24 * 60 * 60 * 1000)));
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
  }, []);

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
                                src={post.thumbnail}
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
      </div>
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
