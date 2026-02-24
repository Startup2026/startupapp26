import { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Calendar,
  ExternalLink,
  Edit,
  Trash2,
  Search,
  X,
  Send,
  User,
  Loader2
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { CreatePostModal } from "@/components/startup/CreatePostModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea as UiTextarea } from "@/components/ui/textarea";

// Remove this debug log
// console.log("Textarea imported:", UiTextarea);

import { apiFetch, getStoredUser } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// --- Interfaces ---

interface Comment {
  _id: string;
  user: { 
    _id: string; 
    name?: string; 
    username?: string; 
    avatar?: string 
  };
  text: string;
}

interface FeedPost {
  id: string;
  type: "update" | "event" | "promotion";
  company: string;
  companyLogo: string;
  companyAvatar?: string;
  verified: boolean;
  postedAt: string;
  title: string;
  content: string;
  image?: string;
  video?: string;
  startupUserId?: string;
  link?: string;
  eventDate?: string;
  eventLocation?: string;
  likes: number;
  commentsCount: number;
  commentsList?: Comment[];
  isLiked: boolean;
  isSaved: boolean;
}

// --- Helpers ---

const getTypeBadge = (type: FeedPost["type"]) => {
  switch (type) {
    case "event":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Event</Badge>;
    case "promotion":
      return <Badge variant="secondary">Product Launch</Badge>;
    default:
      return <Badge variant="secondary">Update</Badge>;
  }
};

const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function StartupFeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const user = getStoredUser();
  const BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  
  // Edit Post State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<FeedPost | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const activePost = posts.find(p => p.id === activeCommentPostId);

  // --- 1. Fetch Feed ---
  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        let endpoint = `/recommendations/cold-start/posts?limit=5&page=${page}`;
        if (user?._id) {
          endpoint = `/recommendations/posts/${user._id}?limit=5&page=${page}&random=true`;
        }

        const res = await apiFetch(endpoint);

        if (res.success && Array.isArray(res.data)) {
          const transformedData = res.data.map((item: any) => transformFeedItem(item));
          if (transformedData.length === 0) {
            setHasMore(false);
          } else {
            setPosts(prev => {
                const newPosts = page === 1 ? transformedData : [...prev, ...transformedData];
                // Use a Map to ensure uniqueness by ID
                const uniquePostsMap = new Map<string, FeedPost>();
                newPosts.forEach(post => {
                  if (post.id) uniquePostsMap.set(post.id, post);
                });
                return Array.from(uniquePostsMap.values());
            });
          }
        } else {
          console.error("Failed to load feed:", res.message);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setLoading(false);
        setIsInitialLoading(false);
      }
    };

    fetchFeed();
  }, [page, user?._id]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading]);

  // --- Transform Data ---
  const transformFeedItem = (item: any): FeedPost => {
    const realId = item.contentId || item.postId || item._id;
    let postType: FeedPost['type'] = "update";
    const lowerTitle = (item.title || "").toLowerCase();
    if (lowerTitle.includes("event") || lowerTitle.includes("webinar")) postType = "event";
    else if (lowerTitle.includes("launch") || lowerTitle.includes("product")) postType = "promotion";

    return {
      id: realId,
      type: postType,
      company: item.startupid?.startupName || "Startup",
      companyLogo: (item.startupid?.startupName || "S").charAt(0).toUpperCase(),
      companyAvatar: item.startupid?.profilepic ? `${BASE_URL}${item.startupid.profilepic}` : undefined,
      verified: item.startupid?.verified || false,
      postedAt: formatTimeAgo(item.createdAt),
      title: item.title || "New Update",
      video: item.media?.video || undefined,
      startupUserId: item.startupid?.userId,
      content: item.description || "",
      image: item.media?.photo || undefined,
      link: item.link,
      likes: item.likes || 0,
      commentsCount: item.comments?.length || item.commentsCount || 0,
      commentsList: Array.isArray(item.comments) ? item.comments : [],
      isLiked: item.isLiked || false,
      isSaved: item.isSaved || false,
    };
  };

  const handleAuthError = () => {
    toast({ 
      title: "Session Expired", 
      description: "Please login again to continue.", 
      variant: "destructive" 
    });
  };

  // --- Share Logic ---
  const handleShare = async (post: FeedPost) => {
    const shareData = {
      title: post.title,
      text: `${post.company} posted: ${post.title}`,
      url: post.link || window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({ title: "Link copied to clipboard!" });
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // --- 2. Like / Unlike ---
  const toggleLike = async (post: FeedPost) => {
    if (!user?._id) {
      toast({ title: "Login Required", description: "Please login to like posts.", variant: "destructive" });
      return;
    }

    const previousState = [...posts];
    const isLiking = !post.isLiked;

    setPosts(posts.map((p) => 
      p.id === post.id 
        ? { ...p, isLiked: isLiking, likes: isLiking ? p.likes + 1 : p.likes - 1 } 
        : p
    ));

    try {
      const endpoint = isLiking ? `/like/${post.id}` : `/unlike/${post.id}`;
      const res = await apiFetch(endpoint, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id })
      });

      if (res.status === 401) {
        setPosts(previousState);
        handleAuthError();
        return;
      }

      if (res.error) throw new Error(res.error);
      
      if (typeof res.likes === 'number') {
        setPosts(currentPosts => currentPosts.map(p => 
          p.id === post.id ? { ...p, likes: res.likes } : p
        ));
      }
    } catch (error) {
      console.error("Like error:", error);
      setPosts(previousState);
      toast({ title: "Error", description: "Action failed", variant: "destructive" });
    }
  };

  // --- 3. Save / Unsave ---
  const toggleSave = async (post: FeedPost) => {
    if (!user?._id) {
      toast({ title: "Login Required", description: "Please login to save posts.", variant: "destructive" });
      return;
    }

    setPosts(posts.map((p) => p.id === post.id ? { ...p, isSaved: !p.isSaved } : p));

    try {
       const endpoint = `/sav-posts/${post.id}`;
       const method = post.isSaved ? "DELETE" : "POST";
       const body = JSON.stringify({ studentId: user._id, postId: post.id });
       
       const res = await apiFetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body
       });

       if (res.status === 401) {
          handleAuthError();
          return;
       }

       if (res.success === false) throw new Error(res.error);

    } catch (error) {
       console.error("Save error", error);
       setPosts(posts.map((p) => p.id === post.id ? { ...p, isSaved: post.isSaved } : p));
       toast({ title: "Error", description: "Could not save post", variant: "destructive" });
    }
  };

  // --- 4. Comment Handlers ---
  
  const openComments = (postId: string) => {
    setActiveCommentPostId(postId);
    setCommentText("");
  };

  const submitComment = async (post: FeedPost) => {
    if (!user?._id) {
      toast({ title: "Login Required", variant: "destructive" });
      return;
    }
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
        const res = await apiFetch(`/comment/${post.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: commentText, userId: user._id })
        });

        if (res.status === 401) {
            handleAuthError();
            return;
        }

        if (res.error) throw new Error(res.error || res.message);

        const updatedComments = res.comments || []; 
        
        setPosts(posts.map(p => 
            p.id === post.id 
            ? { 
                ...p, 
                commentsCount: updatedComments.length || p.commentsCount + 1,
                commentsList: updatedComments
              } 
            : p
        ));
        
        toast({ title: "Comment added" });
        setCommentText("");
    } catch (error) {
        console.error("Comment error:", error);
        toast({ title: "Error", description: "Failed to add comment", variant: "destructive" });
    } finally {
        setIsSubmittingComment(false);
    }
  };

  const deleteComment = async (post: FeedPost, commentId: string) => {
    if (!user?._id) return;

    try {
      const res = await apiFetch(`/comment/${post.id}/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id })
      });

      if (res.status === 401) {
        handleAuthError();
        return;
      }

      if (res.error) throw new Error(res.error);

      setPosts(posts.map(p => 
        p.id === post.id 
        ? {
            ...p,
            commentsList: p.commentsList?.filter(c => c._id !== commentId),
            commentsCount: Math.max(0, p.commentsCount - 1)
          }
        : p
      ));
      toast({ title: "Comment deleted" });
    } catch (error) {
      console.error("Delete comment error:", error);
      toast({ title: "Error", description: "Could not delete comment", variant: "destructive" });
    }
  };
  
  const handleEdit = (post: FeedPost) => {
    setPostToEdit(post);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (post: FeedPost) => {
    if (!user?._id) return;
    try {
      const res = await apiFetch("/posts/delete-post/" + post.id, { method: "DELETE" });
      if (res.status === 401) {
        handleAuthError();
        return;
      }
      if (res.success) {
        setPosts(posts.filter(p => p.id !== post.id));
        toast({ title: "Post deleted" });
      } else {
        throw new Error(res.error || "Failed to delete");
      }
    } catch (err) {
       console.error(err);
       toast({ title: "Error", description: "Could not delete post", variant: "destructive" });
    }
  };

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.company.toLowerCase().includes(query)
    );
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

          {/* Search Box Section */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts by title, company or content..."
              className="pl-10 h-12 bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {isInitialLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="h-48" />
                </Card>
              ))
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-xl">
                          <AvatarImage src={post.companyAvatar} alt={post.company} className="object-cover" />
                          <AvatarFallback className="bg-accent/10 text-accent text-xl font-bold">
                            {post.companyLogo}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{post.company}</h3>
                            {post.verified && (
                              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-blue-100 text-blue-700">✓</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{post.postedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeBadge(post.type)}
                        {user?._id === post.startupUserId && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(post)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(post)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">{post.title}</h4>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </div>

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

                    {post.image && (
                      <div className="rounded-lg overflow-hidden border bg-muted/20">
                        <img
                          src={`${BASE_URL}${post.image}`}
                          alt={post.title}
                          className="w-full h-auto max-h-[400px] object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                    )}
                    
                    {post.video && (
                       <div className="rounded-lg overflow-hidden border bg-black aspect-video relative">
                          <video 
                             controls
                             className="w-full h-full"
                             src={`${BASE_URL}${post.video}`}
                          >
                             Your browser does not support the video tag.
                          </video>
                       </div>
                    )}

                    {post.link && (
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary font-medium hover:underline p-3 bg-primary/5 rounded-md border border-primary/10 transition-colors hover:bg-primary/10"
                      >
                        <ExternalLink className="h-4 w-4" /> Visit Link
                      </a>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(post)}
                          className={post.isLiked ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "hover:bg-accent/10"}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                          {post.likes}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-accent/10"
                          onClick={() => openComments(post.id)}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.commentsCount}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-accent/10"
                          onClick={() => handleShare(post)}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSave(post)}
                        className={post.isSaved ? "text-primary" : ""}
                      >
                        <Bookmark className={`h-4 w-4 ${post.isSaved ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              !isInitialLoading && (
              <Card className="p-12 text-center border-dashed">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No results found</h3>
                  <p className="text-muted-foreground max-w-sm">
                    {searchQuery ? `We couldn't find anything matching "${searchQuery}"` : "Follow more startups to see updates."}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
                  )}
                </div>
              </Card>
              )
            )}
            
            {loading && hasMore && (
               <div className="flex justify-center p-8 w-full">
                  <Loader2 className="animate-spin h-6 w-6 text-primary" />
               </div>
            )}
            
            {!loading && hasMore && posts.length > 0 && (
               <div ref={observerTarget} className="h-10 w-full flex justify-center p-4">
               </div>
            )}
          </div>
        </div>

        {/* COMMENTS MODAL */}
        <Dialog 
          open={!!activeCommentPostId} 
          onOpenChange={(open) => !open && setActiveCommentPostId(null)}
        >
          <DialogContent className="sm:max-w-lg h-[80vh] flex flex-col p-0 gap-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>Comments ({activePost?.commentsCount || 0})</DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="flex-1 p-6 pt-2">
              {activePost?.commentsList && activePost.commentsList.length > 0 ? (
                <div className="space-y-4">
                  {activePost.commentsList.map((comment) => (
                    <div key={comment._id} className="flex gap-3 text-sm group">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-secondary/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs opacity-70">
                            {typeof comment.user === 'object' 
                              ? (comment.user.username || comment.user.name || 'User') 
                              : 'User'}
                          </span>
                          
                          {user && (typeof comment.user === 'string' 
                              ? comment.user === user._id 
                              : comment.user?._id === user._id
                          ) && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                              onClick={() => activePost && deleteComment(activePost, comment._id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-foreground leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 gap-2">
                  <MessageCircle className="h-8 w-8" />
                  <p>No comments yet. Be the first!</p>
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t bg-background mt-auto">
              <div className="flex gap-2">
                <UiTextarea 
                  placeholder="Write a comment..." 
                  className="min-h-[40px] max-h-[100px] resize-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button 
                  size="icon" 
                  onClick={() => activePost && submitComment(activePost)} 
                  disabled={isSubmittingComment || !commentText.trim()}
                  className="mt-auto shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      <CreatePostModal 
        open={isEditModalOpen} 
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setPostToEdit(null);
        }}
        onSuccess={() => {
          // Refresh posts locally without reloading
          setPage(1);
          setPosts([]);
          setHasMore(true);
          setLoading(true);
          // The useEffect will trigger automatically since page is reset or we can manually refetch if needed
          // But resetting page to 1 will trigger the main useEffect
        }}
        initialData={postToEdit ? {
          id: postToEdit.id,
          title: postToEdit.title,
          description: postToEdit.content
        } : undefined}
      />
      </div>
    </StudentLayout>
  );
}