"use client";

import { useState } from "react";
import { EyeIcon, WaypointsIcon } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { IStudentProfile } from "@/features/students";
import StudentDetailsDialog from "@/components/dialog/students/student-details-dialog";
import StudentEnrollmentsDialog from "@/components/dialog/students/student-enrollments-dialog";

export default function StudentActions({ student }: { student: IStudentProfile }) {
  const [editOpen, setEditOpen] = useState(false);
  const [enrollmentsOpen, setEnrollmentsOpen] = useState(false);

  function handleDelete(studentId: string) {
    console.log(studentId);
  }

  function handleSave(data: IStudentProfile) {
    console.log(data);
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        <EyeIcon />
        View
      </Button>
      <Button variant="outline" size="sm" onClick={() => setEnrollmentsOpen(true)}>
        <WaypointsIcon />
        Enrollments
      </Button>
      {editOpen && (
        <StudentDetailsDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          data={student}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
      {enrollmentsOpen && (
        <StudentEnrollmentsDialog open={enrollmentsOpen} onOpenChange={setEnrollmentsOpen} student={student} />
      )}
    </div>
  );
}
