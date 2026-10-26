import { academicYearsService, IAcademicYear } from "@/features/academic-years";
import { PageSidebar, PageSidebarContent } from "@/components/ui/page/page-sidebar";
import { gradesService, IGradeListItem } from "@/features/grades";
import { GraduationCapIcon } from "lucide-react";
import { filterCache } from "@/lib/nuqs/filter";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SetupSidebarHearder from "../../setup-sidebar-hearder";
import GradeSidebarItem from "./sidebar-item";
import EmptyState from "@/components/ui/empty-state";
import LoadingIndicator from "@/components/ui/loading-indicator";

async function SidebarContent() {
  const { search } = filterCache.all();
  let gradesList: IGradeListItem[] | null = null;

  try {
    gradesList = await gradesService.getList({ search });
  } catch (err) {
    console.error("Failed to load grades:", err);
    redirect("/setup");
  }

  return (
    <PageSidebarContent>
      {gradesList.map((grade) => (
        <GradeSidebarItem key={grade.id} grade={grade} />
      ))}

      {gradesList.length === 0 && (
        <div className="p-4">
          <EmptyState
            icon={GraduationCapIcon}
            title={search ? "No grades match search" : "No grades yet"}
            description={
              search
                ? "Try searching with a different grade number or name."
                : "Add grades in Setup first to start adding exams."
            }
            noBorder
          />
        </div>
      )}
    </PageSidebarContent>
  );
}

export default async function ExamsSidebar() {
  let activeYear: IAcademicYear | null = null;

  try {
    activeYear = await academicYearsService.getActiveYear();
  } catch (error) {
    console.log("Error fetching active year:", error);
    redirect("/setup");
  }
  return (
    <PageSidebar>
      <SetupSidebarHearder
        header={{ title: `Exams (${activeYear.name})` }}
        search={{ placeholder: "Search grades..." }}
      />
      <Suspense fallback={<LoadingIndicator />}>
        <SidebarContent />
      </Suspense>
    </PageSidebar>
  );
}
