"use client";

import { useState } from "react";
import SidebarHearder from "@/components/setup/sidebar/sidebar-hearder";
import SubjectDialog from "@/components/dialog/subject/subject-dialog";

export default function SubjectSidebarHeader() {
  const [open, isOpen] = useState(false);
  return (
    <>
      <SidebarHearder
        header={{ title: "All Subjects" }}
        action={{
          btnLabel: "Add a new subject",
          onAction() {
            isOpen(true);
          },
        }}
        search={{ placeholder: "Search by Name, code, or category" }}
      />
      {open && <SubjectDialog open={open} onOpenChange={isOpen} />}
    </>
  );
}
