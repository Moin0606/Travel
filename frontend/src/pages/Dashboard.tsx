import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  Users,
  MessageSquare,
  BookOpen,
  User,
  Mail,
  Plus,
  Hotel,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

import PostFeed from "@/components/dashboard/PostFeed";
import PostModal from "@/components/dashboard/PostModal";
import MatchList from "@/components/dashboard/MatchList"; // Import MatchList
import Message from "@/components/dashboard/Message";
import { useAuthStore } from "../store/useAuthStore";
import { useTravelPostStore } from "../store/useTravelPostStore";
import { useMatchStore } from "../store/useMatchStore"; // Import MatchStore

const Dashboard = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();

  // Zustand store state and actions
  const { isLoading: isPostLoading, fetchPosts } = useTravelPostStore();
  const { fetchUserMatches, matches, isLoading: isMatchLoading } = useMatchStore();

  const [showEmail, setShowEmail] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<
    "explore" | "matched" | "message"
  >("explore");

  const { toast } = useToast();

  // Fetch posts when the component mounts or switches to "Explore" view
  useEffect(() => {
    if (currentView === "explore") {
      fetchPosts();
    }
  }, [fetchPosts, currentView]);

  // Fetch matches when switching to "Connect" view
  useEffect(() => {
    if (currentView === "matched") {
      fetchUserMatches();
    }
  }, [fetchUserMatches, currentView]);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/", { state: { fromLogout: true } });
    window.location.reload();
  };

  const toggleProfileDisplay = () => {
    setShowEmail((prev) => !prev);
  };

  const openPostModal = () => {
    setIsPostModalOpen(true);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
  };

  const navigateToBooking = () => {
    navigate("/booking");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Sidebar */}
        <Sidebar variant="inset" className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200">
            <div className="p-2">
              <h1 className="text-xl font-bold text-travely-blue">TripSync</h1>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Home"
                  isActive={currentView === "explore"}
                  onClick={() => setCurrentView("explore")}
                >
                  <Home />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Connect"
                  onClick={() => setCurrentView("matched")}
                >
                  <Users />
                  <span>Connect</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Chat"
                  onClick={() => setCurrentView("message")}
                >
                  <MessageSquare />
                  <span>Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Matched Users"
                  isActive={currentView === "matched"}
                  onClick={() => setCurrentView("matched")}
                >
                  <BookOpen />
                  <span>Trips</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Book" onClick={navigateToBooking}>
                  <Hotel />
                  <span>Book</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-gray-200">
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage
                      src={authUser.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${authUser?.username || "User"}`}
                      alt="User avatar"
                    />
                    <AvatarFallback>
                      {authUser?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {showEmail ? authUser?.email : authUser?.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">Traveler</p>
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/profile")}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  {showEmail ? <User size={16} /> : <Mail size={16} />}
                  <span className="ml-2">
                    {showEmail ? "Go to Profile (Username)" : "Go to Profile (Email)"}
                  </span>
                </Button>
              </CardContent>
            </Card>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
            </div>

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-gray-700"
            >
              <LogOut size={18} />
              <span className="ml-2 hidden md:inline">Log out</span>
            </Button>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentView === "explore"
                    ? "Explore"
                    : currentView === "matched"
                    ? "Matched Users"
                    : "Messages"}
                </h2>
                {currentView === "explore" && (
                  <Button
                    onClick={openPostModal}
                    className="bg-travely-blue hover:bg-travely-dark-blue transition-colors duration-200 animate-scale-in"
                    size="sm"
                  >
                    <Plus size={18} />
                    <span className="ml-1">Create Post</span>
                  </Button>
                )}
              </div>

              {/* Conditional Rendering Based on Current View */}
              {currentView === "explore" && isPostLoading ? (
                <p>Loading posts...</p>
              ) : currentView === "explore" ? (
                <PostFeed />
              ) : currentView === "matched" && isMatchLoading ? (
                <p>Loading matches...</p>
              ) : currentView === "matched" ? (
                <MatchList />
              ) : (
                <Message />
              )}
            </div>
          </main>
        </div>
      </div>

      <PostModal
        isOpen={isPostModalOpen}
        onClose={closePostModal}
      />
    </SidebarProvider>
  );
};

export default Dashboard;