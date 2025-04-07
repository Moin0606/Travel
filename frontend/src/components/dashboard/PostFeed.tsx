
import React from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Mock data for posts
const posts = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
      role: "Travel Enthusiast"
    },
    content: "Just booked my flight to Bali! Anyone have recommendations for the best beaches to visit? Looking for both touristy spots and hidden gems.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000",
    likes: 24,
    comments: 8,
    timeAgo: "2h ago"
  },
  {
    id: 2,
    user: {
      name: "Mike Chen",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mike",
      role: "Food Explorer"
    },
    content: "The street food scene in Bangkok is unmatched! My top picks: Pad Thai at Thip Samai, mango sticky rice at Sukhumvit Soi 38, and the coconut ice cream near Chatuchak Market.",
    likes: 42,
    comments: 15,
    timeAgo: "5h ago"
  },
  {
    id: 3,
    user: {
      name: "Elena Petrova",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Elena",
      role: "Adventure Seeker"
    },
    content: "Hiked to Machu Picchu today! The Inca Trail was challenging but absolutely worth it. If you're planning your trip, remember to book permits months in advance.",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000",
    likes: 67,
    comments: 23,
    timeAgo: "1d ago"
  }
];

interface PostCardProps {
  post: typeof posts[0];
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="mb-6 overflow-hidden animate-scale-in hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{post.user.name}</h3>
              <span className="text-xs text-gray-500">• {post.timeAgo}</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{post.user.role}</p>
            <p className="text-gray-700 mb-4">{post.content}</p>
            
            {post.image && (
              <div className="rounded-lg overflow-hidden mb-4">
                <img src={post.image} alt="Post content" className="w-full h-auto" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-4 py-2">
        <div className="flex items-center gap-4 w-full">
          <Button variant="ghost" size="sm" className="text-gray-700">
            <Heart size={18} className="mr-1" />
            <span className="text-xs">{post.likes}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="text-gray-700">
            <MessageCircle size={18} className="mr-1" />
            <span className="text-xs">{post.comments}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="text-gray-700 ml-auto">
            <Share2 size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const PostFeed = () => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
