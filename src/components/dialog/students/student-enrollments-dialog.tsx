"use client";

import { ChevronDownIcon, ExternalLinkIcon } from "lucide-react";
import { getStudentEnrollmentsAction } from "@/features/students/students.actions";
import { IStudentEnrollment, IStudentsListItem } from "@/features/students";
import { Badge } from "@/components/shadcn/badge";
import { buttonVariants } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/shadcn/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { useQuery } from "@tanstack/react-query";
import { STUDENT_ENROLLMENTS } from "@/lib/query-keys";
import { toast } from "react-toastify";
import Link from "next/link";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: IStudentsListItem;
}

function displayDate(date: Date | null) {
  return date ? new Date(date).toLocaleDateString() : "-";
}

function EnrollmentCard({ enrollment, studentId }: { enrollment: IStudentEnrollment; studentId: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">
            {enrollment.class.gradeLevel.name} - {enrollment.class.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">Academic year {enrollment.academicYear.name}</p>
        </div>
        <Badge variant={enrollment.status === "active" ? "success" : "secondary"}>{enrollment.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Joined</p>
            <p>{displayDate(enrollment.joinedOn)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Ended</p>
            <p>{displayDate(enrollment.endedOn)}</p>
          </div>
        </div>
        <Collapsible>
          <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted/50">
            Subjects and learning medium
            <ChevronDownIcon className="size-4 group-data-panel-open:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            {enrollment.subjects.length > 0 ? (
              <ul className="divide-y rounded-md border">
                {enrollment.subjects.map((subject) => (
                  <li
                    key={`${subject.code ?? subject.name}-${subject.medium ?? "no-medium"}`}
                    className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                  >
                    <span>
                      {subject.name}
                      {subject.code ? <span className="ml-2 text-muted-foreground">({subject.code})</span> : null}
                    </span>
                    <span className="shrink-0 text-muted-foreground">{subject.medium ?? "Medium not specified"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No subjects recorded for this enrollment.</p>
            )}
          </CollapsibleContent>
        </Collapsible>
        <div className="flex justify-end">
          <Link
            href={`/grades/${enrollment.class.gradeLevel.id}/classes/${enrollment.class.id}?yearId=${enrollment.academicYear.id}&studentId=${studentId}`}
            target="_blank"
            className={buttonVariants({ variant: "outline" })}
            type="button"
          >
            <ExternalLinkIcon />
            View in class
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentEnrollmentsDialog({ open, onOpenChange, student }: Props) {
  const {
    data: enrollments = [],
    isPending,
    isError,
  } = useQuery({
    queryFn: async () => {
      const res = await getStudentEnrollmentsAction(student.id);
      if (res.success) {
        return res.data;
      } else {
        toast.error(res.message);
        throw new Error(res.message);
      }
    },
    queryKey: [STUDENT_ENROLLMENTS, student.id],
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[60vh] min-w-lg grid-rows-[auto_minmax(0,1fr)]">
        <DialogHeader>
          <DialogTitle>Enrollments of {student.fullName}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 space-y-3 overflow-y-auto pr-1">
          {isPending && <p className="py-8 text-center text-sm text-muted-foreground">Loading enrollments...</p>}
          {isError && (
            <p role="alert" className="py-8 text-center text-sm text-destructive">
              {isError}
            </p>
          )}
          {!isPending && !isError && enrollments.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No enrollments found.</p>
          )}
          {!isPending &&
            !isError &&
            enrollments.map((enrollment) => (
              <EnrollmentCard key={enrollment.id} studentId={student.id} enrollment={enrollment} />
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
