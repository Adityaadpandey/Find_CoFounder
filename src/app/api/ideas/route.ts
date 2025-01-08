import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, equity, skills } = body;

    // TODO: Get the actual user ID from the session
    const userId = await auth();

    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        equity,
        skills,
        userId,
      },
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json({ error: "Error creating idea" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const ideas = await prisma.idea.findMany();
    return NextResponse.json(ideas);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json(
      { error: "Error fetching ideas" },
      { status: 500 },
    );
  }
}
