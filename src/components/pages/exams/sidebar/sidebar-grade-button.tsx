"use client";

import { idParsers } from "@/lib/nuqs/id";
import { useQueryStates } from "nuqs";
import { SidebarMenuButton, SidebarMenuItem } from "../../../shadcn/sidebar";
import { Badge } from "../../../shadcn/badge";
import { IGradeListItemForYear } from "@/features/grades";

export default function SidebarGradeButton({ gradeItem }: { gradeItem: IGradeListItemForYear }) {
  const [, setQuery] = useQueryStates(idParsers);
  return (
    <SidebarMenuItem key={gradeItem.id}>
      <SidebarMenuButton isActive={false} onClick={() => setQuery({ gradeId: gradeItem.id })}>
        <span>{gradeItem.name}</span>
        {true && (
          <Badge variant="outline" className="ml-auto h-5 px-1.5 text-[11px]">
            {gradeItem.classCount}
          </Badge>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
