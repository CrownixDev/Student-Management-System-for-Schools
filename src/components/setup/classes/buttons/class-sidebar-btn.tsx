"use client";

import { Badge } from "@/components/shadcn/badge";
import { IGradeWithClassesItem } from "@/features/grades";
import { idParsers } from "@/lib/nuqs/id";
import { UserCircleIcon } from "lucide-react";
import { useQueryStates } from "nuqs";

export default function ClassSidebarBtn({ classItem }: { classItem: IGradeWithClassesItem["classes"][0] }) {
  const [{ classId }, setParsers] = useQueryStates(idParsers);
  return (
    <button
      type="button"
      className={`flex w-full min-w-0 items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-muted ${
        classId === classItem.id ? "bg-muted font-medium" : ""
      }`}
      onClick={() => setParsers({ classId: classItem.id })}
    >
      <span className="min-w-0 flex-1 truncate text-sm">{classItem.name}</span>
      <div className="flex gap-3">
        <Badge variant="outline">{classItem.batch?.name}</Badge>
        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <UserCircleIcon className="size-3.5" />
          {classItem.studentCount}
        </span>
      </div>
    </button>
  );
}
