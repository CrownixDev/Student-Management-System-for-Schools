"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { CheckIcon, LinkIcon } from "lucide-react";
import { useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BATCH_LIST } from "@/lib/query-keys";
import { toast } from "react-toastify";
import PageLoading from "@/components/ui/page-loading";
import EmptyState from "@/components/ui/empty-state";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import { Label } from "@/components/shadcn/label";
import { IBatchListItem } from "@/features/batch";
import { getBatchListAction } from "@/features/batch/batch.action";
import SearchInput from "../ui/search-input";
import { batchTypeOptions } from "@/features/batch/batch.enums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/tabs";
import { BatchType } from "@/generated/prisma/enums";
import { RESULT_LIMIT } from "@/constraints";
import DialogPagination from "../ui/dialog/dialog-pagination";

export default function BatchPickerDialog({
  open,
  onOpenChange,
  onSelect,
  title = "Select a Batch",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (batch: IBatchListItem) => void;
  title?: string;
}) {
  const [batch, setBatch] = useState<IBatchListItem>();
  const [batchType, setBatchType] = useState<BatchType>("al");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const batchListDiv = useRef<HTMLDivElement>(null);

  const {
    data = { count: 0, list: [] },
    isPending,
    isPlaceholderData,
  } = useQuery({
    enabled: open,
    queryFn: async () => {
      const res = await getBatchListAction({ search: search.trim(), page, limit: RESULT_LIMIT, type: batchType });
      if (res.success) {
        return res.data;
      } else {
        toast.error(res.message);
        throw new Error(res.message);
      }
    },
    placeholderData: keepPreviousData,
    queryKey: [BATCH_LIST, page, search, batchType],
  });

  function confirmSelection() {
    if (batch) {
      onSelect(batch);
      onOpenChange(false);
    }
  }

  function handleSelectBatch(batchId: string) {
    setBatch(data.list.find((batch) => batch.id === batchId));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col overflow-hidden min-w-md">
        <DialogHeader className="shrink-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <SearchInput
          placeholder="Search for a batch"
          value={search}
          onChange={(search) => {
            setSearch(search);
            setPage(1);
          }}
          onClear={() => setSearch("")}
        />

        {isPending && <PageLoading />}

        <Tabs value={batchType} onValueChange={(value) => setBatchType(value)}>
          <TabsList>
            {batchTypeOptions.map((type) => (
              <TabsTrigger key={type.value} value={type.value}>
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {batchTypeOptions.map((type) => (
            <TabsContent key={type.value} value={type.value}>
              {!isPending && (
                <div ref={batchListDiv} className="h-[35dvh] flex-1 overflow-y-auto rounded-md border">
                  <RadioGroup value={batch?.id} onValueChange={handleSelectBatch}>
                    {data.list.map((item) => (
                      <div key={item.id} className="flex w-full justify-between items-center gap-3 px-3 py-2.5">
                        <div className="flex w-full items-center gap-3 cursor-pointer">
                          <RadioGroupItem value={item.id} id={item.id} />
                          <Label className="w-full cursor-pointer" htmlFor={item.id}>
                            {item.name}
                          </Label>
                        </div>
                        {batch?.id === item.id && <CheckIcon className="size-4 shrink-0 text-muted-foreground" />}
                      </div>
                    ))}
                  </RadioGroup>
                  {data.list.length === 0 && (
                    <EmptyState
                      noBorder
                      icon={LinkIcon}
                      title="No batch found"
                      description={
                        search
                          ? `No batch match your search criteria for "${search}".`
                          : "There are no batch available."
                      }
                    />
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <DialogPagination
          itemCount={data.count}
          page={page}
          onPageChange={setPage}
          disable={{ next: isPlaceholderData }}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={confirmSelection} disabled={!batch}>
            Select teacher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
