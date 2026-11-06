"use client";

import {
  SidebarListItem,
  SidebarListItemContent,
  SidebarListItemTitle,
} from "@/components/ui/sidebar/sidebar-list-item";
import { IGradeListItem } from "@/features/grades";
import { idParsers } from "@/lib/nuqs/id";
import { useQueryStates } from "nuqs";

export default function GradeSidebarItem({ grade }: { grade: IGradeListItem }) {
  const [{ gradeId: selectedGradeId }, setParsers] = useQueryStates(idParsers);
  const isSelected = selectedGradeId === grade.id;

  return (
    <SidebarListItem isActive={isSelected} onClick={() => setParsers({ gradeId: grade.id })}>
      <SidebarListItemContent>
        <SidebarListItemTitle>{grade.name}</SidebarListItemTitle>
      </SidebarListItemContent>
    </SidebarListItem>
  );
}
