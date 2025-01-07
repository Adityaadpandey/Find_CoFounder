"use client";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const { user } = useUser(); // Gets the current authenticated user

  console.log(user); // This will log the full user object containing the GitHub data

  return (
    <div>
      <h1>Welcome</h1>
    </div>
  );
};

export default Page;
