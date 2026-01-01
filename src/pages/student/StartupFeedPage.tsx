import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Calendar,
  Megaphone,
  Briefcase,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeedPost {
  id: number;
  type: "update" | "event" | "promotion" | "hiring";
  company: string;
  companyLogo: string;
  verified: boolean;
  postedAt: string;
  title: string;
  content: string;
  image?: string;
  link?: string;
  eventDate?: string;
  eventLocation?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

const feedPosts: FeedPost[] = [
  {
    id: 1,
    type: "update",
    company: "TechFlow AI",
    companyLogo: "TF",
    verified: true,
    postedAt: "2 hours ago",
    title: "🚀 We just raised $10M Series A!",
    content: "Excited to announce that we've successfully closed our Series A round led by Sequoia Capital! This funding will help us scale our AI automation platform and expand our team. We're hiring across all departments - check out our open positions!",
    likes: 234,
    comments: 45,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 2,
    type: "event",
    company: "GreenScale",
    companyLogo: "GS",
    verified: true,
    postedAt: "5 hours ago",
    title: "Join us at CleanTech Summit 2026",
    content: "We'll be presenting our latest sustainable energy solutions at the CleanTech Summit. Join our CEO for a keynote on 'The Future of Green Energy'. Free passes available for students!",
    eventDate: "Jan 25, 2026",
    eventLocation: "Bangalore International Centre",
    link: "https://cleantechsummit.com",
    likes: 156,
    comments: 23,
    isLiked: true,
    isSaved: true,
  },
  {
    id: 3,
    type: "hiring",
    company: "FinNext",
    companyLogo: "FN",
    verified: true,
    postedAt: "1 day ago",
    title: "We're hiring! Join our growing team",
    content: "Looking for passionate individuals to join our fintech revolution. We have open positions in Engineering, Product, and Design. Remote-first culture, competitive salary, and amazing perks!",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    likes: 312,
    comments: 67,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 4,
    type: "promotion",
    company: "CloudNine",
    companyLogo: "CN",
    verified: true,
    postedAt: "1 day ago",
    title: "🎉 Product Launch: CloudNine 2.0",
    content: "After months of hard work, we're thrilled to launch CloudNine 2.0 - the most powerful cloud infrastructure platform for startups. Get 3 months free when you sign up this month!",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    link: "https://cloudnine.io/2.0",
    likes: 189,
    comments: 34,
    isLiked: false,
    isSaved: true,
  },
  {
    id: 5,
    type: "update",
    company: "DesignHub",
    companyLogo: "DH",
    verified: true,
    postedAt: "2 days ago",
    title: "Building in public: Our journey to 100K users",
    content: "We hit a major milestone this week - 100,000 designers are now using DesignHub! Here's a thread on what we learned building this product over the last 18 months...",
    likes: 445,
    comments: 89,
    isLiked: true,
    isSaved: false,
  },
  {
    id: 6,
    type: "event",
    company: "BrandBoost",
    companyLogo: "BB",
    verified: false,
    postedAt: "3 days ago",
    title: "Free Workshop: Growth Marketing 101",
    content: "Join our Head of Marketing for a free workshop on growth marketing strategies for early-stage startups. Perfect for students looking to break into marketing!",
    eventDate: "Jan 20, 2026",
    eventLocation: "Online (Zoom)",
    likes: 78,
    comments: 12,
    isLiked: false,
    isSaved: false,
  },
];

const getTypeIcon = (type: FeedPost["type"]) => {
  switch (type) {
    case "event":
      return <Calendar className="h-4 w-4" />;
    case "promotion":
      return <Megaphone className="h-4 w-4" />;
    case "hiring":
      return <Briefcase className="h-4 w-4" />;
    default:
      return <TrendingUp className="h-4 w-4" />;
  }
};

const getTypeBadge = (type: FeedPost["type"]) => {
  switch (type) {
    case "event":
      return <Badge variant="accent">Event</Badge>;
    case "promotion":
      return <Badge variant="secondary">Product Launch</Badge>;
    case "hiring":
      return <Badge variant="success">Hiring</Badge>;
    default:
      return <Badge variant="muted">Update</Badge>;
  }
};

export default function StartupFeedPage() {
  const [posts, setPosts] = useState(feedPosts);
  const [activeTab, setActiveTab] = useState("all");

  const toggleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const toggleSave = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const filteredPosts = posts.filter((post) => {
    if (activeTab === "all") return true;
    return post.type === activeTab;
  });

  return (
    <StudentLayout>
      <div className="p-6 lg:p-8 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Startup Feed</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with the latest from startups you follow
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="w-full justify-start h-auto p-1 bg-secondary">
              <TabsTrigger value="all" className="gap-2">
                All Posts
              </TabsTrigger>
              <TabsTrigger value="update" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Updates
              </TabsTrigger>
              <TabsTrigger value="event" className="gap-2">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="hiring" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Hiring
              </TabsTrigger>
              <TabsTrigger value="promotion" className="gap-2">
                <Megaphone className="h-4 w-4" />
                Launches
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Feed */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center font-bold text-accent">
                        {post.companyLogo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{post.company}</h3>
                          {post.verified && (
                            <Badge variant="accent" className="h-5 px-1.5 text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{post.postedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(post.type)}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">{post.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                  </div>

                  {/* Event details */}
                  {post.type === "event" && post.eventDate && (
                    <div className="flex flex-wrap gap-4 p-4 bg-secondary rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-accent" />
                        <span className="font-medium">{post.eventDate}</span>
                      </div>
                      {post.eventLocation && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>📍 {post.eventLocation}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Image */}
                  {post.image && (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  {/* Link */}
                  {post.link && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {post.link.replace("https://", "")}
                    </a>
                  )}

                  <Separator />

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className={post.isLiked ? "text-destructive" : ""}
                      >
                        <Heart
                          className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-current" : ""}`}
                        />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSave(post.id)}
                    >
                      <Bookmark
                        className={`h-4 w-4 ${post.isSaved ? "fill-current text-accent" : ""}`}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No posts found in this category.</p>
            </Card>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
