"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// This is mock data. In a real application, this would come from an API or database.
const mockIdeas = {
  "1": {
    id: "1",
    title: "AI-Powered Personal Finance App",
    description:
      "We're developing an AI-driven app that helps users manage their finances, predict expenses, and achieve financial goals. The app will use machine learning algorithms to analyze spending patterns, provide personalized advice, and automate savings and investments.",
    skills: ["React Native", "Machine Learning", "Node.js"],
    equity: "10-15%",
    founderName: "Jane Doe",
    founderBio:
      "Serial entrepreneur with a background in fintech and data science.",
  },
  "2": {
    id: "2",
    title: "Sustainable Fashion Marketplace",
    description:
      "Creating a platform that connects eco-conscious consumers with sustainable and ethical fashion brands. Our marketplace will feature a curated selection of environmentally friendly and socially responsible clothing and accessories.",
    skills: ["React", "Node.js", "UI/UX Design"],
    equity: "8-12%",
    founderName: "Alex Green",
    founderBio: "Fashion industry veteran with a passion for sustainability.",
  },
};

export default function IdeaDetailsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "1";
  const [application, setApplication] = useState("");

  // In a real application, you would fetch the idea details based on the id
  const idea = mockIdeas[id as keyof typeof mockIdeas] || mockIdeas["1"]; // Fallback to first idea if id not found

  const handleApply = () => {
    // Handle the application submission here
    console.log("Application submitted:", application);
    // You might want to send this to an API, show a success message, etc.
  };

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">{idea.title}</h1>
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{idea.description}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {idea.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Apply for This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Tell us why you're a great fit for this project..."
                  value={application}
                  onChange={(e) => setApplication(e.target.value)}
                  className="mb-4"
                />
                <Button onClick={handleApply}>Submit Application</Button>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Equity Offered:</strong> {idea.equity}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>About the Founder</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="mb-2 font-semibold">{idea.founderName}</h3>
                <p>{idea.founderBio}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
