import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { filterCache } from "@/lib/nuqs/filter";
import { BatchType } from "@/generated/prisma/enums";
import { EyeIcon, LinkIcon } from "lucide-react";
import { buttonVariants } from "@/components/shadcn/button";
import { getServerCaller } from "@/lib/orpc/server-caller";
import { safe } from "@orpc/client";
import EmptyState from "@/components/ui/empty-state";
import BatchEditBtn from "./batch-edit-btn";
import TooltipLink from "@/components/ui/tooltip-link";
import ErrorState from "@/components/ui/error-state";

export default async function BatchTable({ type }: { type: BatchType }) {
  const search = filterCache.get("search");
  const caller = await getServerCaller();
  const { data: batches, error, definedError } = await safe(caller.batch.getList({ search, type }));

  if (error) {
    return (
      <ErrorState
        title={definedError ? error.message : "Error loading batch list"}
        description="Failed to load batch list. Please try reloading the page."
      />
    );
  }

  return (
    <div className="flex-1 border rounded-lg overflow-auto">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="font-semibold text-foreground">Batch Name</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => (
            <TableRow key={batch.id}>
              <TableCell className="font-medium">{batch.name}</TableCell>
              <TableCell className="text-right">
                <TooltipLink
                  tooltip="View this batch"
                  href={`/grades?batchId=${batch.id}`}
                  className={buttonVariants({ size: "icon-sm", variant: "ghost" })}
                  target="_blank"
                >
                  <EyeIcon />
                </TooltipLink>
                <BatchEditBtn batch={batch} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {batches.length === 0 && (
        <div className="py-12">
          <EmptyState
            icon={LinkIcon}
            title={search ? "No matching batches" : "No batches found for this type"}
            description={
              search
                ? `No batches match "${search}". Try searching for another batch.`
                : "Batches group A/L and O/L classes across years. Get started by adding the first batch."
            }
          />
        </div>
      )}
    </div>
  );
}
