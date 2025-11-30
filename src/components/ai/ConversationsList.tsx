"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  tags?: Record<string, string>;
}

interface ConversationsListProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId?: string;
}

export default function ConversationsList({
  onSelectConversation,
  selectedConversationId,
}: ConversationsListProps) {
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/handle-conversations/list_conversations?limit=50&offset=0", {
          credentials: "include",
        });

        // Handle 401 (Unauthorized) - user not logged in
        if (response.status === 401) {
          setConversations([]);
          setError(null);
          setIsLoading(false);
          return; // Don't retry if not authenticated
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch conversations");
        }

        const data = await response.json();

        if (data.success && data.data?.conversations) {
          setConversations(data.data.conversations);
        } else if (data.success && Array.isArray(data.data)) {
          // Handle case where data.data is directly an array
          setConversations(data.data);
        } else if (data.success && data.data) {
          // Handle case where data.data might be an object with conversations property
          setConversations(data.data.conversations || []);
        } else {
          setConversations([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError(err instanceof Error ? err.message : "Failed to load conversations");
        setConversations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
    // Conversations are loaded once - no polling needed
    // New conversations will appear when user creates them
  }, [isAuthenticated]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [openMenuId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 168) {
      // Less than a week
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const handleCreateConversation = async () => {
    try {
      setIsCreating(true);
      setError(null);
      
      // Generate a unique conversation ID
      const newId = `conversation_${Date.now()}`;
      
      // Call the API to create the conversation
      const response = await fetch("/api/handle-conversations/create-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: newId }),
      });

      // Handle 401 (Unauthorized) - user not logged in
      if (response.status === 401) {
        throw new Error("Please log in to create conversations");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || "Failed to create conversation");
      }

      const data = await response.json();
      
      if (data.success) {
        // Create the new conversation object
        const newConversation: Conversation = {
          id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...(data.data || {}), // Include any additional data from the API response
        };
        
        // Add the new conversation to the beginning of the list
        setConversations((prev) => [newConversation, ...prev]);
        
        // Select the new conversation
        onSelectConversation(newId);
      } else {
        throw new Error(data.error || "Failed to create conversation");
      }
    } catch (err) {
      console.error("Error creating conversation:", err);
      setError(err instanceof Error ? err.message : "Failed to create conversation");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the conversation when clicking delete
    setOpenMenuId(null); // Close the menu
    
    if (!confirm(`Are you sure you want to delete this conversation?`)) {
      return;
    }

    try {
      setDeletingId(conversationId);
      setError(null);

      const response = await fetch("/api/handle-conversations/delete-conversation", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: conversationId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete conversation");
      }

      const data = await response.json();

      if (data.success) {
        // Remove the conversation from the list
        setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
        
        // If the deleted conversation was selected, clear selection
        if (selectedConversationId === conversationId) {
          // Optionally select the first remaining conversation or leave empty
          const remaining = conversations.filter((conv) => conv.id !== conversationId);
          if (remaining.length > 0) {
            onSelectConversation(remaining[0].id);
          }
        }
      } else {
        throw new Error(data.error || "Failed to delete conversation");
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
      setError(err instanceof Error ? err.message : "Failed to delete conversation");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full sm:w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Conversations
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {conversations.length} {conversations.length === 1 ? "chat" : "chats"}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      )}

      {/* Conversations List */}
      {!isLoading && !error && (
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              No conversations yet. Start a new chat!
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`relative group w-full text-left p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                    selectedConversationId === conversation.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => onSelectConversation(conversation.id)}
                    className="w-full text-left"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800 dark:text-white text-sm truncate pr-8">
                          {conversation.id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDate(conversation.updatedAt)}</span>
                      </div>
                    </div>
                  </button>
                  
                  {/* Three-dot menu button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === conversation.id ? null : conversation.id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="More options"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {openMenuId === conversation.id && (
                    <div 
                      className="absolute right-2 top-10 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[120px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleDeleteConversation(conversation.id, e)}
                        disabled={deletingId === conversation.id}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === conversation.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Conversation Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleCreateConversation}
          disabled={isCreating || isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isCreating ? "Creating..." : "+ New Conversation"}
        </button>
      </div>
    </div>
  );
}

