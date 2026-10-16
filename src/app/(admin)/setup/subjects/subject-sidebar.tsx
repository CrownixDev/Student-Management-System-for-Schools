"use client";

import SubjectDialog, { subjectCategories } from "@/components/dialog/subject-dialog";
import SetupSidebarHearder from "@/components/setup/sidebar/sidebar-hearder";
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/shadcn/sidebar";
import SidebarPagination from "@/components/ui/sidebar/sidebar-pagination";
import { ISubjectListItem } from "@/features/subjects/subject.types";
import { BookOpenCheckIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function SubjectSidebar({
  subjectList,
  isQuery = false,
}: {
  subjectList: ISubjectListItem[];
  isQuery?: boolean;
}) {
  const params = useParams();
  const selectedId = params?.subjectId;

  const [isAddingSubject, setIsAddingSubject] = useState(false);

  return (
    <>
      <Sidebar collapsible="none" className="border-r border-sidebar-border">
        <SetupSidebarHearder
          header={{
            title: "All Subjects",
            actionBtnlabel: "Add a new subject",
            onAction() {},
          }}
          search={{
            placeholder: "Search by Name, code, or category",
          }}
        />
        <SidebarContent>
          <div className="min-h-0 flex-1 overflow-y-auto" aria-label="Subjects">
            {subjectList.map((subject) => {
              const category = subjectCategories.filter((cat) => cat.value === subject.category)[0].label;
              return (
                <Link
                  key={subject.id}
                  type="button"
                  href={`/setup/subjects/${subject.id}`}
                  className={`flex w-full cursor-pointer items-start gap-3 border-b border-border/70 px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${selectedId === subject.id ? "bg-muted" : "bg-card"}`}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted-foreground/10  border border-muted">
                    <BookOpenCheckIcon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{subject.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{category}</span>
                  </span>
                </Link>
              );
            })}
            {subjectList.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium">{isQuery ? "No subjects match this search." : "No subjects yet."}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isQuery ? "Try a different search." : "Add a subject to get started."}
                </p>
              </div>
            )}
          </div>
        </SidebarContent>
        <SidebarFooter>
          <SidebarPagination itemCount={100} />
        </SidebarFooter>
      </Sidebar>
      <SubjectDialog open={isAddingSubject} onOpenChange={setIsAddingSubject} />
    </>
  );
}
