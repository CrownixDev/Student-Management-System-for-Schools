import { TypographyH1 } from "@/components/ui/typography";
import { Separator } from "@/components/shadcn/separator";
import SearchInput from "@/components/ui/search-input";
import { Suspense } from "react";
import PageLoading from "@/components/ui/page-loading";
import YearsNewBtn from "@/components/setup/years/buttons/years-new-btn";
import YearsTable from "@/components/setup/years/years-table";
import { filterCache } from "@/lib/nuqs/filter";

export default async function page({ searchParams }: PageProps<"/setup/years">) {
  await filterCache.parse(searchParams);
  return (
    <div className="flex flex-col overflow-y-auto p-8 space-y-6">
      <div className="flex w-full items-center justify-between gap-5">
        <TypographyH1 className="text-xl lg:text-2xl font-bold tracking-tight">Academic Years</TypographyH1>
        <YearsNewBtn />
      </div>
      <SearchInput placeholder="Search academic years..." />
      <Separator />
      <Suspense fallback={<PageLoading />}>
        <YearsTable />
      </Suspense>
    </div>
  );
}
