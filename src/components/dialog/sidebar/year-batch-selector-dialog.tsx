"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Label } from "@/components/shadcn/label";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { batchTypeOptions } from "@/features/batch/batch.enums";
import { BatchType } from "@/generated/prisma/enums";
import { idParsers } from "@/lib/nuqs/id";
import { useQueries, useQuery } from "@tanstack/react-query";
import { CalendarDaysIcon, CheckIcon, ChevronsUpDownIcon, LinkIcon, OctagonAlertIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import { TypographyH2 } from "@/components/ui/typography";
import { rpcTanStack } from "@/lib/orpc/client";
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

  const {
    data: yearList = [],
    isPending: isYearListPending,
    isError: isYearListError,
    refetch: refetchYearList,
  } = useQuery(
    rpcTanStack.academicYear.getlist.queryOptions({
      enabled: allowYear,
      input: { search: "" },
    }),
  );

  const { data: batchLists, isPending: isBatchListPending } = useQueries({
    queries: [
      rpcTanStack.batch.getList.queryOptions({
        input: { search: null, type: "ol" },
        enabled: allowBatch,
      }),
      rpcTanStack.batch.getList.queryOptions({
        input: { search: null, type: "al" },
        enabled: allowBatch,
      }),
    ],
    combine: (result) => {
      return {
        data: { ol: result[0].data ?? [], al: result[1].data ?? [] },
        isPending: result.some((res) => res.isPending),
      };
    },
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
        <DialogContent className="flex min-h-128 max-h-128 min-w-md flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Select academic year or batch</DialogTitle>
          </DialogHeader>
          <Tabs value={section} onValueChange={setSection} className="min-h-0 flex-1">
            <TabsList className="w-full">
              {allowYear && <TabsTrigger value="years">Academic years</TabsTrigger>}
              {allowBatch && <TabsTrigger value="batches">Batches</TabsTrigger>}
            </TabsList>
            <TabsContent value="years" className="min-h-0 flex flex-col">
              {isYearListPending ? (
                <LoadingIndicator />
              ) : isYearListError ? (
                <EmptyState
                  noBorder
                  icon={OctagonAlertIcon}
                  title="Error loading academic years"
                  description="Failed to load academic years. Please try again."
                  action={
                    <Button type="button" variant="outline" onClick={() => refetchYearList()}>
                      Retry
                    </Button>
                  }
                />
              ) : (
                <div className="min-h-0 flex-1 overflow-y-auto rounded-md border">
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
            <TabsContent value="batches" className="min-h-0 flex flex-col">
              <Tabs
                value={batchType}
                onValueChange={(value) => setBatchType(value as BatchType)}
                className="min-h-0 flex-1"
              >
                <TabsList className="w-full">
                  {batchTypeOptions.map((type) => (
                    <TabsTrigger key={type.value} value={type.value}>
                      {type.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value={batchType} className="min-h-0 flex flex-col">
                  {isBatchListPending ? (
                    <LoadingIndicator />
                  ) : (
                    <div className="min-h-0 flex-1 overflow-y-auto rounded-md border">
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
