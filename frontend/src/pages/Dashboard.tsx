
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Home, Users, MessageSquare, BookOpen, User, Mail, Plus } from "lucide-react";
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
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

import PostFeed from "@/components/dashboard/PostFeed";
import PostModal from "@/components/dashboard/PostModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showEmail, setShowEmail] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const { toast } = useToast();
  
  const handleLogout = () => {
    // For demo purposes, just navigate to the home page
    navigate("/");
  };

  const toggleProfileDisplay = () => {
    setShowEmail(prev => !prev);
  };

  const openPostModal = () => {
    setIsPostModalOpen(true);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
  };

  const handlePostSubmit = () => {
    closePostModal();
    toast({
      title: "Post created!",
      description: "Your travel post has been shared with the community.",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Left Sidebar */}
        <Sidebar variant="inset" className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200">
            <div className="p-4">
              <h1 className="text-xl font-bold text-travely-blue">TripSync</h1>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Home" isActive={true}>
                  <Home />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Connect">
                  <Users />
                  <span>Connect</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Chat">
                  <MessageSquare />
                  <span>Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Book">
                  <BookOpen />
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
                    <AvatarImage src="https://api.dicebear.com/7.x/adventurer/svg?seed=John" alt="User avatar" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {showEmail ? "john.smith@example.com" : "John Smith"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">Traveler</p>
                  </div>
                </div>
                
                <Button 
                  onClick={toggleProfileDisplay}
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                >
                  {showEmail ? <User size={16} /> : <Mail size={16} />}
                  <span className="ml-2">{showEmail ? "Show ID" : "Show Email"}</span>
                </Button>
              </CardContent>
            </Card>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <span className="text-lg font-bold text-travely-blue hidden md:block">TripSync</span>
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
          
          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Travel Feed</h2>
                <Button 
                  onClick={openPostModal}
                  className="bg-travely-blue hover:bg-travely-dark-blue transition-colors duration-200 animate-scale-in"
                  size="sm"
                >
                  <Plus size={18} />
                  <span className="ml-1">Create Post</span>
                </Button>
              </div>
              <PostFeed />
            </div>
          </main>
        </div>
      </div>

      <PostModal 
        isOpen={isPostModalOpen} 
        onClose={closePostModal} 
        onSubmit={handlePostSubmit} 
      />
    </SidebarProvider>
  );
};

export default Dashboard;
