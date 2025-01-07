import { db } from "@/lib/db";

// Define types for the incoming webhook payload
interface EmailAddress {
  emailAddress: string;
}

interface ExternalAccount {
  provider: string;
  username: string | null;
  imageUrl: string | null;
  emailAddress: string | null;
}

interface WebhookData {
  id: string;
  first_name?: string;
  last_name?: string;
  image_url?: string | null;
  email_addresses: EmailAddress[];
  external_accounts: ExternalAccount[];
}

// Helper function for upserting user data into the database
const upsertUser = async (
  id: string,
  email: string,
  name: string,
  imageUrl: string | null,
) => {
  await db.user.upsert({
    where: { id },
    update: { email, name, imageUrl },
    create: { id, email, name, imageUrl },
  });
};

export const POST = async (req: Request): Promise<Response> => {
  try {
    const { data }: { data: WebhookData } = await req.json();

    // Validate the necessary fields from the webhook payload
    if (
      !data ||
      !data.email_addresses ||
      !data.email_addresses[0]?.emailAddress
    ) {
      return new Response("Invalid webhook payload", { status: 400 });
    }

    // Extract common fields
    const email = data.email_addresses[0].emailAddress;
    const firstName = data.first_name || "Unknown";
    const lastName = data.last_name || "";
    const imageUrl = data.image_url || null;
    const id = data.id || crypto.randomUUID(); // Fallback to a random ID if `id` is missing
    const name = `${firstName} ${lastName}`.trim();

    // Check for GitHub account
    const githubAccount = data.external_accounts.find(
      (account) => account.provider === "github",
    );

    if (githubAccount) {
      const githubUsername = githubAccount.username || "Unknown";
      const githubProfileImageUrl = githubAccount.imageUrl || imageUrl;
      const githubEmail = githubAccount.emailAddress || email;

      // Upsert user with GitHub data
      await upsertUser(id, githubEmail, name, githubProfileImageUrl);

      return new Response("GitHub webhook processed successfully", {
        status: 200,
      });
    }

    // Check for LinkedIn account
    const linkedinAccount = data.external_accounts.find(
      (account) => account.provider === "linkedin",
    );

    if (linkedinAccount) {
      const linkedinUsername = linkedinAccount.username || "Unknown";
      const linkedinProfileImageUrl = linkedinAccount.imageUrl || imageUrl;
      const linkedinEmail = linkedinAccount.emailAddress || email;

      // Upsert user with LinkedIn data
      await upsertUser(id, linkedinEmail, name, linkedinProfileImageUrl);

      return new Response("LinkedIn webhook processed successfully", {
        status: 200,
      });
    }

    // If no supported provider is found, return success with no action
    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
