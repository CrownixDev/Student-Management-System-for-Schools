"use client";

import TeacherDialog from "@/components/dialog/teacher/teacher-dialog";
import { Button } from "@/components/shadcn/button";
import { ITeacher } from "@/features/teachers";
import { EditIcon } from "lucide-react";
import { useState } from "react";

export default function TeacherEditBtn({ teacher }: { teacher: ITeacher }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <EditIcon className="size-4" aria-hidden="true" />
        Edit teacher
      </Button>
      <TeacherDialog open={open} onOpenChange={setOpen} data={teacher} />
    </>
  );
}
