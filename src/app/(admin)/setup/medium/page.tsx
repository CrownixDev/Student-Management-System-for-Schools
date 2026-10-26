import { filterCache } from "@/lib/nuqs/filter";
import { TypographyH1 } from "@/components/ui/typography";
import { Suspense } from "react";
import { PageLayout, PageLayoutContent, PageLayoutHeader } from "@/components/ui/page/page-layout";
import LoadingIndicator from "@/components/ui/loading-indicator";
import MediumNewBtn from "@/components/setup/medium/buttons/medium-new-btn";
import SearchInput from "@/components/ui/search-input";
import MediumTable from "@/components/setup/medium/medium-table";

export default async function Page({ searchParams }: PageProps<"/setup/medium">) {
  await filterCache.parse(searchParams);
  return (
    <PageLayout className="p-5">
      <PageLayoutHeader className="space-y-6">
        <div className="flex w-full items-center justify-between gap-5">
          <TypographyH1>Medium</TypographyH1>
          <MediumNewBtn />
        </div>
        <SearchInput placeholder="Search mediums..." />
      </PageLayoutHeader>
      <PageLayoutContent className="flex overflow-hidden py-5">
        <Suspense fallback={<LoadingIndicator />}>
          <MediumTable />
        </Suspense>
      </PageLayoutContent>
    </PageLayout>
  );
}
