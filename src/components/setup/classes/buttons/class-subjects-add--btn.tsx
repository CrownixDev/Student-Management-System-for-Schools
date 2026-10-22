"use client";

import ClassSubjectsDialog from "@/components/dialog/class/class-subjects-dialog";
import { Button } from "@/components/shadcn/button";
import { IClass } from "@/features/class";
import { BookOpenCheckIcon } from "lucide-react";
import { useState } from "react";

export default function ClassSubjectAddBtn({ classData }: { classData: IClass }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <BookOpenCheckIcon />
        Add subjects
      </Button>
      {isOpen && (
        <ClassSubjectsDialog
          open
          onOpenChange={setIsOpen}
          data={classData}
          onSave={(savedClass) => console.log(savedClass)}
        />
      )}
    </>
  );
}
