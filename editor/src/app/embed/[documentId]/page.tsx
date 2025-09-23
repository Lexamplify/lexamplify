import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

import { Document } from "../../documents/[documentId]/document";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface EmbedPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}

const EmbedPage = async ({ params }: EmbedPageProps) => {
  const { documentId } = await params;

  const { getToken, userId } = await auth();
  
  // If user is not authenticated, redirect to sign-in
  if (!userId) {
    redirect("/sign-in");
  }

  const token = (await getToken({ template: "convex" })) ?? undefined;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const preloadedDocument = await preloadQuery(
    api.documents.getById,
    { id: documentId },
    { token }
  );

  return (
    <div className="h-screen w-full">
      <Document preloadedDocument={preloadedDocument} />
    </div>
  );
};

export default EmbedPage;