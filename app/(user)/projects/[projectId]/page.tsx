import { db } from "@/db";
import { eq } from "drizzle-orm";
import { projects as dbProjects } from "@/db/schema";
import Link from "next/link";
import {
  Globe,
  ChevronLeft,
  Code,
  BarChart,
  MessageSquare,
} from "lucide-react";
import Table from "@/components/table";
import Chart from "@/components/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

async function getProjectData(projectId: string) {
  const projects = await db.query.projects.findMany({
    where: eq(dbProjects.id, parseInt(projectId)),
    with: {
      feedbacks: true,
    },
  });
  return projects[0];
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  if (!params.projectId) return <div>Invalid Project ID</div>;

  const project = await getProjectData(params.projectId);

  if (!project) return <div>Project not found</div>;

  const averageRating =
    project.feedbacks.reduce((sum, feedback) => {
      if (feedback.rating !== null) {
        return sum + feedback.rating;
      }
      return sum;
    }, 0) / project.feedbacks.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        <span>Back to projects</span>
      </Link>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{project.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-muted-foreground mb-4">
              {project.description}
            </p>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm px-2 py-1">
                {project.feedbacks.length} Feedbacks
              </Badge>
              <Badge variant="secondary" className="text-sm px-2 py-1">
                Avg Rating: {averageRating.toFixed(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

     {/* Actions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            {project.url && (
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href={project.url}>
                  <Globe className="h-4 w-4 mr-2" />
                  Visit site
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href={`/projects/${params.projectId}/instructions`}>
                <Code className="h-4 w-4 mr-2" />
                Embed Code
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center">
            <BarChart className="h-6 w-6 mr-2" />
            Feedback Ratings Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Chart data={project.feedbacks} />
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            Feedback Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table data={project.feedbacks} />
        </CardContent>
      </Card>
    </div>
  );
}
