import { filterCache } from "@/lib/nuqs/filter";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import PageLoading from "@/components/ui/page-loading";
import MediumPage from "@/components/setup/medium/medium-page";
import { IMediumItem } from "@/components/dialog/medium/medium-dialog";
import { mediumService } from "@/features/medium";
import { IQueryParams } from "@/lib/filter";

async function MediumContent({ search }: Pick<IQueryParams, "search">) {
  let mediums: IMediumItem[] | null = null;

  try {
    mediums = await mediumService.getList({ search });
  } catch (error) {
    console.error("Failed to load mediums:", error);
    redirect("/setup");
  }

  return <MediumPage mediums={mediums} />;
}

export default async function Page({ searchParams }: PageProps<"/setup/medium">) {
  const { search } = await filterCache.parse(searchParams);
  return (
    <Suspense fallback={<PageLoading />}>
      <MediumContent search={search?.trim()} />
    </Suspense>
  );
}
