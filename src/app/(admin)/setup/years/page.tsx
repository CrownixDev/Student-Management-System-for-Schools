import { academicYearsService, IAcademicYear } from "@/features/academic-years";
import { IQueryParams } from "@/lib/filter";
import { filterCache } from "@/lib/nuqs/filter";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import PageLoading from "@/components/ui/page-loading";
import YearsPage from "@/components/setup/years/years-page";

async function YearsContent({ search }: Pick<IQueryParams, "search">) {
  let years: IAcademicYear[] | null = null;

  try {
    years = await academicYearsService.getList({ search });
  } catch (error) {
    console.error("Failed to load academic years from service:", error);
    redirect("/setup");
  }
  return <YearsPage academicYears={years} />;
}

export default async function Page({ searchParams }: PageProps<"/setup/years">) {
  const { search } = await filterCache.parse(searchParams);

  return (
    <Suspense fallback={<PageLoading />}>
      <YearsContent search={search} />
    </Suspense>
  );
}
