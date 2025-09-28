'use client';

import { useEffect, useState } from 'react';

export default function EditorProxy() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if editor is accessible
    fetch('http://localhost:3001/')
      .then(response => {
        if (response.ok) {
          // Editor is accessible, redirect to it
          window.location.href = 'http://localhost:3001/';
        } else {
          setError('Editor is not accessible. Please make sure the editor is running on port 3001.');
          setIsLoading(false);
        }
      })
      .catch(err => {
        setError('Editor is not accessible. Please make sure the editor is running on port 3001.');
        setIsLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#e74c3c' }}>Editor Not Available</h2>
        <p style={{ marginBottom: '20px' }}>{error}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={() => window.location.href = 'http://localhost:3001/'}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Try Direct Access
          </button>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2>Loading Editor...</h2>
      <p>Redirecting to editor application...</p>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '20px auto'
      }}></div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
