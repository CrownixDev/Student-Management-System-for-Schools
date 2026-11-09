"use client";
import { IClass } from "@/features/class";
import { idParsers } from "@/lib/nuqs/id";
import { useQueryStates } from "nuqs";

export default function StudentListItem({ enrollment }: { enrollment: IClass["enrollments"][number] }) {
  const [{ studentId }, setQueryStates] = useQueryStates(idParsers);

  return (
    <button
      key={enrollment.id}
      type="button"
      aria-pressed={studentId === enrollment.student.id}
      className={`cursor-pointer flex w-full items-center gap-3 border-b border-border/70 px-4 py-2.5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${studentId === enrollment.student.id ? "bg-muted" : "bg-sidebar/50"}`}
      onClick={() => setQueryStates({ studentId: enrollment.student.id })}
    >
      <span className="w-8 shrink-0 text-right font-mono text-xs text-muted-foreground">
        {String(enrollment.classIndex).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{enrollment.student.fullName}</span>
        <span className="block truncate text-xs text-muted-foreground">{enrollment.student.admissionNo}</span>
      </span>
    </button>
  );
}
