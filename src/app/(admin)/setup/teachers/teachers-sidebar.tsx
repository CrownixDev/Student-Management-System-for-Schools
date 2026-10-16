"use client";

import TeacherDialog from "@/components/dialog/teacher-dialog";
import SetupSidebarHearder from "@/components/setup/sidebar/sidebar-hearder";
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/shadcn/sidebar";
import SidebarPagination from "@/components/ui/sidebar/sidebar-pagination";
import { ITeacherListItem } from "@/features/teachers";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function TeachersSidebar({
  teacherList,
  isQuery = false,
}: {
  teacherList: ITeacherListItem[];
  isQuery?: boolean;
}) {
  const params = useParams();
  const [isAdding, setIsAdding] = useState(false);

  const selectedTeacherId = params?.teacherId;

  return (
    <>
      <Sidebar collapsible="none" className="border-r border-sidebar-border">
        <SetupSidebarHearder
          header={{
            title: "All Teachers",
            actionBtnlabel: "Add a new teacher",
            onAction() {},
          }}
          search={{
            placeholder: "Search by Name or phone",
          }}
        />
        <SidebarContent>
          <div className="min-h-0 flex-1 overflow-y-hidden">
            {teacherList.map((teacher) => (
              <Link
                key={teacher.id}
                type="button"
                aria-pressed={selectedTeacherId === teacher.id}
                href={`/setup/teachers/${teacher.id}`}
                className={`cursor-pointer flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${selectedTeacherId === teacher.id ? "bg-muted" : "bg-card"}`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted-foreground/10 border border-muted">
                  <UserIcon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{teacher.fullName}</span>
                </span>
              </Link>
            ))}
          </div>
          {teacherList.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-medium">{isQuery ? "No teachers match this search." : "No teachers yet."}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isQuery ? "Try another name or phone number." : "Add a teacher to get started."}
              </p>
            </div>
          )}
        </SidebarContent>
        <SidebarFooter>
          <SidebarPagination itemCount={100} />
        </SidebarFooter>
      </Sidebar>
      <TeacherDialog open={isAdding} onOpenChange={setIsAdding} />
    </>
  );
}
