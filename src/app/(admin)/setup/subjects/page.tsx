import { Suspense } from "react";
import { filterCache } from "@/lib/nuqs/filter";
import LoadingIndicator from "@/components/ui/loading-indicator";
import { TypographyH1 } from "@/components/ui/typography";
import SubjectNewBtn from "@/components/setup/subjects/buttons/subject-new-btn";
import SearchInput from "@/components/ui/search-input";
import { Tabs, TabsContent, TabsList } from "@/components/shadcn/tabs";
import { subjectCategories } from "@/features/subjects/subject.enums";
import SubjectTabBtn from "@/components/setup/subjects/buttons/subject-tab-btn";
import { subjectTabCache } from "@/features/subjects/batch.cache";
import SubjectTable from "@/components/setup/subjects/subject-table";
import { PageLayout, PageLayoutContent, PageLayoutHeader } from "@/components/ui/page/page-layout";

export default async function page({ searchParams }: PageProps<"/setup/subjects">) {
  await filterCache.parse(searchParams);
  const { tab } = await subjectTabCache.parse(searchParams);

  return (
    <PageLayout className="p-5">
      <PageLayoutHeader className="space-y-5">
        <div className="flex w-full items-center justify-between gap-5">
          <TypographyH1>Subjects</TypographyH1>
          <SubjectNewBtn category={tab} />
        </div>
        <SearchInput placeholder="Search by Name or code" />
      </PageLayoutHeader>

      <PageLayoutContent className="py-5">
        <Tabs value={tab}>
          <TabsList className="w-full">
            {subjectCategories.map((cat) => (
              <SubjectTabBtn key={cat.value} value={cat.value}>
                {cat.label}
              </SubjectTabBtn>
            ))}
          </TabsList>
          {subjectCategories.map((cat) => (
            <TabsContent key={cat.value} value={cat.value}>
              {tab === cat.value && (
                <Suspense fallback={<LoadingIndicator />}>
                  <SubjectTable category={cat.value} />
                </Suspense>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </PageLayoutContent>
    </PageLayout>
  );
}
