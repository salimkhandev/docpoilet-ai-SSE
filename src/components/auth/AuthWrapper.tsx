"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import LoginComponent from "./LoginComponent";
import SignupComponent from "./SignupComponent";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showSignup ? (
      <SignupComponent onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <LoginComponent onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  return <>{children}</>;
}

