"use client";

import { ISubjectListItem } from "@/features/subjects";
import { idParsers } from "@/lib/nuqs/id";
import { BookOpenCheckIcon } from "lucide-react";
import { useQueryStates } from "nuqs";

export default function SubjectSidebarItem({ subject, category }: { subject: ISubjectListItem; category: string }) {
  const [{ subjectId }, setParsers] = useQueryStates(idParsers);

  return (
    <div
      onClick={() => setParsers({ subjectId: subject.id })}
      className={`flex w-full cursor-pointer items-start gap-3 border-b border-border/70 px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${subjectId === subject.id ? "bg-muted" : "bg-card"}`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted-foreground/10 border border-muted">
        <BookOpenCheckIcon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{subject.name}</span>
        <span className="block truncate text-xs text-muted-foreground">{category}</span>
      </span>
    </div>
  );
}
