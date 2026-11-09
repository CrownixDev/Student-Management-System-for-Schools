"use client";

import type { IExamByEnrollmentId } from "@/features/exams";
import type { IStudent } from "@/features/students";
import type { ISubjectListItem } from "@/features/subjects";
import { CircleUserIcon, ExternalLinkIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcn/sheet";
import { getStudentDetailsAction } from "@/features/students/students.actions";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "@/components/ui/loading-indicator";
import StudentDetails, { IStudentDetailsTab } from "@/components/pages/classes/student-details";
import { STUDENT_DETAILS } from "@/lib/query-keys";
import EmptyState from "@/components/ui/empty-state";

export interface IStudentDetailsData {
  student: IStudent;
  examData: IExamByEnrollmentId[];
  subjectList: ISubjectListItem[];
}

export default function StudentDetailsViewButton({
  studentId,
  classId,
  defaultExamId,
  defaultSubjectId,
  defaultTab,
}: {
  studentId: string;
  classId: string;
  defaultExamId?: string;
  defaultSubjectId?: string;
  defaultTab?: IStudentDetailsTab;
}) {
  const [open, setOpen] = useState(false);

  const { data, isPending } = useQuery({
    enabled: open,
    queryFn: async () => {
      const res = await getStudentDetailsAction(studentId, classId);
      if (res.success) {
        return res.data;
      } else {
        toast.error(res.message);
        throw new Error(res.message);
      }
    },
    queryKey: [STUDENT_DETAILS, studentId, classId],
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="secondary">
            View
            <ExternalLinkIcon />
          </Button>
        }
      />
      <SheetContent className="min-w-3xl">
        {isPending && <LoadingIndicator />}
        {!isPending && !data && (
          <EmptyState
            icon={CircleUserIcon}
            title="Student data not found"
            description="We could not get the student data "
          />
        )}
        {data && (
          <StudentDetails
            student={data.student}
            examData={data.examData}
            subjectList={data.subjectList}
            defaultExamId={defaultExamId}
            defaultSubjectId={defaultSubjectId}
            defaultTab={defaultTab}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
