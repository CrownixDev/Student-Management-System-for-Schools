import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { batchService, IBatchListItem } from "@/features/batch";
import { filterCache } from "@/lib/nuqs/filter";
import { redirect } from "next/navigation";
import { BatchType } from "@/generated/prisma/enums";
import { EyeIcon, LinkIcon } from "lucide-react";
import { buttonVariants } from "@/components/shadcn/button";
import EmptyState from "@/components/ui/empty-state";
import BatchEditBtn from "./batch-edit-btn";
import TooltipLink from "@/components/ui/tooltip-link";

export default async function BatchTable({ type }: { type: BatchType }) {
  const search = filterCache.get("search");

  let batches: IBatchListItem[] | null = null;

  try {
    batches = await batchService.getList({ search, type });
  } catch (error) {
    console.error("Failed to load batches:", error);
    redirect("/setup");
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
