import { create } from "zustand";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "../lib/axios";

const { toast } = useToast();
export const useTravelPostStore = create((set, get) => ({
  // State Properties
  posts: [], // List of travel posts
  isLoading: false, // Loading state for API calls

  // Fetch all travel posts with optional filters
  fetchPosts: async (filters = {}) => {
    set({ isLoading: true });
    try {
      // Ensure filters are properly formatted before sending to the backend
      const formattedFilters = {
        creatorId: filters.creatorId || undefined,
        budget: filters.budget ? `${filters.minBudget},${filters.maxBudget}` : undefined,
        travelStyle: filters.travelStyle || undefined,
        minAge: filters.minAge || undefined,
        maxAge: filters.maxAge || undefined,
        genderPreference: filters.genderPreference || undefined,
        description: filters.description || undefined,
      };

      // Fetch posts from the backend
      const res = await axiosInstance.get("/posts", { params: formattedFilters });

      // Update the posts state with the fetched data
      set({ posts: res.data.travelPosts }); // Assuming the response contains `travelPosts` array
    } catch (error) {
      // Handle errors and show a user-friendly notification
      toast.error(error.response?.data?.message || "Failed to fetch posts");
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new travel post
  createPost: async (postData) => {
    try {
      const res = await axiosInstance.post("/posts", postData);
      set((state) => ({ posts: [res.data, ...state.posts] })); // Add new post to the top of the list
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    }
  },

  // Update an existing travel post
  updatePost: async (postId, updatedData) => {
    try {
      const res = await axiosInstance.patch(`/posts/${postId}`, updatedData);
      set((state) => ({
        posts: state.posts.map((post) => (post._id === postId ? res.data : post)),
      }));
      toast.success("Post updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update post");
    }
  },

  // Delete a travel post
  deletePost: async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== postId),
      }));
      toast.success("Post deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  },

  // Close a travel post (set status to "closed")
  closePost: async (postId) => {
    try {
      const res = await axiosInstance.patch(`/posts/${postId}/close`);
      set((state) => ({
        posts: state.posts.map((post) => (post._id === postId ? res.data : post)),
      }));
      toast.success("Post closed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to close post");
    }
  },
  // Select a post (e.g., for viewing or editing)
  selectPost: (post) => set({ selectedPost: post }),

  // Clear the selected post
  clearSelectedPost: () => set({ selectedPost: null }),
}));