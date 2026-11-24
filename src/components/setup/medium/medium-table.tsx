import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { filterCache } from "@/lib/nuqs/filter";
import { Languages } from "lucide-react";
import { safe } from "@orpc/client";
import { getServerCaller } from "@/lib/orpc/server-caller";
import ErrorState from "@/components/ui/error-state";
import MediumEditBtn from "./buttons/medium-edit-btn";
import EmptyState from "@/components/ui/empty-state";

export default async function MediumTable() {
  const search = filterCache.get("search");
  const caller = await getServerCaller();
  const { data: mediums, error, definedError } = await safe(caller.medium.getList({ search }));

  if (error) {
    return (
      <ErrorState
        title={definedError ? error.message : "Error loading medium list"}
        description="Failed to load medium list. Please try reloading the page."
      />
    );
  }

  return (
    <div className="flex-1 border rounded-lg overflow-auto">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="font-semibold text-foreground">Medium Name</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mediums.map((medium) => (
            <TableRow key={medium.id}>
              <TableCell className="font-medium">{medium.name}</TableCell>
              <TableCell className="text-right">
                <MediumEditBtn medium={medium} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {mediums.length === 0 && (
        <div className="py-12">
          <EmptyState
            icon={Languages}
            title={search ? "No matching mediums" : "No mediums found"}
            description={
              search
                ? `No mediums match "${search}". Try a different name.`
                : "Get started by adding the first teaching medium (e.g. Sinhala, English)."
            }
          />
        </div>
      )}
    </div>
  );
}
