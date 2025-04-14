import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { AuthProvider } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/login"
                element={!authUser ? <Login /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/register"
                element={
                  !authUser ? <Register /> : <Navigate to="/dashboard" />
                }
              />

              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/contact" element={<ContactUs />} />
              {/*
          <Route
            path="/dashboard"
            element={authUser ? <Dashboard /> : <Navigate to="/" />}
          />
          */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

  // return (<QueryClientProvider client={queryClient}>
  //   <TooltipProvider>
  //     <Toaster />
  //     <Sonner />
  //     <BrowserRouter>
  //       <Routes>
  //         <Route path="/" element={<Index />} />
  //         <Route path="/login" element={<Login />} />
  //         <Route path="/register" element={<Register />} />
  //         <Route path="/profile" element={<Profile />} />
  //         <Route path="/admin" element={<Admin />} />
  //         <Route path="/contact" element={<ContactUs />} />
  //         <Route path="/dashboard" element={<Dashboard />} />
  //         {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  //         <Route path="*" element={<NotFound />} />
  //       </Routes>
  //     </BrowserRouter>
  //   </TooltipProvider>
  // </QueryClientProvider>)
};

export default App;
