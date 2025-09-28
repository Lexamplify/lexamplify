'use client';

import { useEffect } from 'react';

export default function EditorPage() {
  useEffect(() => {
    // Redirect to the editor application
    window.location.href = 'http://localhost:3001/';
  }, []);

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2>Redirecting to Editor...</h2>
      <p>Please wait while we redirect you to the editor application.</p>
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
