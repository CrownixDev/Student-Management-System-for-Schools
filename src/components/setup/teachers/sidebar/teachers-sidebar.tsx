"use client";

import TeacherDialog from "@/components/dialog/teacher-dialog";
import SidebarHearder from "@/components/setup/sidebar/sidebar-hearder";
import SidebarPagination from "@/components/ui/sidebar/sidebar-pagination";
import { ITeacherListItem } from "@/features/teachers";
import { useState } from "react";
import TeacherSidebarItem from "./sidebar-item";
import EmptyState from "@/components/ui/empty-state";
import { UsersIcon } from "lucide-react";
import {
  SetupSidebar,
  SetupSidebarContent,
  SetupSidebarFooter,
  SetupSidebarHearder,
} from "@/components/setup/sidebar/setup-sidebar";

export default function TeachersSidebar({
  itemCount,
  teacherList,
  isQuery = false,
}: {
  itemCount: number;
  teacherList: ITeacherListItem[];
  isQuery?: boolean;
}) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <>
      <SetupSidebar>
        <SetupSidebarHearder>
          <SidebarHearder
            header={{
              title: "All Teachers",
              actionBtnlabel: "Add a new teacher",
              onAction() {
                setIsAdding(true);
              },
            }}
            search={{
              placeholder: "Search by Name or phone",
            }}
          />
        </SetupSidebarHearder>
        <SetupSidebarContent>
          {teacherList.map((teacher) => (
            <TeacherSidebarItem key={teacher.id} teacher={teacher} />
          ))}
          {teacherList.length === 0 && (
            <EmptyState
              icon={UsersIcon}
              title={isQuery ? "No teachers match this search." : "No teachers yet."}
              description={isQuery ? "Try another name or phone number." : "Add a teacher to get started."}
              noBorder
            />
          )}
        </SetupSidebarContent>
        <SetupSidebarFooter>
          <SidebarPagination itemCount={itemCount} />
        </SetupSidebarFooter>
      </SetupSidebar>
      <TeacherDialog open={isAdding} onOpenChange={setIsAdding} />
    </>
  );
}
