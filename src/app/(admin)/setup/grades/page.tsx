import { TypographyH1 } from "@/components/ui/typography";
import { Suspense } from "react";
import { Separator } from "@/components/shadcn/separator";
import { filterCache } from "@/lib/nuqs/filter";
import SearchInput from "@/components/ui/search-input";
import LoadingIndicator from "@/components/ui/loading-indicator";
import GradesNewBtn from "@/components/setup/grades/buttons/grades-new-btn";
import GradesContent from "@/components/setup/grades/grades-content";
import { PageLayout, PageLayoutHeader } from "@/components/ui/page/page-layout";

export default async function page({ searchParams }: PageProps<"/setup/grades">) {
  await filterCache.parse(searchParams);

  return (
    <PageLayout className="p-5">
      <PageLayoutHeader className="space-y-5">
        <div className="flex w-full items-center justify-between gap-5">
          <TypographyH1>Grades</TypographyH1>
          <GradesNewBtn />
        </div>
        <SearchInput placeholder="Search grades..." />
        <Separator />
      </PageLayoutHeader>
      <Suspense fallback={<LoadingIndicator />}>
        <GradesContent />
      </Suspense>
    </PageLayout>
  );
}
