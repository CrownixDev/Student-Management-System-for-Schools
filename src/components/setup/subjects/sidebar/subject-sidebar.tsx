"use client";

import SubjectDialog, { subjectCategories } from "@/components/dialog/subject-dialog";
import {
  SetupSidebar,
  SetupSidebarContent,
  SetupSidebarFooter,
  SetupSidebarHearder,
} from "@/components/setup/sidebar/setup-sidebar";
import SidebarPagination from "@/components/ui/sidebar/sidebar-pagination";
import { ISubjectListItem } from "@/features/subjects/subject.types";
import { useState } from "react";
import SidebarHearder from "@/components/setup/sidebar/sidebar-hearder";
import SubjectSidebarItem from "./sidebar-item";

export default function SubjectSidebar({
  subjectList,
  itemCount,
  isQuery = false,
}: {
  itemCount: number;
  subjectList: ISubjectListItem[];
  isQuery: boolean;
}) {
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  return (
    <>
      <SetupSidebar>
        <SetupSidebarHearder>
          <SidebarHearder
            header={{
              title: "All Subjects",
              actionBtnlabel: "Add a new subject",
              onAction() {
                setIsAddingSubject(true);
              },
            }}
            search={{
              placeholder: "Search by Name, code, or category",
            }}
          />
        </SetupSidebarHearder>
        <SetupSidebarContent>
          {subjectList.map((subject) => {
            const category = subjectCategories.find((cat) => cat.value === subject.category)?.label ?? subject.category;
            return <SubjectSidebarItem key={subject.id} category={category} subject={subject} />;
          })}
          {subjectList.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-medium">{isQuery ? "No subjects match this search." : "No subjects yet."}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isQuery ? "Try a different search." : "Add a subject to get started."}
              </p>
            </div>
          )}
        </SetupSidebarContent>
        <SetupSidebarFooter>
          <SidebarPagination itemCount={itemCount} />
        </SetupSidebarFooter>
      </SetupSidebar>
      <SubjectDialog open={isAddingSubject} onOpenChange={setIsAddingSubject} />
    </>
  );
}
