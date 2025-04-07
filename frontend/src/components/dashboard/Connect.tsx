import React from "react";
import { UserCheck, Clock, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Example mock data
const matchedUsers = [
  {
    _id: "1",
    userId: {
      _id: "u1",
      username: "alex_travels",
      profilePicture: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
    },
    status: "accepted",
    matchedAt: new Date("2025-04-01T10:00:00Z"),
  },
  {
    _id: "2",
    userId: {
      _id: "u2",
      username: "wanderlust_amy",
      profilePicture: "https://api.dicebear.com/7.x/adventurer/svg?seed=Amy",
    },
    status: "pending",
    matchedAt: new Date("2025-04-05T15:30:00Z"),
  },
];

const MatchedUserCard = ({ user }: { user: (typeof matchedUsers)[0] }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <UserCheck size={16} className="text-green-600" />;
      case "pending":
        return <Clock size={16} className="text-yellow-500" />;
      case "rejected":
        return <XCircle size={16} className="text-red-500" />;
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 flex items-center space-x-4">
        <Avatar className="h-10 w-10 border border-gray-200">
          <AvatarImage
            src={user.userId.profilePicture}
            alt={user.userId.username}
          />
          <AvatarFallback>
            {user.userId.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            {user.userId.username}
          </p>
          <p className="text-xs text-gray-500">
            Matched {new Date(user.matchedAt).toLocaleDateString()}
          </p>
        </div>
        {getStatusIcon(user.status)}
      </CardContent>
    </Card>
  );
};

const MatchedUsers = () => {
  return (
    <div className="space-y-4">
      {matchedUsers.map((user) => (
        <MatchedUserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default MatchedUsers;
