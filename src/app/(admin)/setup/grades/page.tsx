import { gradesService, IGradeListItem } from "@/features/grades";
import { IQueryParams } from "@/lib/filter";
import { filterCache } from "@/lib/nuqs/filter";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import PageLoading from "@/components/ui/page-loading";
import GradesPage from "@/components/setup/grades/grades-page";

async function GradesContent({ search }: Pick<IQueryParams, "search">) {
  let grades: IGradeListItem[] | null = null;

  try {
    grades = await gradesService.getList({ search });
  } catch (error) {
    console.error("Failed to load grades from service:", error);
    redirect("/setup");
  }

  return <GradesPage grades={grades} />;
}

export default async function Page({ searchParams }: PageProps<"/setup/grades">) {
  const { search } = await filterCache.parse(searchParams);

  return (
    <Suspense fallback={<PageLoading />}>
      <GradesContent search={search} />
    </Suspense>
  );
}
