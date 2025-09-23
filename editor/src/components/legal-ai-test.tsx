"use client";

import { useState } from 'react';
import { LegalAIService } from '@/lib/legal-ai-service';

export const LegalAITest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testLegalAI = async () => {
    setIsLoading(true);
    setTestResult('Testing Legal AI...\n');

    try {
      // Test with a simple legal document snippet
      const testJson = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            attrs: { lineHeight: "1.5", textAlign: "left" },
            content: [
              {
                type: "text",
                text: "The parties agree to work together on this project.",
                marks: []
              }
            ]
          }
        ]
      };

      const result = await LegalAIService.processLegalCommand({
        selectedJsonSlice: testJson,
        userCommand: "Rephrase this clause in formal legal language",
        documentContext: "Contract Agreement",
        documentType: "contract"
      });

      setTestResult(prev => prev + `✅ Legal AI Test Result:\n${JSON.stringify(result, null, 2)}\n`);
    } catch (error) {
      setTestResult(prev => prev + `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Legal AI Test</h3>
      <button
        onClick={testLegalAI}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Legal AI'}
      </button>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Test Result:</h4>
        <pre className="bg-white p-3 rounded border text-sm overflow-auto max-h-96">
          {testResult || 'Click "Test Legal AI" to run a test...'}
        </pre>
      </div>
    </div>
  );
};
