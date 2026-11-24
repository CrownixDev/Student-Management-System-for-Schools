import { IAcademicYear } from "@/features/academic-years";
import { PageSidebar, PageSidebarContent } from "@/components/ui/page/page-sidebar";
import { GraduationCapIcon } from "lucide-react";
import { filterCache } from "@/lib/nuqs/filter";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getServerCaller } from "@/lib/orpc/server-caller";
import { safe } from "@orpc/client";
import SetupSidebarHearder from "../../setup-sidebar-hearder";
import GradeSidebarItem from "./sidebar-item";
import EmptyState from "@/components/ui/empty-state";
import LoadingIndicator from "@/components/ui/loading-indicator";
import ErrorState from "@/components/ui/error-state";

async function SidebarContent({ year }: { year: IAcademicYear }) {
  const caller = await getServerCaller();
  const { search } = filterCache.all();
  const { data: gradesList, error, definedError } = await safe(caller.grade.getList({ yearId: year.id, search }));

  if (error) {
    return (
      <ErrorState
        noBorder
        type="normal"
        title={definedError ? error.message : "Error loading grade list"}
        description="Failed to load grade list. Please try reloading the page."
      />
    );
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
  const caller = await getServerCaller();
  let activeYear: IAcademicYear | null = null;

  try {
    activeYear = await caller.academicYear.getActiveYear();
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
        <SidebarContent year={activeYear} />
      </Suspense>
    </PageSidebar>
  );
}
