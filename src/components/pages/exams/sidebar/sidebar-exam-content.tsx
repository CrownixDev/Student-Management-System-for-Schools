import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/shadcn/sidebar";
import { ArrowLeftIcon, GraduationCapIcon } from "lucide-react";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { Button, buttonVariants } from "@/components/shadcn/button";
import { IClassListItem } from "@/features/class";
import { IGradeListItem } from "@/features/grades";
import { IAcademicYear } from "@/features/academic-years";
import { IExamListItem } from "@/features/exams";
import { Separator } from "@/components/shadcn/separator";
import SidebarExamButton from "./sidebar-exam-button";
import EmptyState from "@/components/ui/empty-state";
import Link from "next/link";

export default function SidebarExamContent({
  year,
  gradeItem,
  classItem,
  examList,
}: {
  year: IAcademicYear;
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
          <TypographyH2>{classItem ? classItem.name : "View Results"}</TypographyH2>
          <TypographyP>({gradeItem.name})</TypographyP>
        </div>
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex-1">
          <TypographyP>All Exams</TypographyP>
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
                title="No exams found"
                description="You don't have any exams for this grade. Start by adding a new exam."
                action={
                  <Button className={"w-full"} variant={"outline"}>
                    <ArrowLeftIcon className="size-4" />
                    Take me to add a new exam
                  </Button>
                }
                noBorder
              />
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
