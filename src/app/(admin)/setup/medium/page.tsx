import { filterCache } from "@/lib/nuqs/filter";
import { TypographyH1 } from "@/components/ui/typography";
import SearchInput from "@/components/ui/search-input";
import { Separator } from "@/components/shadcn/separator";
import MediumTable from "@/components/setup/medium/medium-table";
import { Suspense } from "react";
import PageLoading from "@/components/ui/page-loading";
import MediumNewBtn from "@/components/setup/medium/buttons/medium-new-btn";

export default async function Page({ searchParams }: PageProps<"/setup/medium">) {
  await filterCache.parse(searchParams);
  return (
    <div className="flex flex-col w-full h-screen overflow-y-auto p-8 space-y-6">
      <div className="flex w-full items-center justify-between gap-5">
        <TypographyH1>Medium</TypographyH1>
        <MediumNewBtn />
      </div>
      <SearchInput placeholder="Search mediums..." />
      <Separator />
      <Suspense fallback={<PageLoading />}>
        <MediumTable />
      </Suspense>
    </div>
  );
}
