"use client";

import EmptyState from "@/components/admin/empty-state";
import TeacherDialog from "@/components/dialog/teacher-dialog";
import { Button } from "@/components/shadcn/button";
import { PlusIcon, UsersRoundIcon } from "lucide-react";
import { useState } from "react";

export default function TeacherPage() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <EmptyState
        icon={UsersRoundIcon}
        title="Select a teacher"
        description="Choose a teacher from the list to see their class and subject assignments."
        action={
          <Button onClick={() => setIsOpen(true)}>
            <PlusIcon className="size-4" aria-hidden="true" />
            Add teacher
          </Button>
        }
      />
      <TeacherDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
