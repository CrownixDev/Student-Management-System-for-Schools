import { idCache } from "@/lib/nuqs/id";
import { Suspense } from "react";
import ExamsSidebar from "@/components/setup/exams/sidebar/exams-sidebar";
import LoadingIndicator from "@/components/ui/loading-indicator";
import ExamsDetails from "@/components/setup/exams/exams-details";
import { filterCache } from "@/lib/nuqs/filter";

export default async function Page({ searchParams }: PageProps<"/setup/exams">) {
  await filterCache.parse(searchParams);
  const { gradeId } = await idCache.parse(searchParams);

  return (
    <div className="flex w-full h-screen">
      <ExamsSidebar />
      <Suspense key={gradeId} fallback={<LoadingIndicator />}>
        <ExamsDetails />
      </Suspense>
    </div>
  );
}
