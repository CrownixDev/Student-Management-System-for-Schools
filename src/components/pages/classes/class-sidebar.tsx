"use client";

import { TypographyH2 } from "@/components/ui/typography";
import { UsersRoundIcon } from "lucide-react";
import { Separator } from "@/components/shadcn/separator";
import { SidebarTrigger } from "@/components/shadcn/sidebar";
import { useState } from "react";
import { IClass } from "@/features/class";
import StudentListItem from "./student-list-item";
import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";
import Fuse from "fuse.js";

export default function ClassSidebar({ classData }: { classData: IClass }) {
  const [search, setSearch] = useState("");

  const fuse = new Fuse(classData.enrollments, {
    threshold: 0.1,
    useTokenSearch: true,
    keys: ["student.admissionNo", "student.fullName", "classIndex"],
  });

  const searchResult = fuse
    .search(search)
    .map((r) => r.item)
    .sort((a, b) => {
      if (a.classIndex === null) return b.classIndex === null ? 0 : 1;
      if (b.classIndex === null) return -1;
      return a.classIndex - b.classIndex;
    });

  return (
    <aside className="flex flex-col w-[18rem] border border-r border-sidebar-border ">
      <div className="flex flex-col gap-3 p-3 ">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <TypographyH2 title={classData.name} className="truncate">
            {classData.name}
          </TypographyH2>
        </div>

        <SearchInput
          placeholder="Search Name or admission no."
          value={search}
          onChange={(value) => setSearch(value)}
          onClear={() => setSearch("")}
        />

        <Separator />
      </div>
      <div className="overflow-y-auto mb-3">
        {searchResult.map((enrollment) => (
          <StudentListItem key={enrollment.id} enrollment={enrollment} />
        ))}
        {classData.enrollments.length === 0 && (
          <EmptyState
            icon={UsersRoundIcon}
            title={search ? "No students found" : "No students in this class"}
            description={
              search
                ? "Try searching with a different name or admission number"
                : "This class currently has no students enrolled."
            }
            noBorder
          />
        )}
      </div>
    </aside>
  );
}
