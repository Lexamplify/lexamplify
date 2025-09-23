"use client";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, XIcon, Loader2 } from "lucide-react";

import { templates } from "@/constants/templates";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { ImportDocument } from "@/components/import-document";
import { processTemplateContentForConvex } from "@/lib/template-processor";
import { TemplateSearchService, SearchResult } from "@/lib/template-search-service";
import { TemplateSearchResults } from "./template-search-results";
import { TemplateCustomizationModal } from "@/components/template-customization-modal";
import { TemplateAIService } from "@/lib/template-ai-service";

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const TemplatesGallery = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useUser();
  const userId = user?.id;
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Template customization modal state
  const [selectedTemplate, setSelectedTemplate] = useState<{
    id: string;
    label: string;
    imageUrl: string;
    initialContent: string | object;
    queries?: string[];
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);


  const onTemplateClick = (template: {
    id: string;
    label: string;
    imageUrl: string;
    initialContent: string | object;
    queries?: string[];
  }) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleSkipTemplate = async (template: {
    id: string;
    label: string;
    imageUrl: string;
    initialContent: string | object;
    queries?: string[];
  }) => {
    if (!userId) {
      toast.error("Please sign in to create documents");
      return;
    }

    setIsCreating(true);
    
    try {
      // Create document in Firebase
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: template.label,
          templateType: template.id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create document');
      }

      const { fileId } = await response.json();
      
      toast.success("Document created");
      router.push(`/documents/${fileId}`);
    } catch (error: any) {
      console.error("Error creating document:", error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCustomizeTemplate = async (template: {
    id: string;
    label: string;
    imageUrl: string;
    initialContent: string | object;
    queries?: string[];
  }, answers: Record<string, string>) => {
    if (!userId) {
      toast.error("Please sign in to create documents");
      return;
    }

    setIsCustomizing(true);
    
    try {
      console.log('🎨 Customizing template with answers:', answers);
      
      // Use AI service to customize the template
      const customizationResult = await TemplateAIService.customizeTemplate({
        templateContent: template.initialContent,
        queries: template.queries || [],
        answers,
        templateType: template.label
      });

      if (!customizationResult.success) {
        throw new Error(customizationResult.error || 'Failed to customize template');
      }

      // Create document in Firebase
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: `${template.label} (Customized)`,
          templateType: template.id,
          // You might want to store the customized content as well
          // customContent: customizationResult.customizedContent
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create document');
      }

      const { fileId } = await response.json();
      
      toast.success("Customized document created");
      router.push(`/documents/${fileId}`);
    } catch (error) {
      console.error("Error customizing template:", error);
      toast.error("Failed to customize template. Please try again.");
    } finally {
      setIsCustomizing(false);
    }
  };


  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setShowSearchResults(false);
    }
  };

  // Debounced search function
  const debouncedSearch = debounce(async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    setShowSearchResults(true);

    try {
      const results = await TemplateSearchService.searchTemplates(query);
      setSearchResults(results);

      if (results.length === 0) {
        toast.error("No templates found for your search. Try different terms.");
      }
    } catch (error) {
      console.error("Error searching templates:", error);
      toast.error("Failed to search for templates. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }, 500);

  // Effect for debounced search
  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      setShowSearchResults(false);
    }
  }, [searchQuery, debouncedSearch]);

  return (
    <div className="bg-[#F1F3F4]">
      <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Start a new document</h3>
          
          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search templates..."
                className="w-64 pr-10"
                disabled={isSearching}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center">
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
            {searchQuery && (
              <Button
                onClick={handleClearSearch}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isSearching}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Show search results or regular templates */}
        {showSearchResults ? (
          <TemplateSearchResults
            results={searchResults}
            isLoading={isSearching}
            onClearSearch={handleClearSearch}
          />
        ) : (
          <Carousel>
            <CarouselContent className="-ml-4">
              {/* Import Document Button */}
              <CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-4">
                <ImportDocument />
              </CarouselItem>
              {templates.map((template) => (
                <CarouselItem
                  key={template.id}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-4"
                >
                  <div
                    className={cn(
                      "aspect-[3/4] flex flex-col gap-y-2.5",
                      (isCreating || isCustomizing) && "pointer-events-none opacity-50"
                    )}
                  >
                    <button
                      disabled={isCreating || isCustomizing}
                      onClick={() => onTemplateClick(template)}
                      style={{
                        backgroundImage: `url(${template.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                      className="size-full hover:border-blue-500 rounded-sm border hover:bg-blue-50 transition flex flex-col items-center justify-center gap-y-4 bg-white relative"
                    >
                      {(isCreating || isCustomizing) && (
                        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-y-2 rounded-sm">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                          <span className="text-sm font-medium text-blue-600">
                            {isCreating ? "Creating..." : "Customizing..."}
                          </span>
                        </div>
                      )}
                    </button>
                    <p className="text-sm font-medium truncate">{template.label}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>

      {/* Template Customization Modal */}
      {selectedTemplate && (
        <TemplateCustomizationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTemplate(null);
          }}
          template={selectedTemplate}
          onSkip={handleSkipTemplate}
          onCustomize={handleCustomizeTemplate}
          isProcessing={isCreating || isCustomizing}
        />
      )}
    </div>
  );
};
