import StudentsTable from "@/components/setup/students/students-table";
import StudentFilters from "@/components/setup/students/student-filters";
import { Separator } from "@/components/shadcn/separator";
import { TypographyH1 } from "@/components/ui/typography";
import SearchInput from "@/components/ui/search-input";
import { Suspense } from "react";
import LoadingIndicator from "@/components/ui/loading-indicator";
import { filterCache } from "@/lib/nuqs/filter";
import { studentFilterCach } from "@/features/students/student.cache";
import StudentsNewBtn from "@/components/setup/students/students-new-btn";

export default async function page({ searchParams }: PageProps<"/setup/students">) {
  await filterCache.parse(searchParams);
  await studentFilterCach.parse(searchParams);

  return (
    <div className="box-border flex h-[calc(100svh-1rem)] min-h-0 min-w-0 flex-col gap-6 overflow-hidden p-8">
      <div className="flex w-full shrink-0 items-center justify-between gap-5">
        <TypographyH1 className="text-2xl font-bold tracking-tight">Students</TypographyH1>
        <StudentsNewBtn />
      </div>
      <div className="flex shrink-0 items-start gap-2">
        <SearchInput placeholder="Search students..." />
        <StudentFilters />
      </div>
      <Separator className="shrink-0" />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Suspense fallback={<LoadingIndicator />}>
          <StudentsTable />
        </Suspense>
      </div>
    </div>
  );
}
