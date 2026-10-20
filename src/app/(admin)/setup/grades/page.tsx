import { TypographyH1 } from "@/components/ui/typography";
import { Suspense } from "react";
import { Separator } from "@/components/shadcn/separator";
import { filterCache } from "@/lib/nuqs/filter";
import SearchInput from "@/components/ui/search-input";
import PageLoading from "@/components/ui/page-loading";
import GradesNewBtn from "@/components/setup/grades/buttons/grades-new-btn";
import GradesTable from "@/components/setup/grades/grades-table";

export default async function page({ searchParams }: PageProps<"/setup/grades">) {
  await filterCache.parse(searchParams);

  return (
    <div className="flex flex-col overflow-y-auto p-8 space-y-6">
      <div className="flex w-full items-center justify-between gap-5">
        <TypographyH1 className="text-xl lg:text-2xl font-bold tracking-tight">Grades</TypographyH1>
        <GradesNewBtn />
      </div>
      <SearchInput placeholder="Search grades..." />
      <Separator />
      <Suspense fallback={<PageLoading />}>
        <GradesTable />
      </Suspense>
    </div>
  );
}
