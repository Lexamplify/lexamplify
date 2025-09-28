"use client";

import { useMainWebsiteAuth } from "@/hooks/use-main-website-auth";
import { useEffect, useState } from "react";
import { CheckCircle, X, AlertCircle } from "lucide-react";

export const MainWebsiteAuthNotification = () => {
  const { isAuthenticated, hasError, user, errorMessage, errorType, clearError } = useMainWebsiteAuth();
  const [showNotification, setShowNotification] = useState(false);
  const [hasShownNotification, setHasShownNotification] = useState(false);
  const [hasShownError, setHasShownError] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !hasShownNotification) {
      setShowNotification(true);
      setHasShownNotification(true);
      console.log('🎉 Editor showing success notification for main website login:', {
        user: user.email,
        displayName: user.displayName
      });
      
      // Hide the notification after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
        console.log('✅ Editor success notification auto-hidden');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, hasShownNotification]);

  useEffect(() => {
    if (hasError && errorMessage && !hasShownError) {
      setShowNotification(true);
      setHasShownError(true);
      console.log('🚨 Editor showing error notification for main website login failure:', {
        errorMessage,
        errorType
      });
      
      // Hide the error notification after 7 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
        console.log('❌ Editor error notification auto-hidden');
      }, 7000);
      
      return () => clearTimeout(timer);
    }
  }, [hasError, errorMessage, hasShownError]);

  if (!showNotification) return null;

  const isError = hasError && errorMessage;
  const isSuccess = isAuthenticated && user;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`${isError ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border rounded-lg p-4 shadow-lg`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {isError ? (
              <AlertCircle className="h-5 w-5 text-red-400" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-400" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${isError ? 'text-red-800' : 'text-green-800'}`}>
              {isError ? 'Authentication failed on main website' : 'Successfully logged in using the main website'}
            </h3>
            <p className={`mt-1 text-sm ${isError ? 'text-red-700' : 'text-green-700'}`}>
              {isError ? (
                <>
                  {errorMessage}
                  {errorType && (
                    <span className="block mt-1 text-xs opacity-75">
                      Error type: {errorType.replace('_', ' ')}
                    </span>
                  )}
                </>
              ) : (
                `Welcome back, ${user?.displayName || user?.email}! You can now access all editor features.`
              )}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => {
                setShowNotification(false);
                if (isError) {
                  clearError();
                  console.log('❌ Editor error notification manually dismissed');
                } else {
                  console.log('✅ Editor success notification manually dismissed');
                }
              }}
              className={`inline-flex ${isError ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'} focus:outline-none focus:ring-2 ${isError ? 'focus:ring-red-500' : 'focus:ring-green-500'} focus:ring-offset-2 rounded-md`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
