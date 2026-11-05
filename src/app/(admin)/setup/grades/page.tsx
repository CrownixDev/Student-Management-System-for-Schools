import { TypographyH1 } from "@/components/ui/typography";
import { Suspense } from "react";
import { filterCache } from "@/lib/nuqs/filter";
import { PageLayout, PageLayoutHeader } from "@/components/ui/page/page-layout";
import SearchInput from "@/components/ui/search-input";
import LoadingIndicator from "@/components/ui/loading-indicator";
import GradesNewBtn from "@/components/setup/grades/buttons/grades-new-btn";
import GradesContent from "@/components/setup/grades/grades-content";
import { academicYearsService, IAcademicYear } from "@/features/academic-years";
import { redirect } from "next/navigation";

export default async function page({ searchParams }: PageProps<"/setup/grades">) {
  await filterCache.parse(searchParams);

  let year: IAcademicYear | null = null;

  try {
    year = await academicYearsService.getActiveYear();
  } catch {
    redirect("/setup");
  }

  return (
    <PageLayout className="p-5">
      <PageLayoutHeader className="space-y-5">
        <div className="flex w-full items-center justify-between gap-5">
          <TypographyH1>Grades ({year.name})</TypographyH1>
          <GradesNewBtn year={year} />
        </div>
        <SearchInput placeholder="Search grades..." />
      </PageLayoutHeader>
      <Suspense fallback={<LoadingIndicator />}>
        <GradesContent year={year} />
      </Suspense>
    </PageLayout>
  );
}
