import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { IGradeListItemForYear } from "@/features/grades";
import { GraduationCapIcon } from "lucide-react";
import { IAcademicYear } from "@/features/academic-years";
import { IBatch } from "@/features/batch";
import { Badge } from "@/components/shadcn/badge";
import YearBatchSelectorDialog from "@/components/dialog/sidebar/year-batch-selector-dialog";
import AppSidebarFooter from "@/components/ui/sidebar/sidebar-footer";
import EmptyState from "@/components/ui/empty-state";
import Link from "next/link";

export default function GradesSidebar({
  grades = [],
  year,
  batch,
}: {
  year: IAcademicYear | null;
  batch: IBatch | null;
  grades?: IGradeListItemForYear[];
}) {
  return (
    <Sidebar collapsible="none" className="sticky top-0 h-screen">
      <SidebarHeader>
        <TypographyH1>Students</TypographyH1>
        <YearBatchSelectorDialog />
      </SidebarHeader>
      <SidebarContent>
        {year && (
          <SidebarGroup className="flex-1">
            <TypographyP>All Grades</TypographyP>
            {grades.length > 0 && (
              <SidebarGroupContent>
                <SidebarMenu>
                  {grades.map((grade) => (
                    <SidebarMenuItem key={grade.id}>
                      <SidebarMenuButton
                        isActive={false}
                        render={<Link href={`/grades/${grade.id}?yearId=${year.id}`} />}
                      >
                        <GraduationCapIcon aria-hidden="true" />
                        <span>{grade.name}</span>
                        {true && (
                          <Badge variant="outline" className="ml-auto h-5 px-1.5 text-[11px]">
                            {grade.classCount}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}

            {grades.length === 0 && (
              <SidebarGroupContent>
                <EmptyState
                  icon={GraduationCapIcon}
                  title="No Grades Found"
                  description="Add a new grade to this year to get started."
                  noBorder
                />
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        )}

        {batch &&
          batch.academicYears.length > 0 &&
          batch.academicYears.map((year) => (
            <SidebarGroup key={year.id}>
              <TypographyP>All Grades</TypographyP>
              <SidebarGroupLabel>{year.name}</SidebarGroupLabel>
              <SidebarGroupContent>
                {year.grades.map((grade) => (
                  <SidebarMenu key={grade.id}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={false}
                        render={<Link href={`/grades/${grade.id}?yearId=${year.id}&batchId=${batch.id}`} />}
                      >
                        <GraduationCapIcon aria-hidden="true" />
                        <span>{grade.name}</span>
                        {true && (
                          <Badge variant="outline" className="ml-auto h-5 px-1.5 text-[11px]">
                            {grade.classCount}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

        {batch && batch.academicYears.length === 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <EmptyState
                icon={GraduationCapIcon}
                title="No Grades Found"
                description="Add a new grade to this batch to get started."
                noBorder
              />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  );
}
