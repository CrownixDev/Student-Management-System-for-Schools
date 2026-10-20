"use client";

import { useState } from "react";
import { SetupSidebarHearder } from "@/components/setup/sidebar/setup-sidebar";
import SidebarHearder from "@/components/setup/sidebar/sidebar-hearder";
import TeacherDialog from "@/components/dialog/teacher/teacher-dialog";

export default function TeachersSidebarHeader() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <SetupSidebarHearder>
        <SidebarHearder
          header={{ title: "All Teachers" }}
          action={{
            btnLabel: "Add a new teacher",
            onAction() {
              setIsOpen(true);
            },
          }}
          search={{ placeholder: "Search by Name or phone" }}
        />
      </SetupSidebarHearder>
      {isOpen && <TeacherDialog open={isOpen} onOpenChange={setIsOpen} />}
    </>
  );
}
