"use client";

import { ITeacherListItem } from "@/features/teachers";
import { idParsers } from "@/lib/nuqs/id";
import { UserIcon } from "lucide-react";
import { useQueryStates } from "nuqs";

export default function TeacherSidebarItem({ teacher }: { teacher: ITeacherListItem }) {
  const [{ teacherId: selectedTeacherId }, setParsers] = useQueryStates(idParsers);

  return (
    <div
      onClick={() => setParsers({ teacherId: teacher.id })}
      className={`cursor-pointer flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${selectedTeacherId === teacher.id ? "bg-muted" : "bg-card"}`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted-foreground/10 border border-muted">
        <UserIcon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{teacher.fullName}</span>
      </span>
    </div>
  );
}
