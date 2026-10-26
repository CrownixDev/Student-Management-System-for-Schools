import { PageLayout, PageLayoutHeader } from "@/components/ui/page/page-layout";
import { TypographyH1 } from "@/components/ui/typography";
import { Separator } from "@/components/shadcn/separator";
import { Suspense } from "react";
import { filterCache } from "@/lib/nuqs/filter";
import SearchInput from "@/components/ui/search-input";
import LoadingIndicator from "@/components/ui/loading-indicator";
import YearsNewBtn from "@/components/setup/years/buttons/years-new-btn";
import YearsContent from "@/components/setup/years/years-content";

export default async function page({ searchParams }: PageProps<"/setup/years">) {
  await filterCache.parse(searchParams);
  return (
    <PageLayout>
      <PageLayoutHeader className="space-y-5">
        <div className="flex w-full justify-between items-center">
          <TypographyH1>Academic Years</TypographyH1>
          <YearsNewBtn />
        </div>
        <SearchInput placeholder="Search academic years..." />
        <Separator />
      </PageLayoutHeader>
      <Suspense fallback={<LoadingIndicator />}>
        <YearsContent />
      </Suspense>
    </PageLayout>
  );
}
