"use client";

import ClassDetailsDialog from "@/components/dialog/class/class-details-dialog";
import { Button } from "@/components/shadcn/button";
import { IGradeWithClassesItem } from "@/features/grades";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function ClassNewBtn({ grade }: { grade: IGradeWithClassesItem }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start text-muted-foreground"
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon />
        Add new class
      </Button>
      {isOpen && (
        <ClassDetailsDialog
          open
          onOpenChange={setIsOpen}
          defaultGrade={{ id: grade.id, name: grade.name, number: grade.number }}
        />
      )}
    </>
  );
}
