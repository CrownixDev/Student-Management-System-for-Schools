import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/shadcn/sidebar";
import { Button, buttonVariants } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import { ArrowLeftIcon, GraduationCapIcon } from "lucide-react";
import { IGradeListItemForYear } from "@/features/grades";
import EmptyState from "@/components/admin/empty-state";
import SidebarGradeButton from "./sidebar-grade-button";
import Link from "next/link";
import { IAcademicYearListItem } from "@/features/academic-years";

export default function SidebarGradeContent({
  year,
  grades,
}: {
  year: IAcademicYearListItem;
  grades: IGradeListItemForYear[];
}) {
  return (
    <>
      <SidebarHeader>
        <Link href={"/nav/exams"} className={buttonVariants({ variant: "outline", className: "w-fit" })}>
          <ArrowLeftIcon />
          Change year
        </Link>
        <TypographyH1>Year {year.name}</TypographyH1>
        <Separator />
        <TypographyH2>All Grades</TypographyH2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex-1">
          {grades.length > 0 && (
            <SidebarGroupContent>
              <SidebarMenu>
                {grades.map((grade) => (
                  <SidebarGradeButton key={grade.id} gradeItem={grade} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}

          {grades.length === 0 && (
            <SidebarGroupContent>
              <EmptyState
                icon={GraduationCapIcon}
                title="No grades found"
                description="You don't have any grades yet. Start by adding a new grade."
                action={
                  <Button className={"w-full"} variant={"outline"} render={<Link href={"/nav/setup"} />}>
                    <ArrowLeftIcon className="size-4" />
                    Take me to add a new grade
                  </Button>
                }
                border={false}
              />
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
