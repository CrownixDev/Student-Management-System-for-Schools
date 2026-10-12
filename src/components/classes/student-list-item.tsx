"use client";
import { IStudentsListItem } from "@/features/students";
import { idParsers } from "@/lib/nuqs/id";
import { useQueryStates } from "nuqs";

export default function StudentListItem({ student }: { student: IStudentsListItem }) {
  const [{ studentId }, setQueryStates] = useQueryStates(idParsers);

  return (
    <button
      key={student.id}
      type="button"
      aria-pressed={studentId === student.id}
      className={`cursor-pointer flex w-full items-center gap-3 border-b border-border/70 px-4 py-2.5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${studentId === student.id ? "bg-muted" : "bg-card"}`}
      onClick={() => setQueryStates({ studentId: student.id })}
    >
      <span className="w-8 shrink-0 text-right font-mono text-xs text-muted-foreground">
        {String(student.enrollments[0].classIndex).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{student.fullName}</span>
        <span className="block truncate text-xs text-muted-foreground">{student.admissionNo}</span>
      </span>
    </button>
  );
}
