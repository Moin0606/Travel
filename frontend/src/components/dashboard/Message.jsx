import React from 'react'
import MessageSidebar from "../dashboard/MessageTab/MessageSidebar";
import NoChatSelected from "../dashboard/MessageTab/NoChatSelected";
import ChatContainer from "../dashboard/MessageTab/ChatContainer";
import { useChatStore } from "../../store/useChatStore";
const Message = () => {
  const { selectedUser } = useChatStore();

  return (
    // <div className="container mx-auto p-4">
    // <div className="h-screen bg-base-200"> 
    // <div className="flex items-center">
      <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
        <div className="flex h-full rounded-lg overflow-hidden">
          
          <MessageSidebar />
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          
           {/* </div> */}
         {/* </div> */}
        {/* </div>  */}
       </div> 
    </div>
  );
}
// profilePicture: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex"
export default Message