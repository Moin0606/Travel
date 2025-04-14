import React from "react";
import MessageSidebar from "./MessageTab/MessageSidebar";
import NoChatSelected from "./MessageTab/NoChatSelected";
import ChatContainer from "./MessageTab/ChatContainer";
import { useChatStore } from "../../store/useChatStore";

const Message: React.FC = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="bg-white rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] border">
      <div className="flex h-full rounded-lg overflow-hidden">
        <MessageSidebar />
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>
    </div>
  );
};

export default Message;
