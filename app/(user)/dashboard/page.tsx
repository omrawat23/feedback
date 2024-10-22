// src/app/dashboard/page.tsx
import NewProjBtn from "@/components/new-proj";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProjectsList from "./projects-list";

// Server component: Dashboard
export default async function DashBoard({ searchParams }:any) {
  const userId = searchParams.userId; // Access userId from the search parameters

  if (!userId) {
    return null; // Return null if userId is not available
  }

  // Database query to retrieve projects for the user
  const userProjects = await db.select().from(projects).where(eq(projects.userId, userId));

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
