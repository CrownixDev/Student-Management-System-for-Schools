"use client";

import EmptyState from "@/components/ui/empty-state";
import { BookOpenCheckIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import SubjectDialog from "@/components/dialog/subject-dialog";
import { useState } from "react";

export default function SubjectPage() {
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  return (
    <>
      <EmptyState
        icon={BookOpenCheckIcon}
        title="Select a subject"
        description="Choose a subject from the list to see its class, teacher, and exam assignments."
        action={
          <Button onClick={() => setIsAddingSubject(true)}>
            <PlusIcon className="size-4" aria-hidden="true" />
            Add subject
          </Button>
        }
      />
      <SubjectDialog open={isAddingSubject} onOpenChange={setIsAddingSubject} />
    </>
  );
}
