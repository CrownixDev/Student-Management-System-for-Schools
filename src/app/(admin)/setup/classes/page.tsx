import ClassDetails from "@/components/setup/classes/class-details";
import ClassSidebar from "@/components/setup/classes/class-sidebar";
import LoadingIndicator from "@/components/ui/loading-indicator";
import { idCache } from "@/lib/nuqs/id";
import { filterCache } from "@/lib/nuqs/filter";
import { Suspense } from "react";
import { PageLayout, PageLayoutContent } from "@/components/ui/page/page-layout";

export default async function ClassesPage({ searchParams }: PageProps<"/setup/classes">) {
  const [, { classId }] = await Promise.all([filterCache.parse(searchParams), idCache.parse(searchParams)]);

  return (
    <PageLayout sidebar={<ClassSidebar />}>
      <PageLayoutContent>
        <Suspense key={classId} fallback={<LoadingIndicator />}>
          <ClassDetails />
        </Suspense>
      </PageLayoutContent>
    </PageLayout>
  );
}
