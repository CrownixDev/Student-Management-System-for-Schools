"use client";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { CheckIcon, LinkIcon } from "lucide-react";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import { Label } from "@/components/shadcn/label";
import { IBatchListItem } from "@/features/batch";
import { batchTypeOptions } from "@/features/batch/batch.enums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/tabs";
import { BatchType } from "@/generated/prisma/enums";
import { rpcTanStack } from "@/lib/orpc/client";
import SearchInput from "../ui/search-input";
import LoadingIndicator from "@/components/ui/loading-indicator";
import EmptyState from "@/components/ui/empty-state";

export default function BatchPickerDialog({
  open,
  onOpenChange,
  onSelect,
  title = "Select a Batch",
  selectedBatchId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (batch: IBatchListItem) => void;
  title?: string;
  selectedBatchId?: string;
}) {
  const [batchId, setBatchId] = useState<string>(selectedBatchId ?? "");
  const [batchType, setBatchType] = useState<BatchType>("al");
  const [search, setSearch] = useState("");

  const { data = [], isPending } = useQuery(
    rpcTanStack.batch.getList.queryOptions({
      enabled: open,
      input: { search: search.trim(), type: batchType },
      placeholderData: keepPreviousData,
    }),
  );

  function confirmSelection() {
    const batch = data.find((batch) => batch.id === batchId);
    if (batch) {
      onSelect(batch);
      onOpenChange(false);
    }
  }

  function handleSelectBatch(batchId: string) {
    setBatchId(batchId);
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
          onChange={(search) => setSearch(search)}
          onClear={() => setSearch("")}
        />

        {isPending && <LoadingIndicator />}

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
                <div className="h-[20dvh] flex-1 overflow-y-auto rounded-md border">
                  <RadioGroup value={batchId} onValueChange={handleSelectBatch}>
                    {data.map((item) => (
                      <div key={item.id} className="flex w-full justify-between items-center gap-3 px-3 py-2.5">
                        <div className="flex w-full items-center gap-3 cursor-pointer">
                          <RadioGroupItem value={item.id} id={item.id} />
                          <Label className="w-full cursor-pointer" htmlFor={item.id}>
                            {item.name}
                          </Label>
                        </div>
                        {batchId === item.id && <CheckIcon className="size-4 shrink-0 text-muted-foreground" />}
                      </div>
                    ))}
                  </RadioGroup>
                  {data.length === 0 && (
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

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={confirmSelection} disabled={!batchId}>
            Select batch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
