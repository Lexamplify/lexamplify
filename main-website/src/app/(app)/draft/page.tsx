"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFirebaseUser } from '@/hooks/use-firebase-user';

// Document Editor Component - now using direct navigation
function DocumentEditor({ documentId, onClose }: { documentId: string; onClose: () => void }) {
  const router = useRouter();
  
  // Navigate to editor with document ID
  useEffect(() => {
    const editorUrl = `/editor/documents/${documentId}`;
    router.push(editorUrl);
  }, [documentId, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Redirecting to editor...</p>
        <button 
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// HomePage component removed - now using direct navigation to editor

// Main Draft Page
export default function DraftPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useFirebaseUser();

  // Get document ID from URL query parameter
  const documentId = searchParams?.get('doc') || null;
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(documentId);

  // handleOpenDocument function removed - no longer needed

  // Handle closing the editor
  const handleCloseEditor = () => {
    setCurrentDocumentId(null);
    // Clear URL parameters
    const url = new URL(window.location.href);
    url.searchParams.delete('doc');
    window.history.pushState({}, '', url.toString());
  };

  // Check for document ID in URL on page load
  useEffect(() => {
    if (documentId && documentId !== currentDocumentId) {
      setCurrentDocumentId(documentId);
    }
  }, [documentId, currentDocumentId]);

  // Show loading state while Firebase auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access the document editor</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show document editor if document ID is present
  if (currentDocumentId) {
    return (
      <DocumentEditor 
        documentId={currentDocumentId} 
        onClose={handleCloseEditor}
      />
    );
  }

  // Show base editor by default (no document ID) - redirect to editor
  useEffect(() => {
    router.push('/editor');
  }, [router]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Redirecting to editor...</p>
      </div>
    </div>
  );
}