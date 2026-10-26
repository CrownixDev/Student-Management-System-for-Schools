import { idCache } from "@/lib/nuqs/id";
import { filterCache } from "@/lib/nuqs/filter";
import { Suspense } from "react";
import { PageLayout, PageLayoutContent } from "@/components/ui/page/page-layout";
import LoadingIndicator from "@/components/ui/loading-indicator";
import TeachersSidebar from "@/components/setup/teachers/sidebar/teachers-sidebar";
import TeacherDetails from "@/components/setup/teachers/teacher-details";

export default async function page({ searchParams }: PageProps<"/setup/teachers">) {
  await filterCache.parse(searchParams);
  const { teacherId } = await idCache.parse(searchParams);

  return (
    <PageLayout sidebar={<TeachersSidebar />}>
      <PageLayoutContent>
        <Suspense key={teacherId} fallback={<LoadingIndicator />}>
          <TeacherDetails />
        </Suspense>
      </PageLayoutContent>
    </PageLayout>
  );
}
