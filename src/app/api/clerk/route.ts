import { db } from "@/lib/db";
import { Role } from "@prisma/client";

interface EmailAddress {
  id: string;
  email_address: string;
  verification: {
    status: string;
    strategy?: string;
  };
  linked_to?: Array<{
    id: string;
    type: string;
  }>;
}

interface ExternalAccount {
  id: string;
  provider: string;
  provider_user_id: string;
  username: string;
  email_address: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  avatar_url: string | null;
  verification: {
    status: string;
    strategy?: string;
  };
}

interface WebhookData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  profile_image_url: string | null;
  email_addresses: EmailAddress[];
  external_accounts: ExternalAccount[];
  primary_email_address_id: string;
  username: string | null;
}

// Helper function to generate a username if not provided
const generateUsername = (email: string): string => {
  return email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

const upsertUser = async (data: WebhookData) => {
  // Get primary email
  const primaryEmail =
    data.email_addresses.find(
      (email) => email.id === data.primary_email_address_id,
    )?.email_address || data.email_addresses[0].email_address;

  // Find GitHub or LinkedIn account
  const githubAccount = data.external_accounts.find(
    (account) => account.provider === "oauth_github",
  );
  const linkedinAccount = data.external_accounts.find(
    (account) => account.provider === "oauth_linkedin",
  );

  const username = data.username || generateUsername(primaryEmail);
  const name =
    `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
    "Anonymous User";
  const imageUrl = data.profile_image_url || data.image_url;

  const userData = {
    email: primaryEmail,
    name,
    username,
    imageUrl,
    role: Role.DEVELOPER,
    ...(githubAccount ? { githubId: githubAccount.provider_user_id } : {}),
    ...(linkedinAccount
      ? { linkedinId: linkedinAccount.provider_user_id }
      : {}),
  };

  try {
    await db.user.upsert({
      where: { email: primaryEmail },
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
    // Handle username collision
    if (error.code === "P2002") {
      userData.username = `${username}${Math.floor(Math.random() * 1000)}`;
      await db.user.upsert({
        where: { email: primaryEmail },
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
    const payload = await req.json();

    // Ensure this is a user event
    if (!payload.type?.startsWith("user.")) {
      return new Response("Ignored non-user event", { status: 200 });
    }

    // Validate the webhook payload
    if (
      !payload.data?.id ||
      !payload.data.email_addresses ||
      payload.data.email_addresses.length === 0
    ) {
      return new Response("Invalid webhook payload", { status: 400 });
    }

    await upsertUser(payload.data);

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
