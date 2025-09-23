'use client';

import { useState, ChangeEvent } from 'react';

// Define a type for the Tiptap JSON structure.
// 'any' is used here for simplicity, but you can define a more specific interface.
type TiptapJSON = any;

export default function DocxUploader() {
  const [jsonContent, setJsonContent] = useState<TiptapJSON | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset state for the new upload
    setIsLoading(true);
    setError('');
    setJsonContent(null);
    setFileName(file.name);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch('/api/convert-docx', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Conversion failed on the server.');
      }

      const data: TiptapJSON = await response.json();
      console.log("🔍 DocxUploader - Converted JSON:", data);
      setJsonContent(data); // Store the successfully converted JSON
      
    } catch (err) {
      // Type assertion to handle the error message correctly
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">DOCX to Tiptap JSON Converter</h1>
      <p className="mb-6 text-gray-600">
        Upload a .docx file to convert its content and styles into the JSON format used by the Tiptap editor.
      </p>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition hover:border-indigo-500">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".docx"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500 transition-opacity ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Processing...' : 'Select a .docx file'}
        </label>
        {fileName && <p className="text-sm text-gray-500 mt-2">{fileName}</p>}
      </div>

      {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
      
      {jsonContent && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Conversion Successful!</h2>
          <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto max-h-96">
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(jsonContent, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
