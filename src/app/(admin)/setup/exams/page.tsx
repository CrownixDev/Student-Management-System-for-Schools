import { idCache } from "@/lib/nuqs/id";
import { Suspense } from "react";
import { filterCache } from "@/lib/nuqs/filter";
import { PageLayout, PageLayoutContent } from "@/components/ui/page/page-layout";
import ExamsSidebar from "@/components/setup/exams/sidebar/exams-sidebar";
import LoadingIndicator from "@/components/ui/loading-indicator";
import ExamsDetails from "@/components/setup/exams/exams-details";

export default async function Page({ searchParams }: PageProps<"/setup/exams">) {
  await filterCache.parse(searchParams);
  const { gradeId } = await idCache.parse(searchParams);

  return (
    <PageLayout sidebar={<ExamsSidebar />}>
      <PageLayoutContent>
        <Suspense key={gradeId} fallback={<LoadingIndicator />}>
          <ExamsDetails />
        </Suspense>
      </PageLayoutContent>
    </PageLayout>
  );
}
