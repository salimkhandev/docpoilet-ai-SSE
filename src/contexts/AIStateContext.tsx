"use client";
import React, { createContext, ReactNode, useContext, useReducer } from "react";

// 🧩 Types
interface Message {
  id: string;
  text: string;
  createdAt: Date;
  isUser?: boolean;
}

interface AIState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  htmlContent: string | null;
  htmlUpdateCount: number; // ✅ new counter to track changes
}

type AIAction =
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "APPEND_MESSAGE"; payload: Message }
  | { type: "DELETE_MESSAGE"; payload: string }
  | { type: "CLEAR_MESSAGES" }
  | { type: "GENERATE_START" }
  | {
      type: "GENERATE_SUCCESS";
      payload: {
        id: string;
        name: string;
        html: string;
        css: string;
        jsx: string;
        createdAt: Date;
      };
    }
  | { type: "GENERATE_ERROR"; payload: string }
  | { type: "SET_HTML_CONTENT"; payload: string };

// 🧠 Initial state
const initialState: AIState = {
  messages: [],
  isLoading: false,
  error: null,
  htmlContent: null,
  htmlUpdateCount: 0, // ✅
};

// Helper function to evaluate and replace JavaScript template expressions in HTML
const evaluateTemplateExpressions = (html: string): string => {
  if (!html || typeof html !== 'string') return html;
  
  let processedHtml = html;
  
  // Replace {new Date().toLocaleDateString()} with actual date
  processedHtml = processedHtml.replace(
    /\{new Date\(\)\.toLocaleDateString\(\)\}/g,
    new Date().toLocaleDateString()
  );
  
  // Replace {new Date().toLocaleString()} with actual date/time
  processedHtml = processedHtml.replace(
    /\{new Date\(\)\.toLocaleString\(\)\}/g,
    new Date().toLocaleString()
  );
  
  // Replace {new Date().toISOString()} with actual ISO date
  processedHtml = processedHtml.replace(
    /\{new Date\(\)\.toISOString\(\)\}/g,
    new Date().toISOString()
  );
  
  // Replace {new Date().getFullYear()} with actual year
  processedHtml = processedHtml.replace(
    /\{new Date\(\)\.getFullYear\(\)\}/g,
    new Date().getFullYear().toString()
  );
  
  // Replace {Date.now()} with actual timestamp
  processedHtml = processedHtml.replace(
    /\{Date\.now\(\)\}/g,
    Date.now().toString()
  );
  
  // Replace template literal expressions like ${new Date().toLocaleDateString()}
  processedHtml = processedHtml.replace(
    /\$\{new Date\(\)\.toLocaleDateString\(\)\}/g,
    new Date().toLocaleDateString()
  );
  
  processedHtml = processedHtml.replace(
    /\$\{new Date\(\)\.toLocaleString\(\)\}/g,
    new Date().toLocaleString()
  );
  
  return processedHtml;
};

// ⚙️ Reducer
const aiReducer = (state: AIState, action: AIAction): AIState => {
  switch (action.type) {
    case "SET_MESSAGES": {
      let htmlContent = state.htmlContent;
      let htmlUpdateCount = state.htmlUpdateCount;

      for (const message of action.payload) {
        console.log(
          // "message🟢🟢🟢🟢🟢🟢 Set messages context reducer",
          action.payload,
        );
        // console.log("message.text", message.text);

        const htmlPattern =
          /```html\s*([\s\S]*?)```|<!DOCTYPE\s+html[\s\S]*?<\/html>|<html[\s\S]*?<\/html>/i;
        const htmlMatch = message.text.match(htmlPattern);

        if (htmlMatch) {
          let newHtml = (htmlMatch[1] || htmlMatch[0]).trim();
          
          // Evaluate template expressions before storing
          newHtml = evaluateTemplateExpressions(newHtml);

          if (newHtml !== htmlContent) {
            htmlContent = newHtml;
            htmlUpdateCount += 1; // ✅ increase whenever new HTML is found
          }
        }
      }

      return {  
        ...state,
        messages: action.payload,
        htmlContent,
        htmlUpdateCount,
      };
    }

    case "APPEND_MESSAGE": {
      // Check if message already exists to avoid duplicates
      const messageExists = state.messages.some(msg => msg.id === action.payload.id);
      if (messageExists) {
        return state;
      }

      // Process HTML if present in the new message
      let htmlContent = state.htmlContent;
      let htmlUpdateCount = state.htmlUpdateCount;

      const htmlPattern =
        /```html\s*([\s\S]*?)```|<!DOCTYPE\s+html[\s\S]*?<\/html>|<html[\s\S]*?<\/html>/i;
      const htmlMatch = action.payload.text.match(htmlPattern);

      if (htmlMatch) {
        let newHtml = (htmlMatch[1] || htmlMatch[0]).trim();
        newHtml = evaluateTemplateExpressions(newHtml);

        if (newHtml !== htmlContent) {
          htmlContent = newHtml;
          htmlUpdateCount += 1;
        }
      }

      return {
        ...state,
        messages: [...state.messages, action.payload],
        htmlContent,
        htmlUpdateCount,
      };
    }

    case "DELETE_MESSAGE":
      return {
        ...state,
        messages: state.messages.filter((msg) => msg.id !== action.payload),
      };

    case "CLEAR_MESSAGES":
      return { ...state, messages: [], htmlContent: null, htmlUpdateCount: 0 };

    case "GENERATE_START":
      return { ...state, isLoading: true, error: null };

    case "GENERATE_SUCCESS":
      return { ...state, isLoading: false, error: null };

    case "GENERATE_ERROR":
      return { ...state, isLoading: false, error: action.payload };

    case "SET_HTML_CONTENT":
      return {
        ...state,
        htmlContent: evaluateTemplateExpressions(action.payload),
        htmlUpdateCount: state.htmlUpdateCount + 1,
      };

    default:
      return state;
  }
};

// 🧩 Context
const AIContext = createContext<{
  state: AIState;
  dispatch: React.Dispatch<AIAction>;
} | null>(null);

// 🧠 Provider
export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(aiReducer, initialState);
  return (
    <AIContext.Provider value={{ state, dispatch }}>
      {children}
    </AIContext.Provider>
  );
};

// 🎣 Custom hook
export const useAIState = () => {
  const context = useContext(AIContext);
  if (!context) throw new Error("useAIState must be used within an AIProvider");
  return context;
};
