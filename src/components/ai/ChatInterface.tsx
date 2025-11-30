"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import ChatContainer from "./ChatContainer";
import ConversationsList from "./ConversationsList";

export default function ChatInterface() {
  const { user, logout } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string>(
    "",
  );

  // Don't auto-select a conversation - user needs to create one first
  // The ConversationsList will handle selecting when user creates/clicks a conversation

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex bg-black relative">
      {/* User Info & Logout Button */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg">
          {user?.pictureUrl && (
            <img
              src={user.pictureUrl}
              alt={user.name}
              className="w-10 h-10 rounded-full ring-2 ring-indigo-500/50 object-cover"
            />
          )}
          <div className="hidden sm:flex flex-col">
            <span className="text-white font-semibold text-sm leading-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
              {user?.name || user?.username}
            </span>
            {user?.username && user?.name && user?.username !== user?.name && (
              <span className="text-gray-400 text-xs leading-tight mt-0.5">
                @{user.username}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Logout
        </button>
      </div>

      {/* Conversations Sidebar */}
      <div className="hidden sm:flex sm:w-80 flex-shrink-0 h-screen">
        <ConversationsList
          onSelectConversation={setSelectedConversationId}
          selectedConversationId={selectedConversationId}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 h-screen">
        <ChatContainer conversationId={selectedConversationId} />
      </div>

      {/* Mobile: Show conversations button or overlay */}
      {/* You can add a mobile menu here if needed */}
    </div>
  );
}

