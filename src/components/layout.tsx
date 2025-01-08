"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser hook

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoaded } = useUser(); // Fetch current user data using Clerk's hook

  console.log(user);
  // Show a loading state while user data is being loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="text-2xl font-bold">
              CoFounder
            </Link>
          </div>
        </header>
        {/* Optionally show a loader or skeleton here */}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>{" "}
          {/* Loading spinner */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold">
            CoFounder
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/ideas" className="text-sm font-medium">
              Ideas
            </Link>
            <Link href="/developers" className="text-sm font-medium">
              Developers
            </Link>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {/* Display the user's profile image */}
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="User Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Use user's name in the menu items */}
                <DropdownMenuItem onSelect={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/dashboard")}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/settings")}>
                  Settings
                </DropdownMenuItem>
                {/* Add logout functionality here */}
                <DropdownMenuItem
                  onSelect={() => {
                    <>
                      <SignedOut>
                        <SignInButton />
                      </SignedOut>
                      <SignedIn>
                        <UserButton />
                      </SignedIn>
                    </>;
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
