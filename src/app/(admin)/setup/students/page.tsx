import { TypographyH1 } from "@/components/ui/typography";
import { Suspense } from "react";
import { PageLayout, PageLayoutHeader } from "@/components/ui/page/page-layout";
import { filterCache } from "@/lib/nuqs/filter";
import { studentFilterCach } from "@/features/students/student.cache";
import LoadingIndicator from "@/components/ui/loading-indicator";
import SearchInput from "@/components/ui/search-input";
import StudentsTable from "@/components/setup/students/students-table";
import StudentFilters from "@/components/setup/students/student-filters";
import StudentsNewBtn from "@/components/setup/students/students-new-btn";

export default async function page({ searchParams }: PageProps<"/setup/students">) {
  await filterCache.parse(searchParams);
  await studentFilterCach.parse(searchParams);

  return (
    <PageLayout className="p-5">
      <PageLayoutHeader className="space-y-5">
        <div className="flex w-full items-center justify-between gap-5">
          <TypographyH1 className="text-2xl font-bold tracking-tight">Students</TypographyH1>
          <StudentsNewBtn />
        </div>
        <div className="flex items-start gap-5">
          <SearchInput placeholder="Search students..." />
          <StudentFilters />
        </div>
      </PageLayoutHeader>
      <Suspense fallback={<LoadingIndicator />}>
        <StudentsTable />
      </Suspense>
    </PageLayout>
  );
}
