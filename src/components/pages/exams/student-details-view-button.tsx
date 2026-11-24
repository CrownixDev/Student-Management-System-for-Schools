"use client";

import { CircleUserIcon, ExternalLinkIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcn/sheet";
import { useQueries, useQuery } from "@tanstack/react-query";
import { rpcTanStack } from "@/lib/orpc/client";
import LoadingIndicator from "@/components/ui/loading-indicator";
import StudentDetails, { IStudentDetailsTab } from "@/components/pages/classes/student-details";
import EmptyState from "@/components/ui/empty-state";

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

  const studentQuery = useQuery(
    rpcTanStack.student.getById.queryOptions({
      enabled: open,
      input: { classId, studentId },
    }),
  );

  const {
    data: { examData = [], subjectList = [] },
    isPending,
  } = useQueries({
    queries: [
      rpcTanStack.exam.getDataByEnrollmentId.queryOptions({
        enabled: Boolean(studentQuery.data?.enrollment.id) && open,
        input: { enrollmentId: studentQuery.data?.enrollment.id ?? "" },
      }),
      rpcTanStack.subject.getListByEnrollmentId.queryOptions({
        enabled: Boolean(studentQuery.data?.enrollment.id) && open,
        input: { id: studentQuery.data?.enrollment.id ?? "" },
      }),
    ],
    combine: (result) => {
      return {
        data: {
          examData: result[0].data,
          subjectList: result[1].data,
        },
        isPending: result.some((res) => res.isPending),
      };
    },
  });

  const dataFetchFailed = !studentQuery.data || examData?.length === 0 || subjectList?.length === 0;
  const isLoading = studentQuery.isPending || isPending;

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
        {isLoading && <LoadingIndicator />}
        {!isLoading && dataFetchFailed && (
          <EmptyState
            icon={CircleUserIcon}
            title="Student data not found"
            description="We could not get the student data "
          />
        )}
        {!dataFetchFailed && (
          <StudentDetails
            student={studentQuery.data}
            examData={examData}
            subjectList={subjectList}
            defaultExamId={defaultExamId}
            defaultSubjectId={defaultSubjectId}
            defaultTab={defaultTab}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
