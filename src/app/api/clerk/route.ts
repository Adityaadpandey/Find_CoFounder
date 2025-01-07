import { db } from "@/lib/db";
import { Role } from "@prisma/client";

interface ClerkWebhookEvent {
  data: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    profile_image_url: string | null;
    phone_numbers: Array<{
      phone_number: string;
      id: string;
    }>;
    email_addresses: Array<{
      id: string;
      email_address: string;
      verification: {
        status: string;
        strategy?: string;
      };
    }>;
    external_accounts: Array<{
      id: string;
      provider: string;
      provider_user_id: string;
      username?: string;
      email_address?: string;
      first_name?: string;
      last_name?: string;
      avatar_url?: string;
      image_url?: string;
      verification: {
        status: string;
        strategy?: string;
      };
    }>;
    primary_email_address_id: string;
    primary_phone_number_id?: string;
    username: string | null;
  };
  type: string;
}

const logDebug = (message: string, data: any) => {
  console.log(`DEBUG - ${message}:`, JSON.stringify(data, null, 2));
};

export async function POST(req: Request): Promise<Response> {
  try {
    const payload: ClerkWebhookEvent = await req.json();
    logDebug("Received webhook payload", payload);

    if (!payload.data) {
      return new Response("Missing data in webhook payload", { status: 400 });
    }

    const { data } = payload;

    // Get primary email
    const primaryEmail =
      data.email_addresses.find(
        (email) => email.id === data.primary_email_address_id,
      )?.email_address || data.email_addresses[0].email_address;

    // Get phone number if available
    const primaryPhone = data.phone_numbers?.find(
      (phone) => phone.id === data.primary_phone_number_id,
    )?.phone_number;

    // Get external accounts
    const githubAccount = data.external_accounts.find(
      (account) => account.provider === "oauth_github",
    );
    const linkedinAccount = data.external_accounts.find(
      (account) => account.provider === "oauth_linkedin",
    );

    // Prepare user data
    const username = data.username || primaryEmail.split("@")[0];
    const name =
      `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
      "Anonymous User";

    const userData = {
      email: primaryEmail,
      name,
      username,
      role: Role.DEVELOPER,
      phone: primaryPhone || null,
      ...(githubAccount ? { githubId: githubAccount.provider_user_id } : {}),
      ...(linkedinAccount
        ? { linkedinId: linkedinAccount.provider_user_id }
        : {}),
    };

    logDebug("Prepared user data", userData);

    try {
      const user = await db.user.upsert({
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
        include: {
          profile: true,
        },
      });

      logDebug("User upserted successfully", user);
      return new Response(JSON.stringify({ success: true, user }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (dbError) {
      logDebug("Database error", dbError);

      // Handle username collision
      if (dbError.code === "P2002") {
        const newUsername = `${username}${Math.floor(Math.random() * 1000)}`;
        logDebug("Retrying with new username", newUsername);

        const user = await db.user.upsert({
          where: { email: primaryEmail },
          update: { ...userData, username: newUsername },
          create: {
            ...userData,
            username: newUsername,
            profile: {
              create: {
                bio: "",
                skills: [],
                experience: "",
              },
            },
          },
          include: {
            profile: true,
          },
        });

        logDebug("User upserted successfully with new username", user);
        return new Response(JSON.stringify({ success: true, user }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      throw dbError;
    }
  } catch (error) {
    console.error("Error processing webhook:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
