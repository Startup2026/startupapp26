import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  TrendingUp,
  ArrowLeft,
  Clock,
  CalendarDays,
  Image,
  Video,
  FileText,
  User,
  Loader2,
} from "lucide-react";
import { postService, Post } from "@/services/postService";
import { API_BASE_URL } from "@/lib/api";
import { StartupLayout } from "@/components/layouts/StartupLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function getPostType(post: Post): "photo" | "video" | "text" {
  if (post.media?.video) return "video";
  if (post.media?.photo) return "photo";
  return "text";
}

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        setLoading(true);
        const result = await postService.getPostById(postId);
        if (result.success && result.data) {
          setPost(result.data);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
        <StartupLayout>
            <div className="flex bg-background h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
        </StartupLayout>
    )
  }

  if (!post) {
    return (
      <StartupLayout>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <p className="text-lg text-muted-foreground">Post not found</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </StartupLayout>
    );
  }

  const type = getPostType(post);
  const engagement = (post.likes?.length || 0) + (post.comments?.length || 0);
  const created = new Date(post.createdAt);
  const updated = post.updatedAt ? new Date(post.updatedAt) : created;

  return (
    <StartupLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Analysis
        </Button>

        {/* Title & Type */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <PostTypeBadge type={type} />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {created.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              {" at "}
              {created.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {post.updatedAt !== post.createdAt && (
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                Updated{" "}
                {updated.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Media */}
        {post.media?.photo && (
          <Card className="overflow-hidden">
            <img
              src={`${BASE_URL}${post.media.photo}`}
              alt={post.title || "Post media"}
              className="w-full object-cover max-h-96"
            />
          </Card>
        )}
        {post.media?.video && (
          <Card>
            <CardContent className="flex items-center justify-center py-16 gap-3">
              <Video className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="font-medium">Video Content</p>
                <p className="text-sm text-muted-foreground truncate max-w-xs">
                  {post.media.video}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {post.description}
            </p>
          </CardContent>
        </Card>

        {/* Engagement Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="h-5 w-5 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold">{post.likes.length}</p>
              <p className="text-xs text-muted-foreground">Likes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-5 w-5 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">{post.comments.length}</p>
              <p className="text-xs text-muted-foreground">Comments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{engagement}</p>
              <p className="text-xs text-muted-foreground">Engagement</p>
            </CardContent>
          </Card>
        </div>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-accent" />
              Comments ({post.comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {post.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No comments yet
              </p>
            ) : (
              <div className="space-y-3">
                {post.comments.map((c, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs">
                          <User className="h-3.5 w-3.5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium truncate">
                            User
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {new Date(c.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {c.text}
                        </p>
                      </div>
                    </div>
                    {i < post.comments.length - 1 && (
                      <Separator className="my-1" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StartupLayout>
  );
}

/* ---- Sub-components ---- */

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
