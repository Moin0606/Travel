// Define types for the backend response
interface User {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    matchedPosts: string[];
    password: string;
    role: string;
    travelPreferences: {
      destinations: string[];
      travelStyles: string[];
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  interface Match {
    _id: string;
    postId: string;
    status: string;
    userId: User;
    createdAt: string;
    __v: number;
  }
  
export  interface ApiResponse {
    message: string;
    status: string;
    match: Match;
  }