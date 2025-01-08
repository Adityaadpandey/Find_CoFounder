// app/pages/create-idea.tsx (or wherever your form resides)

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addIdea, CreateIdeaInput } from "@/actions/AddData"; // Import the server action
import { Idea } from "@prisma/client";

export default function CreateIdeaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    equity: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const ideaData: CreateIdeaInput = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      equity: parseFloat(formData.equity),
    };

    if (
      !ideaData.title ||
      !ideaData.description ||
      !ideaData.skills.length ||
      isNaN(ideaData.equity)
    ) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await addIdea(ideaData);
      if ("error" in response) {
        setError(response.error);
      } else {
        router.push("/ideas");
      }
    } catch (err) {
      setError("Failed to create idea");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Layout>
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Create New Idea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-500">{error}</div>}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="skills">
                  Required Skills (comma-separated)
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="equity">Equity Offered (%)</Label>
                <Input
                  id="equity"
                  name="equity"
                  type="number"
                  step="0.01"
                  value={formData.equity}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Create Idea"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
