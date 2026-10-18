import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/shadcn/sidebar";
import { Button, buttonVariants } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { TypographyH1, TypographyH2, TypographyP } from "@/components/ui/typography";
import { ArrowLeftIcon, GraduationCapIcon, PlusIcon } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import Link from "next/link";
import { IAcademicYearListItem } from "@/features/academic-years";
import { IExamListItem } from "@/features/exams";
import SidebarExamButton from "./sidebar-exam-button";
import { IClassListItem } from "@/features/class";
import { IGradeListItem } from "@/features/grades";

export default function SidebarExamContent({
  year,
  gradeItem,
  classItem,
  examList,
}: {
  year: IAcademicYearListItem;
  classItem?: IClassListItem;
  gradeItem: IGradeListItem;
  examList: IExamListItem[];
}) {
  return (
    <>
      <SidebarHeader>
        <Link
          href={`/exams?yearId=${year.id}&gradeId=${gradeItem.id}`}
          className={buttonVariants({ variant: "outline", className: "w-fit" })}
        >
          <ArrowLeftIcon />
          Change class
        </Link>
        <div className="flex gap-3 items-center">
          <TypographyH1>{classItem ? classItem.name : "View Results"}</TypographyH1>
          <TypographyP>({gradeItem.name})</TypographyP>
        </div>
        <Separator />
        <TypographyH2>All Exams</TypographyH2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex-1">
          {examList.length > 0 && (
            <SidebarGroupContent>
              <SidebarMenu>
                {examList.map((examItem) => (
                  <SidebarExamButton key={examItem.id} examItem={examItem} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}

          {examList.length === 0 && (
            <SidebarGroupContent>
              <EmptyState
                icon={GraduationCapIcon}
                title="No grades found"
                description="You don't have any grades yet. Start by adding a new grade."
                action={
                  <Button className={"w-full"} variant={"outline"}>
                    <PlusIcon className="size-4" />
                    Take me to add a new exam
                  </Button>
                }
                noBorder              />
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
