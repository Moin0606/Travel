import React, { useEffect, useState } from "react";
import { useMatchStore } from "@/store/useMatchStore";

const MatchList = () => {
  const { matches, isLoading, approveMatch } = useMatchStore();
  const [otherUserStatuses, setOtherUserStatuses] = useState({});

  // Fetch other user's status for each match
  useEffect(() => {
    const fetchOtherUserStatuses = async () => {
      const statuses = {};
      for (const match of matches) {
        try {
          // Fetch the status using the postId
          const response = await useMatchStore.getState().getOtherUserMatchStatus(
            match.postId._id
          );
          statuses[match.postId._id] = {
            status: response.status, // Extract the status
            username: response.match.userId.username, // Extract the username
          };
        } catch (error) {
          console.error(`Failed to fetch status for post ${match.postId._id}`);
        }
      }
      setOtherUserStatuses(statuses);
    };

    if (matches.length > 0) {
      fetchOtherUserStatuses();
    }
  }, [matches]);

  if (isLoading) {
    return <p className="text-center text-gray-600">Loading matches...</p>;
  }

  if (matches.length === 0) {
    return <p className="text-center text-gray-600">No matches available.</p>;
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => {
        const otherUserStatus = otherUserStatuses[match.postId._id];

        return (
          <div
            key={match._id}
            className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Destination: {match.postId.destination}
            </h3>
            <p className="text-sm text-gray-600">
              Status:{" "}
              <span
                className={`font-medium ${
                  match.status === "accepted"
                    ? "text-green-600"
                    : match.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {match.status}
              </span>
            </p>
            <p className="text-sm text-gray-700">
              Matched with User:{" "}
              {otherUserStatus?.username || "Unknown User"}
            </p>
            <p className="text-sm text-gray-700">
              Other User's Status:{" "}
              {otherUserStatus?.status || "Loading..."}
            </p>
            <p className="text-sm text-gray-700">
              Travel Dates:{" "}
              {new Date(match.postId.travelDates.start).toLocaleDateString()} -{" "}
              {new Date(match.postId.travelDates.end).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700">
              Budget: ${match.postId.budget}
            </p>
            <p className="text-sm text-gray-700">
              Created At: {new Date(match.createdAt).toLocaleString()}
            </p>

            {/* Approve Button */}
            {match.status !== "accepted" && (
              <button
                onClick={() => approveMatch(match._id)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Approve Match
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MatchList;