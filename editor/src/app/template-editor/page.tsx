"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { templates } from "@/constants/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, EditIcon } from "lucide-react";
import { processTemplateContentForConvex } from "@/lib/template-processor";
import DocxUploader from "@/components/DocxUploader";

export default function TemplateEditor() {
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");


  const createTemplateDocument = async (template: { label: string; initialContent: string | object }) => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      // Convert template content to string if it's an object
      const contentString = typeof template.initialContent === 'string' 
        ? template.initialContent 
        : JSON.stringify(template.initialContent);
      
      // Process the template content to handle JSON format for Convex storage
      const processedContent = processTemplateContentForConvex(contentString);
      
      // Ensure we always pass a string to Convex
      const contentForConvex = typeof processedContent === 'string' ? processedContent : JSON.stringify(processedContent);
      
      const documentId = await create({
        title: `${template.label} - Template Editor`,
        initialContent: contentForConvex,
      });

      toast.success("Template editor opened");
      router.push(`/documents/${documentId}`);
    } catch (error) {
      console.error("Error creating template document:", error);
      toast.error("Failed to create template document");
    } finally {
      setIsCreating(false);
    }
  };

  const createBlankTemplate = async () => {
    if (!newTemplateName.trim() || isCreating) return;
    
    setIsCreating(true);
    try {
      const documentId = await create({
        title: `${newTemplateName} - Template Editor`,
        initialContent: `<h1 style="text-align: center;">${newTemplateName}</h1><p>Start editing your template here...</p>`,
      });

      toast.success("New template created");
      router.push(`/documents/${documentId}`);
      setNewTemplateName("");
    } catch (error) {
      console.error("Error creating new template:", error);
      toast.error("Failed to create new template");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Editor</h1>
          <p className="text-gray-600">
            Edit existing templates or create new ones with rich formatting, alignment, and styling.
          </p>
          <DocxUploader />
        </div>

        {/* Create New Template */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusIcon className="size-5" />
              Create New Template
            </CardTitle>
            <CardDescription>
              Start with a blank template and add your own formatting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Template name (e.g., Legal Notice, Invoice Template)"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={createBlankTemplate}
                disabled={!newTemplateName.trim() || isCreating}
              >
                Create Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EditIcon className="size-5" />
              Edit Existing Templates
            </CardTitle>
            <CardDescription>
              Modify existing templates to add formatting, alignment, colors, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates
                .filter(template => template.id !== "blank")
                .map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => createTemplateDocument(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <EditIcon className="size-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{template.label}</h3>
                        <p className="text-sm text-gray-500">Click to edit formatting</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use the Template Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">✨ Available Formatting Options:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• <strong>Text Alignment:</strong> Left, Center, Right, Justify</li>
                <li>• <strong>Text Styling:</strong> Bold, Italic, Underline, Colors</li>
                <li>• <strong>Typography:</strong> Font family, Font size, Line height</li>
                <li>• <strong>Structure:</strong> Headings, Lists, Tables, Links</li>
                <li>• <strong>Layout:</strong> Margins, Spacing, Text direction</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🎯 Template Usage:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Edit templates with full formatting preserved</li>
                <li>• All changes are saved automatically</li>
                <li>• Use templates to create new documents with pre-formatted content</li>
                <li>• Export formatted documents as JSON to preserve all styling</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
