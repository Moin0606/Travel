import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

// Match interface (matches returned from the backend)
export interface Match {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  postId: {
    _id: string;
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
  };
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

// Store state interface
interface MatchStoreState {
  matches: Match[];
  isLoading: boolean;
  hasFetchedMatches: boolean;
}

// Store actions interface
interface MatchStoreActions {
  fetchUserMatches: () => Promise<void>;
  updateMatchStatus: (matchId: string, status: "pending" | "accepted" | "rejected") => Promise<void>;
  approveMatch: (matchId: string) => Promise<void>;
  createMatchManually: (postId: string, userId: string) => Promise<void>;
  getOtherUserMatchStatus: (postId: string) => Promise<string>;
  clearMatches: () => void;
}

// Combine state and actions into a single store
export const useMatchStore = create<MatchStoreState & MatchStoreActions>((set, get) => ({
  // State Properties
  matches: [],
  isLoading: false,
  hasFetchedMatches: false,

  // Fetch all matches for the authenticated user
  fetchUserMatches: async () => {
    if (get().hasFetchedMatches) return;

    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/matches/user");
      console.log(response.data);
      set({
        matches: response.data.matches,
        isLoading: false,
        hasFetchedMatches: true,
      });
    } catch (error) {
      console.error("Error fetching matches:", error);
      set({ isLoading: false });
    }
  },

  // Update the status of a specific match
  updateMatchStatus: async (matchId: string, status: "pending" | "accepted" | "rejected") => {
    try {
      const res = await axiosInstance.patch<{ status: string }>(`/matches/${matchId}/status`, { status });
      set((state) => ({
        matches: state.matches.map((match) =>
          match._id === matchId ? { ...match, status: res.data.status } : match
        ),
      }));
      toast.success("Match status updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update match status");
    }
  },

  // Approve a match
  approveMatch: async (matchId: string) => {
    try {
      const res = await axiosInstance.post<{ status: string }>(`/matches/approve/${matchId}`);
      set((state) => ({
        matches: state.matches.map((match) =>
          match._id === matchId ? { ...match, status: res.data.status } : match
        ),
      }));
      toast.success("Match approved successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve match");
    }
  },

  // Manually create a match
  createMatchManually: async (postId: string, userId: string) => {
    try {
      const res = await axiosInstance.post<{ matchForRequestingUser: Match }>(
        "/matches/create",
        { postId, userId }
      );
      set((state) => ({
        matches: [...state.matches, res.data.matchForRequestingUser],
      }));
      toast.success("Match created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create match");
    }
  },

  // Get the match status of the other user for a given post
  getOtherUserMatchStatus: async (postId: string): Promise<string> => {
    try {
      const res = await axiosInstance.get<{ status: string }>(
        `/matches/${postId}/other-user-status`
      );
      return res.data; // Return the status directly
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch match status");
      throw error;
    }
  },

  // Clear matches (optional)
  clearMatches: () => set({ matches: [] }),
}));