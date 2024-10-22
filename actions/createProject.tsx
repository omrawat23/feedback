'use server';

import { db } from "@/db";
import { projects } from "@/db/schema";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData, userId: string) {
  const project = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    url: formData.get("url") as string,
    userId, 
  };

  console.log(`${JSON.stringify(project)}`);
  console.log(`${JSON.stringify(userId)}`);

  const [newProject] = await db.insert(projects).values(project).returning({ insertedId: projects.id });

  redirect(`/projects/${newProject.insertedId}/instructions`);
}
