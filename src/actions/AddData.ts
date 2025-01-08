"use server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function addIdea(data: CreateIdeaInput) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify user exists first
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");

    return await db.idea.create({
      data: {
        ...data,
        userId,
      },
    });
  } catch (error) {
    console.error("Error creating idea:", error);
    return { error: error.message };
  }
}
export type CreateIdeaInput = {
  title: string;
  description: string;
  equity: number;
  skills: string[];
};
