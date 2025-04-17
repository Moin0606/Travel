import React from "react";
import { Heart, MessageCircle, Share2, ArrowLeft, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useMatchStore } from "../../store/useMatchStore";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from '@/store/useAuthStore';

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

interface PostDetailsProps {
  post: Post; // The post to display details for
  onClose: () => void; // Function to close the details view
}

const PostDetails = ({ post, onClose }: PostDetailsProps) => {
  const { createMatchManually } = useMatchStore();
  const { authUser } = useAuthStore();
  const { toast } = useToast();

  const handleCreateMatch = async () => {
    try {
      await createMatchManually(post._id, authUser._id);
      toast({ title:"Match created successfully!"});
      onClose(); // Close the modal after creating the match
    } catch (error) {
      toast({ title: "Error", description: "Failed to create match. Please try again."});
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-gray-700 bg-opacity-50 flex justify-center items-center">
      {/* Modal Container */}
      <Card className="w-full max-w-4xl animate-scale-in overflow-scroll no-scrollbar h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 hover:font-bold transition-colors m-5 mb-0"
          aria-label="Close post details"
        >
            <ArrowLeft />
        </button>

        {/* Post Content */}
        <CardContent className="p-6 pt-2 space-y-4">
          {/* User Avatar and Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-gray-200">
              <AvatarImage
                src={post.creatorId.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.creatorId.username}`}
                alt={`${post.creatorId.username}'s avatar`}
              />
              <AvatarFallback>{post.creatorId.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-medium text-gray-900">{post.creatorId.username || "Unknown User"}</h3>
              <span className="text-xs text-gray-500">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Destination and Travel Dates */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">{post.destination}</h2>
            <p className="text-sm text-gray-600">
              Traveling from {new Date(post.travelDates.start).toLocaleDateString()} to{" "}
              {new Date(post.travelDates.end).toLocaleDateString()}
            </p>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium text-gray-700">Description</h4>
            <p className="text-gray-700">{post.description || "No description available."}</p>
          </div>

          {/* Budget and Travel Style */}
          <div className="space-y-2">
            {post.budget && (
              <p className="text-gray-700">
                <strong>Budget:</strong> ${post.budget.toLocaleString()}
              </p>
            )}
            {post.travelStyle && (
              <p className="text-gray-700">
                <strong>Travel Style:</strong> {post.travelStyle.charAt(0).toUpperCase() + post.travelStyle.slice(1)}
              </p>
            )}
          </div>

          {/* Post Image */}
          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt="Post content"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          )}
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
              aria-label="Share post"
            >
              <Share2 size={18} />
            </Button>

            {/* Create Match Button */}
            <Button
              variant="default"
              size="sm"
              className="ml-auto bg-travely-blue hover:bg-travely-dark-blue transition-colors duration-200"
              onClick={handleCreateMatch}
              aria-label="Create match"
            >
              <UserPlus size={18} className="mr-1" />
              <span className="text-xs">Create Match</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostDetails;