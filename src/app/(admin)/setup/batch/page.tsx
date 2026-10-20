import { batchService, IBatchListItem } from "@/features/batch";
import { filterCache } from "@/lib/nuqs/filter";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import PageLoading from "@/components/ui/page-loading";
import BatchPage from "@/components/setup/batch/batch-page";
import { IQueryParams } from "@/lib/filter";

async function BatchContent({ search }: Pick<IQueryParams, "search">) {
  let batches: IBatchListItem[] | null = null;

  try {
    batches = await batchService.getList({ search });
  } catch (error) {
    console.error("Failed to load batches:", error);
    redirect("/setup");
  }

  return <BatchPage batches={batches} />;
}

export default async function Page({ searchParams }: PageProps<"/setup/batch">) {
  const { search } = await filterCache.parse(searchParams);

  return (
    <Suspense fallback={<PageLoading />}>
      <BatchContent search={search} />
    </Suspense>
  );
}
