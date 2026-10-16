"use client";

import { idParsers } from "@/lib/nuqs/id";
import { useQueryStates } from "nuqs";
import { SidebarMenuButton, SidebarMenuItem } from "../../shadcn/sidebar";
import { IExamListItem } from "@/features/exams";

export default function SidebarExamButton({ examItem }: { examItem: IExamListItem }) {
  const [_, setQuery] = useQueryStates(idParsers);
  return (
    <SidebarMenuItem key={examItem.id}>
      <SidebarMenuButton isActive={false} onClick={() => setQuery({ examId: examItem.id })}>
        <span>{examItem.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
