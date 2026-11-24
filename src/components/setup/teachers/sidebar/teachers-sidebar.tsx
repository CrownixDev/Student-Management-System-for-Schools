import { Suspense } from "react";
import { UsersIcon } from "lucide-react";
import { filterCache } from "@/lib/nuqs/filter";
import { PageSidebar, PageSidebarContent, PageSidebarFooter } from "@/components/ui/page/page-sidebar";
import { getServerCaller } from "@/lib/orpc/server-caller";
import { safe } from "@orpc/client";
import TeachersSidebarHeader from "./teachers-sidebar-header";
import TeacherSidebarItem from "./teachers-sidebar-item";
import SidebarPagination from "@/components/ui/sidebar/sidebar-pagination";
import LoadingIndicator from "@/components/ui/loading-indicator";
import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";

async function SidebarContent() {
  const caller = await getServerCaller();
  const { search, page, limit } = filterCache.all();
  const { data: teachers, error, definedError } = await safe(caller.teacher.getList({ search, limit, page }));

  if (error) {
    return (
      <PageSidebarContent>
        <ErrorState
          type="absolute"
          title={definedError ? error.message : "Error loading teachers list"}
          description="Failed to load teacher list. Please try reloading the page."
        />
      </PageSidebarContent>
    );
  }

  return (
    <>
      <PageSidebarContent>
        {teachers.list.map((teacher) => (
          <TeacherSidebarItem key={teacher.id} teacher={teacher} />
        ))}
        {teachers.list.length === 0 && (
          <EmptyState
            icon={UsersIcon}
            title={search ? "No teachers match this search." : "No teachers yet."}
            description={search ? "Try another name or phone number." : "Add a teacher to get started."}
            noBorder
          />
        )}
      </PageSidebarContent>
      <PageSidebarFooter>
        <SidebarPagination itemCount={teachers.count} />
      </PageSidebarFooter>
    </>
  );
}

export default function TeachersSidebar() {
  return (
    <>
      <PageSidebar>
        <TeachersSidebarHeader />
        <Suspense fallback={<LoadingIndicator />}>
          <SidebarContent />
        </Suspense>
      </PageSidebar>
    </>
  );
}
