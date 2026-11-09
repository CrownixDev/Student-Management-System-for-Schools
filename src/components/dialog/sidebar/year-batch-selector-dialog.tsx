"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Label } from "@/components/shadcn/label";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { batchTypeOptions } from "@/features/batch/batch.enums";
import { getAcademicYearListAction } from "@/features/academic-years/year.actions";
import { getBatchListAction } from "@/features/batch/batch.action";
import { IAcademicYear } from "@/features/academic-years";
import { IBatchListItem } from "@/features/batch";
import { BatchType } from "@/generated/prisma/enums";
import { idParsers } from "@/lib/nuqs/id";
import { BATCH_LIST, YEAR_LIST } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { CalendarDaysIcon, CheckIcon, ChevronsUpDownIcon, LinkIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TypographyH2 } from "@/components/ui/typography";
import EmptyState from "@/components/ui/empty-state";
import LoadingIndicator from "@/components/ui/loading-indicator";

interface Props {
  allow?: {
    year?: boolean;
    batch?: boolean;
  };
}

export default function YearBatchSelectorDialog({ allow }: Props) {
  const allowYear = allow?.year ?? true;
  const allowBatch = allow?.batch ?? true;

  const [{ yearId, batchId }, setParsers] = useQueryStates(idParsers);
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<"years" | "batches">("years");
  const [batchType, setBatchType] = useState<BatchType>("al");

  const { data: yearList = [], isPending: isYearListPending } = useQuery<IAcademicYear[]>({
    enabled: allowYear,
    queryFn: async () => {
      const result = await getAcademicYearListAction({});
      if (!result.success) {
        toast.error(result.message);
        throw new Error(result.message);
      }
      return result.data ?? [];
    },
    queryKey: [YEAR_LIST],
  });

  const {
    data: batchLists = {
      al: [],
      ol: [],
    } as Record<BatchType, IBatchListItem[]>,
    isPending: isBatchListPending,
  } = useQuery<Record<BatchType, IBatchListItem[]>>({
    enabled: allowBatch,
    queryFn: async () => {
      const results = await Promise.all(batchTypeOptions.map(({ value }) => getBatchListAction({ type: value })));
      const failedResult = results.find((result) => !result.success);
      if (failedResult && !failedResult.success) {
        toast.error(failedResult.message);
        throw new Error(failedResult.message);
      }
      return {
        al: results[0].success ? (results[0].data ?? []) : [],
        ol: results[1].success ? (results[1].data ?? []) : [],
      };
    },
    queryKey: [BATCH_LIST],
  });

  const selectedYear = yearList.find((year) => year.id === yearId);
  const selectedBatch = Object.values(batchLists)
    .flat()
    .find((batch) => batch.id === batchId);

  useEffect(() => {
    // Remove the batch id if both exists in same time
    if (yearId && batchId) {
      setParsers({ batchId: null });
      return;
    }

    // set default if both absent
    if (!yearId && !batchId) {
      const currentYear = yearList.find((year) => year.isCurrent);
      if (currentYear) {
        setParsers({ yearId: currentYear.id });
      } else {
        setParsers({ yearId: yearList[0].id });
      }
    }
  }, [batchId, setParsers, yearId, yearList]);

  async function handleSelectYear(yearId: string) {
    // Should set other to null, if noth UI may break trying to render both year and batch in sidebar
    await setParsers({ yearId, batchId: null });
  }

  async function handleSelectBatch(batchId: string) {
    await setParsers({ batchId, yearId: null });
  }

  return (
    <>
      <Button size="lg" variant="secondary" className="p-3" onClick={() => setOpen(true)}>
        <div className="grid flex-1 text-left">
          {selectedYear && <TypographyH2>Year {selectedYear.name}</TypographyH2>}
          {selectedBatch && (
            <TypographyH2 className="flex max-w-52 gap-2">
              <span className="truncate">{selectedBatch.name}</span> <span>Batch</span>
            </TypographyH2>
          )}
        </div>
        <ChevronsUpDownIcon className="ml-auto" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex min-h-128 max-h-[75dvh] min-w-md flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Select academic year or batch</DialogTitle>
          </DialogHeader>
          <Tabs value={section} onValueChange={setSection} className="min-h-0 flex-1">
            <TabsList className="w-full">
              {allowYear && <TabsTrigger value="years">Academic years</TabsTrigger>}
              {allowBatch && <TabsTrigger value="batches">Batches</TabsTrigger>}
            </TabsList>
            <TabsContent value="years">
              {isYearListPending ? (
                <LoadingIndicator />
              ) : (
                <div className="min-h-72 max-h-[55dvh] overflow-y-auto rounded-md border">
                  <RadioGroup value={selectedYear?.id ?? ""} onValueChange={(yearId) => handleSelectYear(yearId)}>
                    {yearList.map((year) => (
                      <div key={year.id} className="flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0">
                        <RadioGroupItem value={year.id} id={year.id} />
                        <Label className="flex-1 cursor-pointer" htmlFor={year.id}>
                          {year.name}
                          {year.isCurrent && <span className="text-muted-foreground">(Current)</span>}
                        </Label>
                        {selectedYear?.id === year.id && (
                          <CheckIcon className="size-4 shrink-0 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                  {yearList.length === 0 && (
                    <EmptyState
                      noBorder
                      icon={CalendarDaysIcon}
                      title="No academic years found"
                      description="There are no academic years available."
                    />
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="batches">
              <Tabs value={batchType} onValueChange={(value) => setBatchType(value as BatchType)} className="min-h-0">
                <TabsList className="w-full">
                  {batchTypeOptions.map((type) => (
                    <TabsTrigger key={type.value} value={type.value}>
                      {type.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value={batchType}>
                  {isBatchListPending ? (
                    <LoadingIndicator />
                  ) : (
                    <div className="min-h-72 max-h-[55dvh] overflow-y-auto rounded-md border">
                      <RadioGroup value={batchId ?? ""} onValueChange={(batchId) => handleSelectBatch(batchId)}>
                        {batchLists[batchType].map((batch) => (
                          <div key={batch.id} className="flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0">
                            <RadioGroupItem value={batch.id} id={batch.id} />
                            <Label className="flex-1 cursor-pointer" htmlFor={batch.id}>
                              {batch.name}
                            </Label>
                            {batchId === batch.id && <CheckIcon className="size-4 shrink-0 text-muted-foreground" />}
                          </div>
                        ))}
                      </RadioGroup>
                      {batchLists[batchType].length === 0 && (
                        <EmptyState
                          noBorder
                          icon={LinkIcon}
                          title="No batches found"
                          description="There are no batches available for this type."
                        />
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
