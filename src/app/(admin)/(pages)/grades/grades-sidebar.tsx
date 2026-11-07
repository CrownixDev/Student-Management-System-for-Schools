import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";
import { buttonVariants } from "@/components/shadcn/button";
import { GraduationCapIcon, HomeIcon } from "lucide-react";
import { Badge } from "@/components/shadcn/badge";
import { IGradeListItemForYear } from "@/features/grades";
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { IAcademicYear } from "@/features/academic-years";
import { Separator } from "@/components/shadcn/separator";
import { IBatch } from "@/features/batch";
import EmptyState from "@/components/ui/empty-state";
import Link from "next/link";
import YearBatchSelectorDialog from "@/components/dialog/sidebar/year-batch-selector-dialog";

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
      <SidebarFooter>
        <Link href={"/"} className={buttonVariants({ variant: "outline" })}>
          <HomeIcon />
          Go Home
        </Link>
        <Separator />
        <p className="text-xs text-sidebar-foreground/60 text-center">A Project by CROWNIX</p>
      </SidebarFooter>
    </Sidebar>
  );
}
