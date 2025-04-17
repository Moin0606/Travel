import React from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTravelPostStore } from "../../store/useTravelPostStore";
import PostDetails from "./PostDetails";

interface Post {
  _id: string;
  creatorId: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  destination: string;
  travelDates: {
    start: string;
    end: string;
  };
  image?: string;
  description?: string;
  budget?: number;
  travelStyle?: string;
  createdAt: string;
}

// PostCard Component
const PostCard = ({ post }: { post: Post }) => {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  return (
    <>
      <Card className="mb-6 overflow-hidden animate-scale-in hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* User Avatar */}
            <Avatar className="h-10 w-10 border border-gray-200">
              <AvatarImage
                src={post.creatorId.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.creatorId.username}`}
                alt={`${post.creatorId.username}'s avatar`}
              />
              <AvatarFallback>{post.creatorId.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>

            {/* Post Content */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">{post.creatorId.username || "Unknown User"}</h3>
                <span className="text-xs text-gray-500">
                  • {new Date(post.createdAt).toLocaleDateString() || "Unknown Date"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{post.travelStyle}</p>
              <p className="text-gray-700 mb-4">{post.description}</p>

              {/* Post Image */}
              {post.image && (
                <div className="rounded-lg overflow-hidden mb-4">
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Post Actions */}
        <CardFooter className="bg-gray-50 px-4 py-2">
          <div className="flex items-center gap-4 w-full">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700"
              aria-label="Like post"
            >
              <Heart size={18} className="mr-1" />
              <span className="text-xs">Like</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700"
              aria-label="Comment on post"
            >
              <MessageCircle size={18} className="mr-1" />
              <span className="text-xs">Comment</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 ml-auto"
              onClick={() => setIsDetailsOpen(true)} // Open PostDetails modal
              aria-label="View post details"
            >
              View Details
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* PostDetails Modal */}
      {isDetailsOpen && (
        <PostDetails post={post} onClose={() => setIsDetailsOpen(false)} />
      )}
    </>
  );
};

// PostFeed Component
const PostFeed = () => {
  const { posts, isLoading } = useTravelPostStore();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 animate-pulse">Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-500">
        <MessageCircle size={40} className="mb-2" />
        <p>No posts available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;