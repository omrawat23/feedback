import NewProjBtn from "@/components/new-proj";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProjectsList from "./projects-list";

interface SearchParams {
  userId?: string; 
}

export default async function DashBoard({ searchParams }: { searchParams: SearchParams }) {
  const userId = searchParams.userId;

  if (!userId) {
    return null;
  }

  // Database query to retrieve projects for the user
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId));

  return (
    <div>
      <div className="flex items-center justify-center gap-3">
        <h1 className="text-3xl font-bold text-center my-4">Your Projects</h1>
        <NewProjBtn />
      </div>
      <ProjectsList projects={userProjects} />
    </div>
  );
}
