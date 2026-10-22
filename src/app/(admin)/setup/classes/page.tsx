import ClassDetails from "@/components/setup/classes/class-details";
import ClassSidebar from "@/components/setup/classes/class-sidebar";
import PageLoading from "@/components/ui/page-loading";
import { idCache } from "@/lib/nuqs/id";
import { filterCache } from "@/lib/nuqs/filter";
import { Suspense } from "react";

export default async function ClassesPage({ searchParams }: PageProps<"/setup/classes">) {
  const [, { classId }] = await Promise.all([filterCache.parse(searchParams), idCache.parse(searchParams)]);

  return (
    <div className="flex h-screen min-h-0 w-full overflow-hidden">
      <ClassSidebar />
      <Suspense key={classId} fallback={<PageLoading />}>
        <ClassDetails />
      </Suspense>
    </div>
  );
}
