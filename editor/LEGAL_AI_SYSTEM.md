# Legal AI Document Editing System

A comprehensive AI-powered document editing system designed specifically for legal professionals. This system enables lawyers to edit documents through natural language commands while maintaining legal accuracy, enforceability, and document integrity.

## 🎯 Key Features

### Legal-Aware AI Processing
- **Preserves Legal Accuracy**: Maintains original legal meaning, obligations, and enforceability
- **Professional Legal Language**: Uses formal, professional legal tone appropriate for contracts, agreements, and briefs
- **No Speculative Content**: Avoids adding creative or non-legal information
- **Valid JSON Output**: Always returns valid TipTap/ProseMirror JSON conforming to schema

### Smart Document Analysis
- **Legal Element Detection**: Automatically identifies legal terms, phrases, and concepts
- **Document Type Recognition**: Detects contracts, briefs, motions, and other legal document types
- **Context-Aware Editing**: Considers surrounding text and document structure
- **Confidence Scoring**: Provides confidence levels for AI-generated changes

### Seamless Editor Integration
- **TipTap/ProseMirror Compatible**: Works with modern rich text editors
- **Real-time Processing**: Instant AI-powered document editing
- **Undo/Redo Support**: Full history tracking and restoration
- **Validation**: Ensures document integrity after changes

## 🏗️ System Architecture

### Frontend Components

#### 1. Legal AI Service (`src/lib/legal-ai-service.ts`)
- Core AI processing logic
- Legal prompt construction
- Response validation and confidence scoring
- Predefined legal commands

#### 2. JSON Extractor (`src/lib/json-extractor.ts`)
- Extracts selected content as JSON
- Provides document context
- Detects legal elements and document types
- Validates extracted content

#### 3. Editor Integration (`src/lib/editor-integration.ts`)
- Bridges AI service with TipTap editor
- Handles change application
- Manages edit history
- Provides validation and error handling

#### 4. React Hooks (`src/hooks/use-legal-ai-editor.ts`)
- Easy integration with React components
- State management for AI editing
- Quick command shortcuts
- Document analysis utilities

#### 5. UI Components
- **LegalAIEditor**: Main editing interface
- **LegalAIPanel**: Sidebar panel for legal editing
- **DocumentWithLegalAI**: Complete document editor with AI integration

## 🚀 Quick Start

### 1. Basic Integration

```tsx
import { useLegalAIEditor } from '@/hooks/use-legal-ai-editor';
import { Editor } from '@tiptap/react';

function MyDocumentEditor({ editor }: { editor: Editor }) {
  const {
    executeCommand,
    hasSelection,
    selectedText,
    isProcessing
  } = useLegalAIEditor(editor);

  const handleRephrase = async () => {
    if (hasSelection) {
      await executeCommand('Rephrase this clause in formal legal language');
    }
  };

  return (
    <div>
      <button onClick={handleRephrase} disabled={!hasSelection}>
        Rephrase Selected Text
      </button>
    </div>
  );
}
```

### 2. Complete Document Editor

```tsx
import { DocumentWithLegalAI } from '@/app/documents/[documentId]/document-with-legal-ai';

function LegalDocumentPage() {
  return (
    <DocumentWithLegalAI 
      initialContent={yourDocumentContent}
      documentId="legal-doc-123"
    />
  );
}
```

### 3. Custom Legal Commands

```tsx
const { executeCommand } = useLegalAIEditor(editor);

// Predefined commands
await executeCommand('Rephrase this clause in formal legal language');
await executeCommand('Strengthen the legal language and enforceability');
await executeCommand('Simplify this clause for better readability');
await executeCommand('Add a bullet point on jurisdictional limitations');
await executeCommand('Remove redundant legal terms and phrases');

// Custom commands
await executeCommand('Add a force majeure clause to this section');
await executeCommand('Make this termination clause more specific');
```

## 📋 Available Legal Commands

### Predefined Commands

1. **Rephrase Clause**
   - Makes language more formal and legally precise
   - Example: "Rephrase this clause in formal contract language"

2. **Strengthen Language**
   - Improves enforceability and legal strength
   - Example: "Strengthen the legal language and enforceability"

3. **Simplify Language**
   - Improves readability while maintaining legal accuracy
   - Example: "Simplify this clause for better readability"

4. **Add Bullet Point**
   - Adds structured legal content
   - Example: "Add a bullet point on jurisdictional limitations"

5. **Summarize Section**
   - Creates concise summaries for client briefings
   - Example: "Summarize this section for client briefing"

6. **Remove Redundancy**
   - Cleans up repetitive legal terms
   - Example: "Remove redundant legal terms and phrases"

### Custom Commands
You can create any custom legal command. The AI will interpret and execute it while maintaining legal accuracy.

## 🔧 Configuration Options

### Editor Integration Options

```typescript
const options = {
  enableHistory: true,        // Track edit history
  showConfidence: true,      // Display confidence scores
  validateChanges: true,     // Validate changes before applying
  autoSave: false,          // Auto-save after changes
  onEditComplete: (response) => {
    console.log('Edit completed:', response);
  },
  onError: (error) => {
    console.error('Edit error:', error);
  }
};
```

### Legal AI Service Configuration

```typescript
// Customize the legal system role
const customSystemRole = {
  role: "Your custom legal assistant role",
  rules: [
    "Your custom rules",
    "Additional legal requirements"
  ],
  outputFormat: "Custom output format"
};
```

## 📊 Document Analysis Features

### Legal Element Detection
The system automatically detects and highlights:
- Legal terms and phrases
- Contractual language
- Jurisdictional references
- Liability and damage clauses
- Confidentiality terms
- Termination conditions

### Document Metrics
- Word count and character count
- Sentence and paragraph analysis
- Legal complexity scoring
- Document structure analysis

### Confidence Scoring
- High confidence (80%+): Reliable changes
- Medium confidence (60-79%): Good changes with minor warnings
- Low confidence (<60%): Requires review

## 🛡️ Legal Safety Features

### Content Validation
- Preserves original legal meaning
- Maintains enforceability
- Validates JSON structure
- Checks for legal integrity

### Error Handling
- Graceful fallback for failed edits
- Comprehensive error logging
- User-friendly error messages
- Undo/redo support

### History Tracking
- Complete edit history
- Before/after comparisons
- Command tracking
- Restore functionality

## 🔌 Integration with Existing Systems

### TipTap Editor
```typescript
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const editor = useEditor({
  extensions: [StarterKit],
  content: '<p>Your legal document...</p>',
});
```

### Convex Integration
```typescript
// Auto-save to Convex
const options = {
  autoSave: true,
  onEditComplete: async (response) => {
    await convex.mutation(api.documents.update, {
      id: documentId,
      content: editor.getJSON()
    });
  }
};
```

### Custom AI Services
```typescript
// Replace the mock AI service with your preferred LLM
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Implement in legal-ai-service.ts
```

## 📁 File Structure

```
src/
├── lib/
│   ├── legal-ai-service.ts      # Core AI processing
│   ├── json-extractor.ts        # Content extraction
│   └── editor-integration.ts    # Editor integration
├── hooks/
│   └── use-legal-ai-editor.ts   # React hooks
├── components/
│   └── legal-ai-editor.tsx      # Main UI component
└── app/documents/[documentId]/
    ├── legal-ai-panel.tsx       # Sidebar panel
    └── document-with-legal-ai.tsx # Complete editor
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install @tiptap/react @tiptap/starter-kit
   ```

2. **Import Components**
   ```tsx
   import { LegalAIEditor } from '@/components/legal-ai-editor';
   import { useLegalAIEditor } from '@/hooks/use-legal-ai-editor';
   ```

3. **Integrate with Your Editor**
   ```tsx
   <LegalAIEditor editor={yourEditor} />
   ```

4. **Configure AI Service**
   - Replace mock AI service with your preferred LLM
   - Configure legal system roles
   - Set up validation rules

## 🔮 Future Enhancements

- **Multi-language Support**: Legal documents in different languages
- **Template Integration**: Pre-built legal document templates
- **Collaborative Editing**: Real-time collaborative legal editing
- **Advanced Analytics**: Document complexity and risk analysis
- **Compliance Checking**: Automatic compliance validation
- **Citation Management**: Legal citation formatting and validation

## 📞 Support

For questions, issues, or feature requests related to the Legal AI system, please refer to the main project documentation or create an issue in the repository.

---

**Note**: This system is designed for legal professionals and should be used in conjunction with proper legal review and validation processes.
