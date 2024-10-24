'use server';
import { db } from "@/db";
import { getSession } from "@/auth";
import { projects } from "@/db/schema";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const session = await getSession();

  // Ensure session and user ID are available
  const userId = session?.user?.id;

  const project = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    url: formData.get("url") as string,
    userId,
  }

  console.log(`${JSON.stringify(project)}`)
  console.log(`${JSON.stringify(userId)}`)

  const [newProject] = await db.insert(projects).values(project).returning({ insertedId: projects.id })

  redirect(`/projects/${newProject.insertedId}/instructions`);
}
