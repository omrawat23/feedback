import NewProjBtn from "@/components/new-proj";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/auth";
import ProjectsList from "./projects-list";

export default async function Page() {
  const session = await getSession();

  // Ensure session and user ID are available
  const userId = session?.user?.id;
  
  if (!userId) {
    return null;
  }

  // Fetch user projects
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
