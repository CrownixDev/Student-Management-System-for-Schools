import { redirect } from "next/navigation";
import { academicYearsService, IAcademicYear } from "@/features/academic-years";
import { gradesService, IGradeWithClassesItem } from "@/features/grades";
import SidebarHearder from "@/components/setup/sidebar/sidebar-hearder";
import ClassSidebarItem from "./class-sidebar-item";
import EmptyState from "@/components/ui/empty-state";
import { GraduationCapIcon } from "lucide-react";
import { filterCache } from "@/lib/nuqs/filter";
import { SetupSidebar, SetupSidebarContent, SetupSidebarFooter, SetupSidebarHearder } from "../sidebar/setup-sidebar";
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
      <SetupSidebar>
        <SetupSidebarHearder>
          <SidebarHearder
            header={{ title: `All Classes (${activeYear.name})` }}
            search={{ placeholder: "Search by class or grade" }}
          />
        </SetupSidebarHearder>
        <SetupSidebarContent>
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
        </SetupSidebarContent>
        <SetupSidebarFooter>
          <Separator />
          <p className="w-full flex justify-center items-center py-2 text-xs text-muted-foreground">
            {totalClasses} classes across {grades.length} grades
          </p>
        </SetupSidebarFooter>
      </SetupSidebar>
    </>
  );
}
