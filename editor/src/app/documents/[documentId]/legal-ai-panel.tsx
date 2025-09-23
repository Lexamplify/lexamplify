"use client";

import React from 'react';
import { Editor } from '@tiptap/react';
import { LegalAIEditor } from '@/components/legal-ai-editor';
import { useLegalAIEditor } from '@/hooks/use-legal-ai-editor';
import { LegalAITest } from '@/components/legal-ai-test';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Scale, FileText, Brain, AlertTriangle } from 'lucide-react';

interface LegalAIPanelProps {
  editor: Editor;
  className?: string;
}

export const LegalAIPanel: React.FC<LegalAIPanelProps> = ({ editor, className }) => {
  const {
    hasSelection,
    selectedText,
    selectionContext,
    lastResponse,
    executeCommand,
    undoLastEdit,
    getDocumentMetrics
  } = useLegalAIEditor(editor, {
    enableHistory: true,
    showConfidence: true,
    validateChanges: true,
    autoSave: false,
    onEditComplete: (response) => {
      console.log('Legal edit completed:', response);
    },
    onError: (error) => {
      console.error('Legal AI error:', error);
    }
  });

  const documentMetrics = getDocumentMetrics();

  return (
    <div className={`legal-ai-panel ${className || ''}`}>
      {/* Legal AI Editor Component */}
      <LegalAIEditor editor={editor} />

      {/* Additional Legal Analysis */}
      {selectionContext && (
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-sm">Selection Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Selected Text Preview */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Selected Text:</p>
              <div className="p-2 bg-gray-50 rounded text-sm max-h-20 overflow-y-auto">
                {selectedText || 'No text selected'}
              </div>
            </div>

            {/* Legal Elements */}
            {selectionContext.legalElements.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Legal Elements:</p>
                <div className="flex flex-wrap gap-1">
                  {selectionContext.legalElements.map((element, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {element}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Document Structure */}
            {selectionContext.documentStructure && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Document Structure:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Paragraphs:</span>
                    <span className="ml-1 font-medium">
                      {selectionContext.documentStructure.totalParagraphs || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Headings:</span>
                    <span className="ml-1 font-medium">
                      {selectionContext.documentStructure.totalHeadings || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Lists:</span>
                    <span className="ml-1 font-medium">
                      {selectionContext.documentStructure.totalLists || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tables:</span>
                    <span className="ml-1 font-medium">
                      {selectionContext.documentStructure.hasTables ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
          <CardDescription className="text-xs">
            Common legal editing tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => executeCommand('Rephrase this clause in formal legal language')}
              disabled={!hasSelection}
              className="text-left p-2 text-xs bg-blue-50 hover:bg-blue-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="font-medium">Rephrase Clause</div>
              <div className="text-gray-600">Make language more formal</div>
            </button>
            
            <button
              onClick={() => executeCommand('Strengthen the legal language and enforceability')}
              disabled={!hasSelection}
              className="text-left p-2 text-xs bg-green-50 hover:bg-green-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="font-medium">Strengthen Language</div>
              <div className="text-gray-600">Improve enforceability</div>
            </button>
            
            <button
              onClick={() => executeCommand('Simplify this clause for better readability')}
              disabled={!hasSelection}
              className="text-left p-2 text-xs bg-purple-50 hover:bg-purple-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="font-medium">Simplify Language</div>
              <div className="text-gray-600">Improve readability</div>
            </button>
            
            <button
              onClick={() => executeCommand('Remove redundant legal terms and phrases')}
              disabled={!hasSelection}
              className="text-left p-2 text-xs bg-orange-50 hover:bg-orange-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="font-medium">Remove Redundancy</div>
              <div className="text-gray-600">Clean up repetitive text</div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Document Metrics - Commented out as requested */}
      {/* {documentMetrics && (
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-sm">Document Metrics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Words:</span>
                <span className="font-medium">{documentMetrics.wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Characters:</span>
                <span className="font-medium">{documentMetrics.characterCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sentences:</span>
                <span className="font-medium">{documentMetrics.sentenceCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paragraphs:</span>
                <span className="font-medium">{documentMetrics.paragraphCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Last Response Summary */}
      {lastResponse && (
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-green-600" />
              <CardTitle className="text-sm">Last Edit Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Confidence:</span>
              <Badge 
                variant={
                  lastResponse.confidence >= 0.8 ? 'default' :
                  lastResponse.confidence >= 0.6 ? 'secondary' : 'destructive'
                }
              >
                {Math.round(lastResponse.confidence * 100)}%
              </Badge>
            </div>
            
            {lastResponse.changes.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Changes Made:</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  {lastResponse.changes.map((change, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lastResponse.warnings && lastResponse.warnings.length > 0 && (
              <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-yellow-800">Warnings:</p>
                  <ul className="text-xs text-yellow-700">
                    {lastResponse.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Debug Test Component - Commented out as requested */}
      {/* <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Debug Test</CardTitle>
          <CardDescription className="text-xs">
            Test Legal AI functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LegalAITest />
        </CardContent>
      </Card> */}

    </div>
  );
};
