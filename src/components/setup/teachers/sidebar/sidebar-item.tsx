"use client";

import {
  SidebarListItem,
  SidebarListItemContent,
  SidebarListItemIcon,
  SidebarListItemTitle,
} from "@/components/ui/sidebar/sidebar-list-item";
import { ITeacherListItem } from "@/features/teachers";
import { idParsers } from "@/lib/nuqs/id";
import { UserIcon } from "lucide-react";
import { useQueryStates } from "nuqs";

export default function TeacherSidebarItem({ teacher }: { teacher: ITeacherListItem }) {
  const [{ teacherId: selectedTeacherId }, setParsers] = useQueryStates(idParsers);

  const isSelected = selectedTeacherId === teacher.id;

  return (
    <SidebarListItem isActive={isSelected} onClick={() => setParsers({ teacherId: teacher.id })}>
      <SidebarListItemIcon>
        <UserIcon className="size-5" />
      </SidebarListItemIcon>
      <SidebarListItemContent>
        <SidebarListItemTitle>{teacher.fullName}</SidebarListItemTitle>
      </SidebarListItemContent>
    </SidebarListItem>
  );
}
