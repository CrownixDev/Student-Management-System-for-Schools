import { idCache } from "@/lib/nuqs/id";
import { filterCache } from "@/lib/nuqs/filter";
import TeachersSidebar from "@/components/setup/teachers/sidebar/teachers-sidebar";
import TeacherDetails from "@/components/setup/teachers/teacher-details";
import { Suspense } from "react";
import PageLoading from "@/components/ui/page-loading";

export default async function page({ searchParams }: PageProps<"/setup/teachers">) {
  await filterCache.parse(searchParams);
  const { teacherId } = await idCache.parse(searchParams);

  return (
    <div className="flex w-full h-screen">
      <TeachersSidebar />
      <Suspense key={teacherId} fallback={<PageLoading />}>
        <TeacherDetails />
      </Suspense>
    </div>
  );
}
