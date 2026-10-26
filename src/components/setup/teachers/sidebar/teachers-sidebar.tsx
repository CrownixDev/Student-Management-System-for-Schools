import { Suspense } from "react";
import { UsersIcon } from "lucide-react";
import { filterCache } from "@/lib/nuqs/filter";
import { teachersService } from "@/features/teachers";
import { SetupSidebar, SetupSidebarContent, SetupSidebarFooter } from "@/components/setup/sidebar/setup-sidebar";
import TeachersSidebarHeader from "./teachers-sidebar-header";
import TeacherSidebarItem from "./teachers-sidebar-item";
import SidebarPagination from "@/components/ui/sidebar/sidebar-pagination";
import LoadingIndicator from "@/components/ui/loading-indicator";
import EmptyState from "@/components/ui/empty-state";

async function SidebarContent() {
  const { search, page, limit } = await filterCache.all();
  const teachers = await teachersService.getList({ search, limit, page });

  return (
    <>
      <SetupSidebarContent>
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
      </SetupSidebarContent>
      <SetupSidebarFooter>
        <SidebarPagination itemCount={teachers.count} />
      </SetupSidebarFooter>
    </>
  );
}

export default function TeachersSidebar() {
  return (
    <>
      <SetupSidebar>
        <TeachersSidebarHeader />
        <Suspense fallback={<LoadingIndicator />}>
          <SidebarContent />
        </Suspense>
      </SetupSidebar>
    </>
  );
}
