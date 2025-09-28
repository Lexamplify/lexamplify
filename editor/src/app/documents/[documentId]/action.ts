"use server";

import { ConvexHttpClient } from "convex/browser";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDocuments(ids: Id<"documents">[]) {
  try {
    return await convex.query(api.documents.getByIds, { ids });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
}

export async function getUsers() {
  try {
    const { sessionClaims } = await auth();
    
    if (!sessionClaims?.org_id) {
      console.warn('No organization ID found in session claims');
      return [];
    }

    const clerk = await clerkClient();
    const response = await clerk.users.getUserList({
      organizationId: [sessionClaims.org_id as string],
    });

    const users = response.data.map((user) => ({
      id: user.id,
      name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
      avatar: user.imageUrl,
      color: "",
    }));

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}
