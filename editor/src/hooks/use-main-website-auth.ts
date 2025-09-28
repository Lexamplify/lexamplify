"use client";

import { useState, useEffect } from 'react';

interface MainWebsiteAuth {
  isAuthenticated: boolean;
  user: {
    email: string | null;
    uid: string;
    displayName: string | null;
  };
  loginTime: number;
  loginMethod: 'email' | 'email_signup' | 'google';
  googleAccessToken?: string;
}

interface MainWebsiteAuthError {
  hasError: boolean;
  errorMessage: string;
  errorTime: number;
  errorType: 'email_login' | 'email_signup' | 'google_login';
}

export const useMainWebsiteAuth = () => {
  const [authData, setAuthData] = useState<MainWebsiteAuth | null>(null);
  const [errorData, setErrorData] = useState<MainWebsiteAuthError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMainWebsiteAuth = () => {
      try {
        // Check for authentication data
        const storedAuth = localStorage.getItem('mainWebsiteAuth');
        if (storedAuth) {
          const parsedAuth: MainWebsiteAuth = JSON.parse(storedAuth);
          
          // Check if the auth is still valid (not expired)
          const authAge = Date.now() - parsedAuth.loginTime;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (authAge < maxAge && parsedAuth.isAuthenticated) {
            setAuthData(parsedAuth);
            setErrorData(null); // Clear any previous errors
            console.log('✅ Editor detected main website authentication success:', {
              user: parsedAuth.user.email,
              method: parsedAuth.loginMethod,
              loginTime: new Date(parsedAuth.loginTime).toISOString()
            });
          } else {
            // Clear expired auth
            localStorage.removeItem('mainWebsiteAuth');
            setAuthData(null);
            console.log('⚠️ Editor cleared expired main website authentication');
          }
        } else {
          setAuthData(null);
        }

        // Check for error data
        const storedError = localStorage.getItem('mainWebsiteAuthError');
        if (storedError) {
          const parsedError: MainWebsiteAuthError = JSON.parse(storedError);
          
          // Check if the error is recent (within last 5 minutes)
          const errorAge = Date.now() - parsedError.errorTime;
          const maxErrorAge = 5 * 60 * 1000; // 5 minutes
          
          if (errorAge < maxErrorAge && parsedError.hasError) {
            setErrorData(parsedError);
            console.log('❌ Editor detected main website authentication failure:', {
              errorMessage: parsedError.errorMessage,
              errorType: parsedError.errorType,
              errorTime: new Date(parsedError.errorTime).toISOString()
            });
          } else {
            // Clear old errors
            localStorage.removeItem('mainWebsiteAuthError');
            setErrorData(null);
            console.log('⚠️ Editor cleared old main website authentication error');
          }
        } else {
          setErrorData(null);
        }
      } catch (error) {
        console.error('Error checking main website auth:', error);
        setAuthData(null);
        setErrorData(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkMainWebsiteAuth();

    // Listen for storage changes (when user logs in from main website)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mainWebsiteAuth' || e.key === 'mainWebsiteAuthError') {
        checkMainWebsiteAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case of same-tab updates
    const interval = setInterval(checkMainWebsiteAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('mainWebsiteAuth');
    setAuthData(null);
  };

  const clearError = () => {
    localStorage.removeItem('mainWebsiteAuthError');
    setErrorData(null);
  };

  return {
    authData,
    errorData,
    isLoading,
    isAuthenticated: authData?.isAuthenticated || false,
    hasError: errorData?.hasError || false,
    user: authData?.user || null,
    loginMethod: authData?.loginMethod || null,
    errorMessage: errorData?.errorMessage || null,
    errorType: errorData?.errorType || null,
    clearAuth,
    clearError
  };
};
