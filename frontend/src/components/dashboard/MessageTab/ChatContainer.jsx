import { useChatStore } from "../../../store/useChatStore";
import { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../../../store/useAuthStore";
import { formatMessageTime } from "../../../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const messageEndRef = useRef(null);
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    unsubscribeFromMessages,
    subscribeToMessages,
  ]);
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const UsersProfilePic = (user) => {
    // const gender = user.gender;

    // const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${user.fullName}`;
    // const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${user.fullName}`;
    // console.log("gender", gender);
    const UserProfilePic = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`;
    // console.log("UserProfilePic", UserProfilePic);
    return UserProfilePic;
  };

  // const profilePic = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 flex flex-col overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic ||
                        UsersProfilePic(authUser) ||
                        "/avatar.png"
                      : selectedUser.profilePic ||
                        UsersProfilePic(selectedUser) ||
                        "/avatar.png"
                  }
                  alt="Profile Pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
