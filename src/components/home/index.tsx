import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layout } from "./layout";

export default function HomePage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Find Your Perfect Co-Founder
        </h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Connect with talented developers and visionary founders. Build the
          next big thing together.
        </p>
        <div className="flex flex-col gap-4 min-[400px]:flex-row">
          <Button asChild size="lg">
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/ideas">Browse Ideas</Link>
          </Button>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-2">
            <svg
              className=" h-10 w-10 text-primary"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h2 className="text-xl font-bold">Connect</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Find like-minded individuals who share your passion.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <svg
              className=" h-10 w-10 text-primary"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5Z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
            </svg>
            <h2 className="text-xl font-bold">Build</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Collaborate on exciting projects and bring ideas to life.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <svg
              className=" h-10 w-10 text-primary"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h2 className="text-xl font-bold">Launch</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Take your startup from idea to successful launch.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
