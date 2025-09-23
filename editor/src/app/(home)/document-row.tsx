import { format } from "date-fns";
import { SiGoogledocs } from "react-icons/si";
import { TableCell, TableRow } from "@/components/ui/table";

import { Doc } from "../../../convex/_generated/dataModel";
import { Building2Icon, CircleUserIcon, Loader2 } from "lucide-react";
import { DocumentMenu } from "./document-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DocumentRowProps {
  document: Doc<"documents">;
}

export const DocumentRow = ({ document }: DocumentRowProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push(`/documents/${document._id}`);
  };

  return (
    <TableRow 
      className={`cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`} 
      onClick={handleClick}
    >
      <TableCell className="w-[50px]">
        {isLoading ? (
          <Loader2 className="size-6 animate-spin text-blue-500" />
        ) : (
          <SiGoogledocs className="size-6 fill-blue-500" />
        )}
      </TableCell>
      <TableCell className="font-medium md:w-[45%]">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span>{document.title}</span>
            <span className="text-sm text-muted-foreground">Opening...</span>
          </div>
        ) : (
          document.title
        )}
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
        {document.organizationId ? (
          <Building2Icon className="size-4" />
        ) : (
          <CircleUserIcon className="size-4" />
        )}
        {document.organizationId ? "Organization" : "Personal"}
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell">
        {format(new Date(document._creationTime), "MMM dd, yyyy")}
      </TableCell>
      <TableCell className="flex justify-end">
        <DocumentMenu
          documentId={document._id}
          title={document.title}
          onNewTab={() => window.open(`/documents/${document._id}`, "_blank")}
        />
      </TableCell>
    </TableRow>
  );
};
