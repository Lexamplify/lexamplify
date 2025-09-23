"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { EditorIntegration, LegalEditCommand } from '@/lib/editor-integration';
import { LegalEditResponse } from '@/lib/legal-ai-service';
import { SelectionContext } from '@/lib/json-extractor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  Brain, 
  Wand2, 
  History, 
  Undo, 
  Redo, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  FileText,
  Scale,
  Gavel
} from 'lucide-react';
import { toast } from 'sonner';

interface LegalAIEditorProps {
  editor: Editor;
  className?: string;
}

export const LegalAIEditor: React.FC<LegalAIEditorProps> = ({ editor, className }) => {
  const [integration, setIntegration] = useState<EditorIntegration | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<string>('');
  const [customCommand, setCustomCommand] = useState('');
  const [selectionContext, setSelectionContext] = useState<SelectionContext | null>(null);
  const [lastResponse, setLastResponse] = useState<LegalEditResponse | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showConfidence, setShowConfidence] = useState(true);

  // Initialize editor integration
  useEffect(() => {
    if (editor) {
      const editorIntegration = new EditorIntegration(editor, {
        enableHistory: true,
        showConfidence: true,
        validateChanges: true,
        autoSave: false
      });
      setIntegration(editorIntegration);
    }
  }, [editor]);

  // Update selection context when selection changes
  useEffect(() => {
    if (integration) {
      const context = integration.getSelectionContext();
      setSelectionContext(context);
    }
  }, [integration, editor?.state.selection]);

  // Get available legal commands
  const legalCommands = integration?.getLegalCommands() || [];

  // Handle command execution
  const handleExecuteCommand = useCallback(async () => {
    if (!integration || !integration.hasSelection()) {
      toast.error('Please select text to edit');
      return;
    }

    const command = selectedCommand === 'custom' ? customCommand : selectedCommand;
    if (!command.trim()) {
      toast.error('Please enter a command');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await integration.processLegalCommand(command);
      setLastResponse(response);
      
      if (response) {
        toast.success('Document updated successfully');
        
        if (showConfidence && response.confidence < 0.7) {
          toast.warning(`Low confidence: ${Math.round(response.confidence * 100)}%`);
        }
      }
    } catch (error) {
      console.error('Error executing command:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to execute command');
    } finally {
      setIsProcessing(false);
    }
  }, [integration, selectedCommand, customCommand, showConfidence]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (integration?.undoLastEdit()) {
      toast.success('Last edit undone');
    } else {
      toast.error('No edits to undo');
    }
  }, [integration]);

  // Get document metrics
  const documentMetrics = integration?.getDocumentMetrics();

  return (
    <div className={`legal-ai-editor ${className || ''}`}>
      {/* Main Legal AI Panel */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Legal AI Assistant</CardTitle>
            <Badge variant="outline" className="ml-auto">
              <Scale className="h-3 w-3 mr-1" />
              Legal Mode
            </Badge>
          </div>
          <CardDescription>
            Select text and use AI commands to edit legal documents with precision
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Selection Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">
                {selectionContext ? 'Text Selected' : 'No Selection'}
              </span>
            </div>
            {selectionContext && (
              <Badge variant="secondary">
                {selectionContext.selectedText.length} characters
              </Badge>
            )}
          </div>

          {/* Legal Commands */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Legal Commands</span>
            </div>
            
            <Select value={selectedCommand} onValueChange={setSelectedCommand}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a legal command..." />
              </SelectTrigger>
              <SelectContent>
                {legalCommands.map((command) => (
                  <SelectItem key={command.id} value={command.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{command.label}</span>
                      <span className="text-xs text-gray-500">{command.description}</span>
                    </div>
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom Command</SelectItem>
              </SelectContent>
            </Select>

            {selectedCommand === 'custom' && (
              <Textarea
                placeholder="Enter your custom legal command..."
                value={customCommand}
                onChange={(e) => setCustomCommand(e.target.value)}
                className="min-h-[80px]"
              />
            )}

            {selectedCommand && selectedCommand !== 'custom' && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Example:</strong> {legalCommands.find(c => c.id === selectedCommand)?.example}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleExecuteCommand}
              disabled={!integration?.hasSelection() || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Gavel className="h-4 w-4 mr-2" />
                  Execute Command
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleUndo}
              disabled={!integration}
            >
              <Undo className="h-4 w-4" />
            </Button>
          </div>

          {/* Last Response Details */}
          {lastResponse && (
            <div className="space-y-2">
              <Separator />
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-sm">Last Edit Results</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Confidence:</span>
                  <span className={`ml-2 font-medium ${
                    lastResponse.confidence >= 0.8 ? 'text-green-600' :
                    lastResponse.confidence >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {Math.round(lastResponse.confidence * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Changes:</span>
                  <span className="ml-2 font-medium">{lastResponse.changes.length}</span>
                </div>
              </div>

              {lastResponse.warnings && lastResponse.warnings.length > 0 && (
                <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Warnings:</p>
                    <ul className="list-disc list-inside text-yellow-700">
                      {lastResponse.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {lastResponse.changes.length > 0 && (
                <div className="text-sm">
                  <span className="text-gray-600">Changes made:</span>
                  <ul className="list-disc list-inside text-gray-700 mt-1">
                    {lastResponse.changes.map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Document Metrics */}
          {documentMetrics && (
            <div className="space-y-2">
              <Separator />
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-sm">Document Metrics</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Words:</span>
                  <span className="ml-2 font-medium">{documentMetrics.wordCount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Characters:</span>
                  <span className="ml-2 font-medium">{documentMetrics.characterCount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Sentences:</span>
                  <span className="ml-2 font-medium">{documentMetrics.sentenceCount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Paragraphs:</span>
                  <span className="ml-2 font-medium">{documentMetrics.paragraphCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Legal Elements */}
          {selectionContext && selectionContext.legalElements.length > 0 && (
            <div className="space-y-2">
              <Separator />
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Legal Elements Detected</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {selectionContext.legalElements.map((element, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {element}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* History Dialog */}
          <Dialog open={showHistory} onOpenChange={setShowHistory}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <History className="h-4 w-4 mr-2" />
                View Edit History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit History</DialogTitle>
                <DialogDescription>
                  View and restore previous edits. Select text in your document and click "Restore" to replace the selected content with the previous version.
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {integration?.getHistory().map((edit, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{edit.command}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(edit.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            try {
                              // Restore this edit
                              integration?.restoreEdit(edit.before);
                              setShowHistory(false);
                              // You could add a toast notification here if you have one
                              console.log('✅ Edit restored successfully');
                            } catch (error) {
                              console.error('❌ Failed to restore edit:', error);
                              // You could add an error toast here if you have one
                            }
                          }}
                        >
                          Restore
                        </Button>
                      </div>
                    </Card>
                  ))}
                  
                  {(!integration?.getHistory() || integration.getHistory().length === 0) && (
                    <p className="text-center text-gray-500 py-8">No edit history available</p>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};
