import { TypographyH2 } from "@/components/ui/typography";
import { Button } from "@/components/shadcn/button";
import { PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../shadcn/input-group";
import { Separator } from "@/components/shadcn/separator";
import { SidebarTrigger } from "@/components/shadcn/sidebar";
import { IStudentsListItem } from "@/features/students";
import StudentListItem from "./student-list-item";

export default function ClassSidebar({ studentList }: { studentList: IStudentsListItem[] }) {
  return (
    <aside className="flex flex-col w-[18rem] border border-r border-sidebar-border ">
      <div className="flex flex-col gap-3 p-3 ">
        <SidebarTrigger />
        <div className="flex items-center justify-between gap-3">
          <TypographyH2>Grade 12 T1</TypographyH2>
          <Button size="sm">
            <PlusIcon className="size-3.5" aria-hidden="true" />
            Add student
          </Button>
        </div>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search Name or admission no." />
          <InputGroupButton size={"icon-sm"}>
            <XIcon />
          </InputGroupButton>
        </InputGroup>
        <Separator />
      </div>
      <div className="overflow-y-auto mb-3">
        {studentList.map((student) => (
          <StudentListItem key={student.id} student={student} />
        ))}
      </div>
    </aside>
  );
}
