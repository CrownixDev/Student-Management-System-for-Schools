import { redirect } from "next/navigation";
import { academicYearsService, IAcademicYear } from "@/features/academic-years";
import { gradesService, IGradeWithClassesItem } from "@/features/grades";
import SetupSidebarHearder from "@/components/setup/setup-sidebar-hearder";
import ClassSidebarItem from "./class-sidebar-item";
import EmptyState from "@/components/ui/empty-state";
import { GraduationCapIcon } from "lucide-react";
import { filterCache } from "@/lib/nuqs/filter";
import {
  PageSidebar,
  PageSidebarContent,
  PageSidebarFooter,
  PageSidebarHearder,
} from "@/components/ui/page/page-sidebar";
import { Separator } from "@/components/shadcn/separator";

export default async function ClassSidebar() {
  const search = filterCache.get("search");
  let activeYear: IAcademicYear | null = null;
  let grades: IGradeWithClassesItem[] | null = null;

  try {
    activeYear = await academicYearsService.getActiveYear();
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
          <SetupSidebarHearder header={{ title: `All Classes (${activeYear.name})` }} />
        </PageSidebarHearder>
        <PageSidebarContent>
          {grades.map((grade) => {
            return <ClassSidebarItem key={grade.id} year={activeYear} grade={grade} />;
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
