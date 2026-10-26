"use client";

import { useState } from "react";
import { PageSidebarHearder } from "@/components/ui/page/page-sidebar";
import SetupSidebarHearder from "@/components/setup/setup-sidebar-hearder";
import TeacherDialog from "@/components/dialog/teacher/teacher-dialog";

export default function TeachersSidebarHeader() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <PageSidebarHearder>
        <SetupSidebarHearder
          header={{ title: "All Teachers" }}
          action={{
            btnLabel: "Add a new teacher",
            onAction() {
              setIsOpen(true);
            },
          }}
          search={{ placeholder: "Search by Name or phone" }}
        />
      </PageSidebarHearder>
      {isOpen && <TeacherDialog open={isOpen} onOpenChange={setIsOpen} />}
    </>
  );
}
