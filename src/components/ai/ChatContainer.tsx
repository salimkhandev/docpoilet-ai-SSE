"use client";
import { useCallback, useEffect, useState } from "react";
import { useAIState } from "../../contexts/AIStateContext";
import HeaderComponent from "./HeaderComponent";
import InputComponent from "./InputComponent";
import MessageListComponent from "./MessageListComponent";

interface Message {
  id: string;
  text: string;
  createdAt: Date;
  isUser?: boolean;
}

/**
 * ChatContainer component - Main chat interface container
 * Handles real-time messages via SSE, state management, and coordinates:
 * - HeaderComponent: Chat header with connection status
 * - MessageListComponent: Renders messages with React.memo
 * - InputComponent: Handles input state (isolated from message list)
 *
 * This prevents the entire message list from re-rendering when typing in the input.
 */
interface ChatContainerProps {
  conversationId?: string;
}

export default function ChatContainer({
  conversationId,
}: ChatContainerProps) {
  const { state, dispatch } = useAIState();
  const [isConnected, setIsConnected] = useState(false);

  // Clear messages immediately when conversation changes
  useEffect(() => {
    dispatch({ type: "CLEAR_MESSAGES" });
    setIsConnected(false);
  }, [conversationId, dispatch]);

  // Load initial messages when conversation is selected (one-time)
  useEffect(() => {
    if (!conversationId || conversationId.trim() === "") {
      return;
    }

    // Load existing messages once when conversation is selected
    const loadInitialMessages = async () => {
      try {
        const response = await fetch(
          `/api/handle-messages/get-all-messages?conversationId=${conversationId}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          const botpressMessages = data.data?.messages || [];
          const sortedMessages = botpressMessages.sort(
            (a: any, b: any) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

          const formattedMessages: Message[] = sortedMessages.map(
            (msg: any) => ({
              id: msg.id,
              text: msg.payload?.text || "",
              isUser: !(msg.userId && msg.userId.startsWith("user_")),
              createdAt: new Date(msg.createdAt),
            }),
          );
          
          dispatch({ type: "SET_MESSAGES", payload: formattedMessages });
          
          // Clear loading state after initial load
          dispatch({
            type: "GENERATE_SUCCESS",
            payload: {
              id: Date.now().toString(),
              name: "AI Response",
              html: "",
              css: "",
              jsx: "",
              createdAt: new Date(),
            },
          });
          
          setIsConnected(true);
          console.log(`[ChatContainer] Loaded ${formattedMessages.length} initial messages`);
        }
      } catch (error) {
        console.error("[ChatContainer] Error loading initial messages:", error);
      }
    };

    loadInitialMessages();
  }, [conversationId, dispatch]);

  // Connect to SSE stream for real-time messages
  useEffect(() => {
    if (!conversationId || conversationId.trim() === "") {
      return;
    }

    console.log(`[ChatContainer] Connecting to SSE stream for conversation: ${conversationId}`);
    
    const eventSource = new EventSource(
      `/api/listen-conversation?conversationId=${conversationId}`,
      { withCredentials: true }
    );

    eventSource.onopen = () => {
      console.log('[ChatContainer] SSE connection opened');
      setIsConnected(true);
    };

    eventSource.addEventListener('message', (e) => {
      try {
        const eventData = JSON.parse(e.data);
        
        if (eventData.type === 'message_created' && eventData.data) {
          const messageData = eventData.data;
          
          // Create new message object
          const newMessage: Message = {
            id: messageData.id,
            text: messageData.payload?.text || "",
            isUser: !messageData.isBot,
            createdAt: new Date(messageData.createdAt),
          };

          // Batch updates: append message and clear loading in one render cycle
          // React 18+ batches these automatically, but we can optimize further
          if (messageData.isBot) {
            // For bot messages, append and clear loading together
            dispatch({ 
              type: "APPEND_MESSAGE", 
              payload: newMessage 
            });
            // Use requestAnimationFrame to batch the loading state update
            requestAnimationFrame(() => {
              dispatch({
                type: "GENERATE_SUCCESS",
                payload: {
                  id: Date.now().toString(),
                  name: "AI Response",
                  html: "",
                  css: "",
                  jsx: "",
                  createdAt: new Date(),
                },
              });
            });
          } else {
            // For user messages, just append
            dispatch({ 
              type: "APPEND_MESSAGE", 
              payload: newMessage 
            });
          }

          console.log('[ChatContainer] New message received via SSE:', newMessage);
        }
      } catch (error) {
        console.error('[ChatContainer] Error parsing SSE message:', error);
      }
    });

    eventSource.addEventListener('error', (e) => {
      console.error('[ChatContainer] SSE error:', e);
      setIsConnected(false);
      // Clear loading state on error
      dispatch({
        type: "GENERATE_ERROR",
        payload: "Connection error. Please try again.",
      });
    });

    eventSource.addEventListener('disconnected', () => {
      console.log('[ChatContainer] SSE disconnected');
      setIsConnected(false);
    });

    // Cleanup on unmount or conversation change
    return () => {
      console.log('[ChatContainer] Closing SSE connection');
      eventSource.close();
    };
  }, [conversationId, dispatch]);

  // Memoized send message function
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      
      // Don't send if there's no conversationId
      if (!conversationId || conversationId.trim() === "") {
        dispatch({
          type: "GENERATE_ERROR",
          payload: "Please select or create a conversation first",
        });
        return;
      }

      try {
        const response = await fetch("/api/handle-messages/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            message: text,
            conversationId: conversationId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to generate component");
        }
        // Message sent successfully - loading will be cleared when bot responds via SSE
      } catch (error) {
        console.error("Send error:", error);
        // Clear loading state on send error
        dispatch({
          type: "GENERATE_ERROR",
          payload: error instanceof Error ? error.message : "Failed to send message",
        });
      }
    },
    [dispatch, conversationId],
  );

  // Show message if no conversation is selected
  if (!conversationId || conversationId.trim() === "") {
    return (
      <div className="w-full h-full transition-colors duration-300">
        <div
          className="bg-white dark:bg-gray-800 overflow-hidden border-x border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300 h-full items-center justify-center p-8"
        >
            <div className="text-center max-w-md">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                No Conversation Selected
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create a new conversation from the sidebar to start chatting, or select an existing conversation.
              </p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full transition-colors duration-300">
      <div
        className="bg-white dark:bg-gray-800 overflow-hidden border-x border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300 h-full"
      >
          <HeaderComponent
            isConnected={isConnected}
            isLoading={state.isLoading}
          />

          <MessageListComponent error={state.error || undefined} />

          <InputComponent onSendMessage={sendMessage} conversationId={conversationId} />
      </div>
    </div>
  );
}

