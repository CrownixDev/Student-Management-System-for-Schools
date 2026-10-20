import { Suspense } from "react";
import { TypographyH1 } from "@/components/ui/typography";
import { Separator } from "@/components/shadcn/separator";
import { Tabs, TabsContent, TabsList } from "@/components/shadcn/tabs";
import { batchTypeOptions } from "@/features/batch/batch.enums";
import { batchTabCache } from "@/features/batch/batch.cache";
import { filterCache } from "@/lib/nuqs/filter";
import PageLoading from "@/components/ui/page-loading";
import SearchInput from "@/components/ui/search-input";
import BatchAddNewBtn from "@/components/setup/batch/batch-new-btn";
import BatchTableTabBtn from "@/components/setup/batch/batch-table-tab-btn";
import BatchTable from "@/components/setup/batch/batch-table";

export default async function page({ searchParams }: PageProps<"/setup/batch">) {
  await filterCache.parse(searchParams);
  const { tab } = await batchTabCache.parse(searchParams);

  return (
    <div className="flex flex-col overflow-y-auto p-8 space-y-6">
      <div className="flex w-full items-center justify-between gap-5">
        <TypographyH1 className="text-2xl font-bold tracking-tight">Batches</TypographyH1>
        <BatchAddNewBtn />
      </div>
      <SearchInput placeholder="Search batches..." />
      <Separator />

      <Tabs value={tab}>
        <TabsList>
          {batchTypeOptions.map((opt) => (
            <BatchTableTabBtn key={opt.value} value={opt.value}>
              {opt.label}
            </BatchTableTabBtn>
          ))}
        </TabsList>
        {batchTypeOptions.map((opt) => (
          <TabsContent key={opt.value} value={opt.value}>
            {tab === opt.value && (
              <Suspense fallback={<PageLoading />}>
                <BatchTable type={opt.value} />
              </Suspense>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
