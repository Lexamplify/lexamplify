# Template Search Integration Setup

This document explains how to set up the template search functionality that integrates with your Firestore collection "docTemplate".

## Overview

The search functionality allows users to search for templates from your Firestore collection and create documents from them. The search results are displayed in the same format as the regular templates gallery.

## Files Added/Modified

### New Files:
1. `src/lib/template-search-service.ts` - Service for handling template search API calls
2. `src/app/(home)/template-search-results.tsx` - Component for displaying search results
3. `TEMPLATE_SEARCH_SETUP.md` - This documentation file

### Modified Files:
1. `src/app/(home)/templates-gallery.tsx` - Added search functionality

## Setup Instructions

### 1. Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
NEXT_PUBLIC_SEARCH_TEMPLATES_API_URL=https://your-api-endpoint.com/search-templates
```

### 2. API Endpoint

You need to create an API endpoint that:
- Accepts POST requests with a JSON body containing `{ query: string }`
- Searches your Firestore "docTemplate" collection
- Returns results in the following format:

```typescript
{
  results: [
    {
      id: string,           // Document ID from Firestore
      name: string,         // Template name
      description: string,  // Template description
      storageUrl: string    // URL to the template content (optional)
    }
  ]
}
```

### 3. Firestore Collection Structure

Your "docTemplate" collection should have documents with the following structure:

```typescript
{
  id: string,              // Document ID
  name: string,            // Template name
  description: string,     // Template description
  content?: string,        // Template content (HTML or TipTap JSON)
  storageUrl?: string,     // URL to template file (optional)
  // ... other fields
}
```

### 4. API Implementation Example

Here's an example of how to implement the search API endpoint:

```typescript
// pages/api/search-templates.ts (or your API route)
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase'; // Your Firebase config

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Search in Firestore
    const templatesRef = db.collection('docTemplate');
    const snapshot = await templatesRef
      .where('name', '>=', query)
      .where('name', '<=', query + '\uf8ff')
      .limit(20)
      .get();

    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      storageUrl: doc.data().storageUrl || doc.data().content
    }));

    res.status(200).json({ results });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Features

### Search Functionality
- **Real-time search**: Users can type and search for templates
- **Loading states**: Shows loading spinner while searching
- **Error handling**: Displays appropriate error messages
- **Clear search**: Users can clear search and return to regular templates

### Template Creation
- **Content fetching**: If a template has a `storageUrl`, it fetches the actual content
- **Format detection**: Automatically detects if content is TipTap JSON or HTML
- **Fallback content**: Creates basic content if fetching fails
- **Document creation**: Creates a new document in your Convex database

### UI/UX
- **Consistent design**: Search results match the regular templates gallery design
- **Responsive layout**: Works on all screen sizes
- **Accessibility**: Proper keyboard navigation and screen reader support

## Usage

1. Users see the regular templates gallery by default
2. They can type in the search box to search for templates
3. Search results are displayed in the same carousel format
4. Users can click on any search result to create a document
5. They can clear the search to return to regular templates

## Customization

### Styling
- Modify the styles in `template-search-results.tsx` to match your design
- Update the search input styling in `templates-gallery.tsx`

### Search Logic
- Modify `TemplateSearchService.searchTemplates()` to change how search works
- Update the API endpoint to implement different search algorithms

### Content Processing
- Modify the `onTemplateClick` function in `template-search-results.tsx` to handle different content types
- Update the content fetching logic based on your storage solution

## Troubleshooting

### Common Issues

1. **Search not working**: Check that `NEXT_PUBLIC_SEARCH_TEMPLATES_API_URL` is set correctly
2. **No results**: Verify your Firestore collection structure and search query
3. **Content not loading**: Check that `storageUrl` is accessible and returns valid content
4. **CORS errors**: Ensure your API endpoint allows requests from your domain

### Debug Tips

1. Check browser console for error messages
2. Verify API endpoint is responding correctly
3. Test with different search queries
4. Check Firestore security rules

## Security Considerations

1. **API Authentication**: Consider adding authentication to your search API
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Input Validation**: Validate and sanitize search queries
4. **Firestore Rules**: Ensure proper Firestore security rules

## Performance Optimization

1. **Caching**: Consider caching search results
2. **Pagination**: Implement pagination for large result sets
3. **Debouncing**: Add debouncing to search input to reduce API calls
4. **Indexing**: Ensure proper Firestore indexes for search fields
