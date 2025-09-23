'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Editor } from '@/app/documents/[documentId]/editor';
import { FullscreenLoader } from './fullscreen-loader';

interface ClerkEmbeddableEditorProps {
  documentId: string;
  clerkSessionToken: string;
  onSave?: (content: string) => void;
  onClose?: () => void;
}

export function ClerkEmbeddableEditor({ 
  documentId, 
  onSave, 
  onClose 
}: ClerkEmbeddableEditorProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const [document, setDocument] = useState<{
    id: string;
    title: string;
    content: string;
    ownerId: string;
    organizationId?: string;
    clerkUserId: string;
    userInfo: {
      name: string;
      email?: string;
      avatar?: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    const fetchDocument = async () => {
      try {
        const response = await fetch(
          `/api/documents/external?id=${documentId}`
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch document: ${errorText}`);
        }
        
        const doc = await response.json();
        setDocument(doc);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, isLoaded, isSignedIn]);

  if (loading) return <FullscreenLoader label="Loading document..." />;
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Document Not Found</h2>
          <p className="text-gray-600">The requested document could not be found or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <Editor 
        initialContent={document.content}
        onSave={onSave}
        onClose={onClose}
      />
    </div>
  );
}




