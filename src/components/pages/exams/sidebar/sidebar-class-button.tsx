"use client";

import { idParsers } from "@/lib/nuqs/id";
import { useQueryStates } from "nuqs";
import { SidebarMenuButton, SidebarMenuItem } from "../../../shadcn/sidebar";
import { IClassListItem } from "@/features/class";

export default function SidebarClassButton({ classItem }: { classItem: IClassListItem }) {
  const [, setQuery] = useQueryStates(idParsers);
  return (
    <SidebarMenuItem key={classItem.id}>
      <SidebarMenuButton onClick={() => setQuery({ classId: classItem.id })}>
        <span>{classItem.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
