import {
  SetupSidebar,
  SetupSidebarContent,
  SetupSidebarFooter,
  SetupSidebarHearder,
} from "@/components/setup/sidebar/setup-sidebar";
import SidebarPagination from "@/components/ui/sidebar/sidebar-pagination";
import SubjectSidebarItem from "./subject-sidebar-item";
import EmptyState from "@/components/ui/empty-state";
import { LibraryBig } from "lucide-react";
import SubjectSidebarHeader from "./subject-sidebar-header";
import { subjectCategories } from "@/features/subjects/subject.enums";
import { filterCache } from "@/lib/nuqs/filter";
import { subjectService } from "@/features/subjects";
import { Suspense } from "react";
import PageLoading from "@/components/ui/page-loading";

async function SidebarContent() {
  const { search, page, limit } = filterCache.all();
  const subjects = await subjectService.getList({ search, page, limit });
  return (
    <>
      <SetupSidebarContent>
        {subjects.list.map((subject) => {
          const category = subjectCategories.find((cat) => cat.value === subject.category)?.label ?? subject.category;
          return <SubjectSidebarItem key={subject.id} category={category} subject={subject} />;
        })}

        {subjects.list.length === 0 && (
          <EmptyState
            icon={LibraryBig}
            title={search ? "No subjects match this search." : "No subjects yet."}
            description={search ? "Try a different search." : "Add a subject to get started."}
            noBorder
          />
        )}
      </SetupSidebarContent>
      <SetupSidebarFooter>
        <SidebarPagination itemCount={subjects.count} />
      </SetupSidebarFooter>
    </>
  );
}

export default function SubjectSidebar() {
  return (
    <>
      <SetupSidebar>
        <SetupSidebarHearder>
          <SubjectSidebarHeader />
        </SetupSidebarHearder>
        <Suspense fallback={<PageLoading />}>
          <SidebarContent />
        </Suspense>
      </SetupSidebar>
    </>
  );
}
