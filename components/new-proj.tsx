'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { createProject } from "@/actions/createProject";
import SubmitButton from "@/components/submit-proj-btn";
import { useAtom } from 'jotai';
import { userAtom } from '@/store/userAtoms';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const NewProjBtn = () => {
  const [user] = useAtom(userAtom);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  async function clientAction(formData: FormData) {
    if (!user?.uid) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a project",
        variant: "destructive",
      });
      return;
    }

    try {
      await createProject(formData, user.uid);
      setOpen(false);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive",
      });
    }
  }

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-md">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Create a new project to get started
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          clientAction(formData);
        }}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Project Name"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                placeholder="https://example.com"
                type="url"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              id="description"
              placeholder="Description (optional)"
            />
          </div>
          <div className="mt-4">
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjBtn;