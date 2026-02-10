import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";
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

/* ---- Mock data (same source, will be replaced by API) ---- */
const mockPosts = [
  {
    _id: "1",
    title: "Excited to announce our Series A!",
    description:
      "We just closed our Series A funding round. It's been an incredible journey building this product, and we're grateful for the support of our investors, team, and community. This funding will help us scale to new markets and double our engineering team.",
    media: { photo: "https://picsum.photos/seed/post1/800/400" },
    likes: Array(124).fill("userId"),
    comments: [
      { user: "u1", text: "Congrats! Well deserved 🎉", createdAt: new Date("2026-02-08T12:00:00Z") },
      { user: "u2", text: "Amazing milestone!", createdAt: new Date("2026-02-08T13:30:00Z") },
      { user: "u3", text: "Looking forward to seeing what's next", createdAt: new Date("2026-02-08T14:00:00Z") },
      { user: "u4", text: "Great team, great product!", createdAt: new Date("2026-02-09T09:00:00Z") },
    ],
    createdAt: "2026-02-08T10:00:00Z",
    updatedAt: "2026-02-08T10:00:00Z",
  },
  {
    _id: "2",
    title: "Behind the scenes of our product sprint",
    description:
      "Take a look at how our engineering team works through a two-week sprint cycle. From ideation to deployment, every step is carefully planned and executed with precision.",
    media: { video: "https://example.com/video.mp4" },
    likes: Array(98).fill("userId"),
    comments: [
      { user: "u1", text: "Great insight into the process!", createdAt: new Date("2026-02-05T15:00:00Z") },
      { user: "u2", text: "Would love to join your team", createdAt: new Date("2026-02-05T16:30:00Z") },
    ],
    createdAt: "2026-02-05T14:30:00Z",
    updatedAt: "2026-02-05T14:30:00Z",
  },
  {
    _id: "3",
    title: "Meet our new CTO",
    description:
      "We're thrilled to welcome our new CTO who brings 15 years of experience building scalable systems at top tech companies.",
    media: { photo: "https://picsum.photos/seed/post3/800/400" },
    likes: Array(210).fill("userId"),
    comments: [
      { user: "u1", text: "Welcome aboard!", createdAt: new Date("2026-02-01T10:00:00Z") },
      { user: "u2", text: "Strong hire 💪", createdAt: new Date("2026-02-01T11:00:00Z") },
      { user: "u3", text: "Excited for the future!", createdAt: new Date("2026-02-01T12:00:00Z") },
    ],
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-02-01T09:00:00Z",
  },
  {
    _id: "4",
    title: "Our journey to 10k users",
    description: "A milestone we're proud of. Here's how we got here and what we learned along the way.",
    media: { photo: "https://picsum.photos/seed/post4/800/400" },
    likes: Array(175).fill("userId"),
    comments: [
      { user: "u1", text: "Amazing growth!", createdAt: new Date("2026-01-28T12:00:00Z") },
    ],
    createdAt: "2026-01-28T11:00:00Z",
    updatedAt: "2026-01-28T11:00:00Z",
  },
  {
    _id: "5",
    title: "Team offsite recap",
    description: "What a week it has been. Our team gathered for a productive offsite filled with brainstorming and bonding.",
    media: { video: "https://example.com/video2.mp4" },
    likes: Array(67).fill("userId"),
    comments: [
      { user: "u1", text: "Love it!", createdAt: new Date("2026-01-20T17:00:00Z") },
    ],
    createdAt: "2026-01-20T16:00:00Z",
    updatedAt: "2026-01-20T16:00:00Z",
  },
  {
    _id: "6",
    title: "Product update: Dark mode is here",
    description: "We listened to your feedback and shipped dark mode. Try it out and let us know what you think!",
    media: { photo: "https://picsum.photos/seed/post6/800/400" },
    likes: Array(156).fill("userId"),
    comments: [
      { user: "u1", text: "Finally!", createdAt: new Date("2026-01-15T09:00:00Z") },
      { user: "u2", text: "Looks gorgeous", createdAt: new Date("2026-01-15T10:00:00Z") },
    ],
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-01-15T08:00:00Z",
  },
  {
    _id: "7",
    title: "Why we chose React Native",
    description: "A deep dive into our tech stack decisions and why React Native was the right call for our mobile strategy.",
    media: {},
    likes: Array(89).fill("userId"),
    comments: [
      { user: "u1", text: "Interesting read!", createdAt: new Date("2026-01-10T14:00:00Z") },
    ],
    createdAt: "2026-01-10T13:00:00Z",
    updatedAt: "2026-01-10T13:00:00Z",
  },
  {
    _id: "8",
    title: "Hiring: We're looking for designers",
    description: "Join our growing design team. We're looking for passionate product designers who love crafting intuitive user experiences.",
    media: { photo: "https://picsum.photos/seed/post8/800/400" },
    likes: Array(45).fill("userId"),
    comments: [
      { user: "u1", text: "Shared with my network!", createdAt: new Date("2026-01-05T11:00:00Z") },
    ],
    createdAt: "2026-01-05T10:30:00Z",
    updatedAt: "2026-01-05T10:30:00Z",
  },
];

function getPostType(post: (typeof mockPosts)[0]): "photo" | "video" | "text" {
  if (post.media?.video) return "video";
  if (post.media?.photo) return "photo";
  return "text";
}

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = mockPosts.find((p) => p._id === postId);

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
  const engagement = post.likes.length + post.comments.length;
  const created = new Date(post.createdAt);
  const updated = new Date(post.updatedAt);

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
              src={post.media.photo}
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
