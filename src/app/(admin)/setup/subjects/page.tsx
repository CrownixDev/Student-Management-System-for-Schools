import { Suspense } from "react";
import { idCache } from "@/lib/nuqs/id";
import { filterCache } from "@/lib/nuqs/filter";
import SubjectDetails from "@/components/setup/subjects/subject.details";
import SubjectSidebar from "@/components/setup/subjects/sidebar/subject-sidebar";
import PageLoading from "@/components/ui/page-loading";

export default async function page({ searchParams }: PageProps<"/setup/subjects">) {
  await filterCache.parse(searchParams);
  const { subjectId } = await idCache.parse(searchParams);

  return (
    <div className="flex w-full h-screen">
      <SubjectSidebar />
      <Suspense key={subjectId} fallback={<PageLoading />}>
        <SubjectDetails />
      </Suspense>
    </div>
  );
}
