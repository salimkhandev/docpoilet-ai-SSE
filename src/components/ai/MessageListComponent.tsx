import { useAIState } from '@/contexts/AIStateContext';
import { Check, Copy } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  text: string;
  isUser?: boolean;
  createdAt: Date;
}

interface MessageListComponentProps {
  error?: string;
}

// Format timestamp to readable format
const formatTime = (date: Date): string => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  
  return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Parse markdown text and convert to React elements
const parseMarkdown = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  const lines = text.split('\n');
  let listItems: string[] = [];
  let inList = false;
  let nonListParts: string[] = [];
  let partKey = 0;
  
  // Helper function to parse bold text in a string
  const parseBold = (str: string): React.ReactNode[] => {
    const boldRegex = /\*\*(.+?)\*\*/g;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;
    
    while ((match = boldRegex.exec(str)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        const beforeText = str.substring(lastIndex, match.index);
        if (beforeText) {
          nodes.push(<React.Fragment key={`text-${key++}`}>{beforeText}</React.Fragment>);
        }
      }
      
      // Add bold text
      nodes.push(<strong key={`bold-${key++}`} className="font-bold text-[15px]">{match[1]}</strong>);
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < str.length) {
      const remainingText = str.substring(lastIndex);
      if (remainingText) {
        nodes.push(<React.Fragment key={`text-${key++}`}>{remainingText}</React.Fragment>);
      }
    }
    
    return nodes.length > 0 ? nodes : [str];
  };
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('- ')) {
      if (!inList && nonListParts.length > 0) {
        // Render accumulated non-list text with bold parsing
        const textContent = nonListParts.join('\n');
        parts.push(
          <div key={`text-${partKey++}`} className="text-[15px] whitespace-pre-wrap">
            {parseBold(textContent)}
          </div>
        );
        nonListParts = [];
      }
      inList = true;
      listItems.push(trimmedLine.substring(2));
    } else {
      if (inList && listItems.length > 0) {
        // Render list with bold parsing in each item
        parts.push(
          <ul key={`list-${partKey++}`} className="list-disc list-inside">
            {listItems.map((item, i) => (
              <li key={i} className="text-[15px] ">
                {parseBold(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      if (trimmedLine || nonListParts.length > 0) {
        nonListParts.push(line);
      }
    }
  });
  
  // Handle remaining list items
  if (inList && listItems.length > 0) {
    parts.push(
      <ul key={`list-${partKey++}`} className="list-disc list-inside">
        {listItems.map((item, i) => (
          <li key={i} className="text-[15px]">
            {parseBold(item)}
          </li>
        ))}
      </ul>
    );
  }
  
  // Handle remaining non-list text
  if (nonListParts.length > 0) {
    const textContent = nonListParts.join('\n');
    parts.push(
      <div key={`text-${partKey++}`} className="text-[15px] whitespace-pre-wrap">
        {parseBold(textContent)}
      </div>
    );
  }
  
  return parts.length > 0 ? parts : [<div key="text-default" className="text-[15px] whitespace-pre-wrap">{text}</div>];
};

// Parse and format message text with code block detection
const formatMessageText = (text: string): { hasCode: boolean; parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> } => {
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
  let lastIndex = 0;
  let match;
  let hasCode = false;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textContent = text.substring(lastIndex, match.index).trim();
      if (textContent) {
        parts.push({ type: 'text', content: textContent });
      }
    }
    
    // Add code block
    const language = match[1] || 'text';
    const codeContent = match[2].trim();
    parts.push({ type: 'code', content: codeContent, language });
    hasCode = true;
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const textContent = text.substring(lastIndex).trim();
    if (textContent) {
      parts.push({ type: 'text', content: textContent });
    }
  }

  // If no code blocks found, return entire text as single part
  if (parts.length === 0) {
    parts.push({ type: 'text', content: text });
  }

  return { hasCode, parts };
};

// Code block component with copy functionality - ChatGPT style
const CodeBlock = React.memo(({ code, language }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [code]);

  return (
    <div className="relative my-4 rounded-lg overflow-hidden bg-[#282c34] border border-gray-700 w-full">
      {/* Header with language and copy button - ChatGPT style */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#21252b] border-b border-gray-700">
        <div className="text-xs text-gray-400 font-mono">
          {language || 'code'}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-700/50"
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      
      {/* Syntax highlighted code with vertical scrolling */}
      <div 
        className="relative max-h-[500px] overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 #1F2937',
        }}
      >
        <SyntaxHighlighter
          language={language || 'text'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            background: '#282c34',
          }}
          showLineNumbers={false}
          wrapLines={false}
          wrapLongLines={false}
          PreTag="div"
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';

// Memoized individual message component - ChatGPT style
// Only re-renders if message id, text, or isUser changes
const MessageItem = React.memo(({ message }: { message: Message }) => {
  const formattedContent = useMemo(() => formatMessageText(message.text), [message.text]);

  return (
    <div className={`group w-full overflow-x-hidden ${message.isUser ? '' : 'bg-gray-900'}`}>
      <div className={`${message.isUser ? 'max-w-5xl mx-auto px-4 py-6 w-full' : 'max-w-5xl mx-auto px-4 py-6 w-full'}`}>
        <div className={`${message.isUser ? 'flex justify-end' : 'w-full'}`}>
          {message.isUser ? (
            // User message - ChatGPT style (dark background, right-aligned, wraps text only)
            <div className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-100 break-words overflow-wrap-anywhere inline-block max-w-[80%]">
              <div className="text-[15px] leading-7 break-words overflow-wrap-anywhere">
                {parseMarkdown(message.text)}
              </div>
            </div>
          ) : (
            // AI message - ChatGPT style (clean, left-aligned)
            <div className="w-full">
              <div className="text-gray-100 break-words overflow-wrap-anywhere">
                <div className="space-y-2">
                  {formattedContent.parts.map((part, index) => (
                    <div key={index} className="break-words overflow-wrap-anywhere">
                      {part.type === 'code' ? (
                        <CodeBlock code={part.content} language={part.language} />
                      ) : (
                        <div className="text-gray-100 break-words overflow-wrap-anywhere">
                          {parseMarkdown(part.content)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if message id, text, or isUser changes
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.text === nextProps.message.text &&
    prevProps.message.isUser === nextProps.message.isUser
  );
});

MessageItem.displayName = 'MessageItem';

const MessageListComponent = React.memo(({ error }: MessageListComponentProps) => {
  const { state } = useAIState();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);

  // Memoized scroll function to prevent unnecessary re-renders
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Only scroll when a new message is added (length changes)
  // This prevents re-renders when other state changes
  useEffect(() => {
    if (state.messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
      prevMessagesLengthRef.current = state.messages.length;
    }
  }, [state.messages.length, scrollToBottom]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-900">
        {state.messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-2xl px-4">
              <h2 className="text-4xl font-semibold text-gray-100 mb-4">
                How can I help you today?
              </h2>
            </div>
          </div>
        )}
        
      <div className="pb-4 overflow-x-hidden">
          {state.messages.map((message: Message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
        
        {error && (
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="px-4 py-3 rounded-lg bg-red-900/20 text-red-400 text-sm border border-red-800">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
            </div>
          </div>
        )}
        
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
});

MessageListComponent.displayName = 'MessageListComponent';

export default MessageListComponent;
