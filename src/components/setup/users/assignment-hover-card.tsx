"use client";

import { Button } from "@/components/shadcn/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/shadcn/hover-card";
import { IUser } from "@/features/user";

export default function AssignmentHoverCard({ user }: { user: IUser }) {
  const classCount = !(user.role === "admin" || user.role === "mod") ? user.classes.length : 0;
  const subjectCount = user.role === "subject_teacher" ? user.subjects.length : 0;
  const assignmentCount = classCount + subjectCount;
  const countLabel = [
    `${classCount} ${classCount === 1 ? "class" : "classes"}`,
    ...(user.role === "subject_teacher" ? [`${subjectCount} ${subjectCount === 1 ? "subject" : "subjects"}`] : []),
  ].join(" · ");

  if (assignmentCount === 0) {
    return <span className="text-sm text-muted-foreground">No assignments</span>;
  }

  return (
    <HoverCard>
      <HoverCardTrigger
        delay={100}
        closeDelay={200}
        render={
          <Button variant="link" size="sm" className="h-auto max-w-full px-1 py-0.5 text-left">
            {countLabel}
          </Button>
        }
      />
      <HoverCardContent align="start" className="max-h-72 overflow-y-auto">
        {user.classes && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Classes</p>
            <ul className="list-inside list-disc space-y-1">
              {user.classes.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          </div>
        )}
        {user.role === "subject_teacher" && user.subjects.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Subjects</p>
            <ul className="list-inside list-disc space-y-1">
              {user.subjects.map((subject) => (
                <li key={subject.id}>{subject.name}</li>
              ))}
            </ul>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
