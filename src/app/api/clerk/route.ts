import { db } from "@/lib/db";
import { Role } from "@prisma/client";

// Define types for the incoming webhook payload
interface EmailAddress {
  emailAddress: string;
  id: string;
  verification: {
    status: string;
  };
}

interface ExternalAccount {
  provider: string;
  providerId: string;
  username: string | null;
  imageUrl: string | null;
  emailAddress: string | null;
}

interface WebhookData {
  id: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
  email_addresses: EmailAddress[];
  external_accounts: ExternalAccount[];
  primary_email_address_id: string;
}

// Helper function to generate a username from email
const generateUsername = (email: string): string => {
  return email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

// Helper function for upserting user data into the database
const upsertUser = async (
  id: string,
  email: string,
  name: string,
  imageUrl: string | null,
  providerId: string | null,
  provider: "github" | "linkedin" | "email",
) => {
  const username = generateUsername(email);

  const userData = {
    email,
    name,
    username,
    role: Role.DEVELOPER, // Default role, can be changed later
    ...(provider === "github" ? { githubId: providerId } : {}),
    ...(provider === "linkedin" ? { linkedinId: providerId } : {}),
  };

  try {
    await db.user.upsert({
      where: { email },
      update: userData,
      create: {
        ...userData,
        profile: {
          create: {
            bio: "",
            skills: [],
            experience: "",
          },
        },
      },
    });
  } catch (error) {
    // Handle unique constraint violation for username
    if (error.code === "P2002") {
      // If username already exists, append a random number
      userData.username = `${username}${Math.floor(Math.random() * 1000)}`;
      await db.user.upsert({
        where: { email },
        update: userData,
        create: {
          ...userData,
          profile: {
            create: {
              bio: "",
              skills: [],
              experience: "",
            },
          },
        },
      });
    } else {
      throw error;
    }
  }
};

export async function POST(req: Request): Promise<Response> {
  try {
    const { data }: { data: WebhookData } = await req.json();

    // Validate the webhook payload
    if (
      !data?.id ||
      !data.email_addresses ||
      data.email_addresses.length === 0
    ) {
      return new Response("Invalid webhook payload", { status: 400 });
    }

    // Get primary email
    const primaryEmail =
      data.email_addresses.find(
        (email) => email.id === data.primary_email_address_id,
      )?.emailAddress || data.email_addresses[0].emailAddress;

    // Extract user information
    const firstName = data.first_name || "";
    const lastName = data.last_name || "";
    const imageUrl = data.image_url || null;
    const name = `${firstName} ${lastName}`.trim() || "Anonymous User";

    // Find the external account (GitHub or LinkedIn)
    const githubAccount = data.external_accounts.find(
      (account) => account.provider === "github",
    );

    const linkedinAccount = data.external_accounts.find(
      (account) => account.provider === "linkedin",
    );

    if (githubAccount) {
      const userEmail = githubAccount.emailAddress || primaryEmail;
      const userImageUrl = githubAccount.imageUrl || imageUrl;

      await upsertUser(
        data.id,
        userEmail,
        name,
        userImageUrl,
        githubAccount.providerId,
        "github",
      );

      return new Response("GitHub user processed successfully", {
        status: 200,
      });
    }

    if (linkedinAccount) {
      const userEmail = linkedinAccount.emailAddress || primaryEmail;
      const userImageUrl = linkedinAccount.imageUrl || imageUrl;

      await upsertUser(
        data.id,
        userEmail,
        name,
        userImageUrl,
        linkedinAccount.providerId,
        "linkedin",
      );

      return new Response("LinkedIn user processed successfully", {
        status: 200,
      });
    }

    // Handle email-only signup
    await upsertUser(data.id, primaryEmail, name, imageUrl, null, "email");

    return new Response("User processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);

    if (error instanceof SyntaxError) {
      return new Response("Invalid JSON payload", { status: 400 });
    }

    return new Response(
      `Internal Server Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 },
    );
  }
}
