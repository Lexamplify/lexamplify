"use client";

import { useState } from "react";
import { X, User, Mail, Calendar, Key, CheckCircle } from "lucide-react";
import { useMainWebsiteAuth } from "@/hooks/use-main-website-auth";

interface UserDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetailsPopup = ({ isOpen, onClose }: UserDetailsPopupProps) => {
  const { authData, user, loginMethod, clearAuth } = useMainWebsiteAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Log when popup opens and what data is available
  console.log('🔍 User Details Popup opened with data:', {
    hasAuthData: !!authData,
    hasUser: !!user,
    userEmail: user?.email,
    loginMethod,
    authDataKeys: authData ? Object.keys(authData) : []
  });

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate a refresh by checking localStorage again
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    clearAuth();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {authData && user ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                  <CheckCircle className="h-4 w-4" />
                  Authentication Status: Active
                </div>
                <p className="text-sm text-green-700">
                  Successfully authenticated from main website
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user.email || 'Not available'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Display Name</p>
                    <p className="font-medium">{user.displayName || 'Not available'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Key className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="font-medium text-xs font-mono">{user.uid}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Login Method</p>
                    <p className="font-medium capitalize">
                      {loginMethod?.replace('_', ' ') || 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Login Time</p>
                    <p className="font-medium">
                      {authData.loginTime ? new Date(authData.loginTime).toLocaleString() : 'Not available'}
                    </p>
                  </div>
                </div>

                {authData.googleAccessToken && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Key className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-blue-600">Google Access Token</p>
                      <p className="font-medium text-xs font-mono">
                        {authData.googleAccessToken.substring(0, 20)}...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No User Data</h3>
              <p className="text-gray-600 mb-4">
                No authentication data found. Please log in from the main website first.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
