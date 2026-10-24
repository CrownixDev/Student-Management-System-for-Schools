"use client";

import {
  SidebarListItem,
  SidebarListItemContent,
  SidebarListItemIcon,
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
      <SidebarListItemIcon>{grade.number}</SidebarListItemIcon>
      <SidebarListItemContent>
        <SidebarListItemTitle>{grade.name}</SidebarListItemTitle>
      </SidebarListItemContent>
    </SidebarListItem>
  );
}
