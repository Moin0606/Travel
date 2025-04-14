import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
  users: [],
  isFetchingUsers: false,

  fetchUsers: async () => {
    set({ isFetchingUsers: true });
    try {
      const res = await axiosInstance.get("/users/getusers");
      const filteredUsers = res.data.filter((user) => user.role === 'user');
      set({ users: filteredUsers });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      set({ users: [] });
    } finally {
      set({ isFetchingUsers: false });
    }
  },

  acceptUser: async (userId) => {
    try {
      await axiosInstance.post(`/users/accept/${userId}`);
      set((state) => ({
        users: state.users.filter(user => user._id !== userId)
      }));
      toast.success('User accepted successfully');
    } catch (error) {
      toast.error('Failed to accept user');
    }
  },

  rejectUser: async (userId) => {
    try {
      await axiosInstance.post(`/users/reject/${userId}`);
      set((state) => ({
        users: state.users.filter(user => user._id !== userId)
      }));
      toast.success('User rejected successfully');
    } catch (error) {
      toast.error('Failed to reject user');
    }
  },
}));