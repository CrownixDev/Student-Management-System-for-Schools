import { redirect } from "next/navigation";
import { IAcademicYear } from "@/features/academic-years";
import { gradesService, IGradeWithClassesItem } from "@/features/grades";
import { GraduationCapIcon } from "lucide-react";
import { filterCache } from "@/lib/nuqs/filter";
import {
  PageSidebar,
  PageSidebarContent,
  PageSidebarFooter,
  PageSidebarHearder,
} from "@/components/ui/page/page-sidebar";
import { Separator } from "@/components/shadcn/separator";
import ClassSidebarItem from "./class-sidebar-item";
import EmptyState from "@/components/ui/empty-state";
import ClassSidebarHeader from "./class-sidebar-header";
import { getServerCaller } from "@/lib/orpc/server-caller";

export default async function ClassSidebar() {
  const caller = await getServerCaller();
  const search = filterCache.get("search");
  let activeYear: IAcademicYear | null = null;
  let grades: IGradeWithClassesItem[] | null = null;

  try {
    activeYear = await caller.academicYear.getActiveYear();
    grades = await gradesService.getListWithClasses(activeYear.id);
  } catch (error) {
    console.log("Error fetching active year or grades:", error);
    redirect("/setup");
  }

  const totalClasses = grades.reduce((total, grade) => total + grade.classes.length, 0);

  return (
    <>
      <PageSidebar>
        <PageSidebarHearder>
          <ClassSidebarHeader year={activeYear} />
        </PageSidebarHearder>
        <PageSidebarContent>
          {grades.map((grade) => {
            return <ClassSidebarItem key={grade.id} grade={grade} />;
          })}
          {grades.length === 0 && (
            <EmptyState
              icon={GraduationCapIcon}
              title={search ? "No results found for your search" : "No grades found"}
              description={
                search ? "Try adjusting your search criteria." : "Please add grades first to manage classes."
              }
              noBorder
            />
          )}
        </PageSidebarContent>
        <PageSidebarFooter>
          <Separator />
          <p className="w-full flex justify-center items-center py-2 text-xs text-muted-foreground">
            {totalClasses} classes across {grades.length} grades
          </p>
        </PageSidebarFooter>
      </PageSidebar>
    </>
  );
}
