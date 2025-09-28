"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFirebaseUser } from '@/hooks/use-firebase-user';
import './iframe-styles.css';

// Document Editor Component - embedded iframe
function DocumentEditor({ documentId, onClose }: { documentId: string; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Build editor URL using same domain
  const editorUrl = `/editor/documents/${documentId}`;

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Since it's same domain, we can be more permissive with origin check
      if (event.origin !== window.location.origin) return;
      
      switch (event.data.type) {
        case 'DOCUMENT_SAVED':
          console.log('Document saved:', event.data.content);
          break;
        case 'DOCUMENT_CLOSED':
          onClose?.();
          break;
        case 'AUTHENTICATION_REQUIRED':
          console.log('User needs to sign in');
          break;
        case 'EDITOR_LOADED':
          setIsLoading(false);
          break;
        case 'EDITOR_ERROR':
          setError(event.data.message || 'Editor failed to load');
          setIsLoading(false);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="document-editor-container h-screen w-full">
      <div className="relative h-full">
        {/* Close button for specific documents */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
          >
            Close
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading editor...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        <iframe
          src={editorUrl}
          className="w-full h-full border-0"
          title="Document Editor"
          onLoad={handleIframeLoad}
          style={{ display: isLoading ? 'none' : 'block' }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        />
      </div>
    </div>
  );
}

// HomePage component removed - now using embedded iframe integration

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

  // Show base editor by default (no document ID) - embedded iframe
  return (
    <div className="h-screen w-full">
      <div className="relative h-full">
        <iframe
          src="/editor"
          className="w-full h-full border-0"
          title="Document Editor"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        />
      </div>
    </div>
  );
}