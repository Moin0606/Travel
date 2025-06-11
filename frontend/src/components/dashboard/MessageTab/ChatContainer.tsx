import { useChatStore } from "../../../store/useChatStore";
import { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../../../store/useAuthStore";
import { formatMessageTime } from "../../../lib/utils";

const ChatContainer = () => {
  type Message = {
    _id: string;
    senderId: string;
    text?: string;
    image?: string;
    createdAt: string;
  };
  
  const {
      messages,
      getMessages,
      isMessagesLoading,
      selectedUser,
      subscribeToMessages,
      unsubscribeFromMessages,
    }: {
      messages: Message[];
      getMessages: (userId: string) => void;
      isMessagesLoading: boolean;
      selectedUser: { _id: string; username: string; profilePic?: string };
      subscribeToMessages: () => void;
      unsubscribeFromMessages: () => void;
    } = useChatStore();
  const messageEndRef = useRef(null);
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages, selectedUser]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getUserProfilePic = (user) => {
    const defaultAvatar = "/avatar.png";
    return (
      user.profilePicture ||
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}` ||
      defaultAvatar
    );
  };

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
    const UserProfilePic = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`;
    return UserProfilePic;
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 flex flex-col overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={index === messages.length - 1 ? messageEndRef : null}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? getUserProfilePic(authUser)
                      : getUserProfilePic(selectedUser)
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


  // const profilePic = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`;
