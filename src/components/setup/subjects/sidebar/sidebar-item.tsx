"use client";

import {
  SidebarListItem,
  SidebarListItemContent,
  SidebarListItemDescription,
  SidebarListItemIcon,
  SidebarListItemTitle,
} from "@/components/ui/sidebar/sidebar-list-item";
import { ISubjectListItem } from "@/features/subjects";
import { idParsers } from "@/lib/nuqs/id";
import { BookOpenIcon } from "lucide-react";
import { useQueryStates } from "nuqs";

export default function SubjectSidebarItem({ subject, category }: { subject: ISubjectListItem; category: string }) {
  const [{ subjectId }, setParsers] = useQueryStates(idParsers);

  const isSelected = subjectId === subject.id;
  return (
    <SidebarListItem isActive={isSelected} onClick={() => setParsers({ subjectId: subject.id })}>
      <SidebarListItemIcon>
        <BookOpenIcon className="size-5" />
      </SidebarListItemIcon>
      <SidebarListItemContent>
        <SidebarListItemTitle>{subject.name}</SidebarListItemTitle>
        <SidebarListItemDescription>{category}</SidebarListItemDescription>
      </SidebarListItemContent>
    </SidebarListItem>
  );
}
