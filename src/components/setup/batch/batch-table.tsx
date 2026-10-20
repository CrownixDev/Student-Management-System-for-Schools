"use client";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { IBatchListItem } from "@/features/batch";
import { batchTypeOptions } from "@/features/batch/batch.enums";
import { PencilIcon } from "lucide-react";

interface BatchTableProps {
  batches: IBatchListItem[];
  onEdit: (batch: IBatchListItem) => void;
}

export default function BatchTable({ batches, onEdit }: BatchTableProps) {
  return (
    <div className="overflow-y-auto">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="font-semibold text-foreground">Batch Name</TableHead>
            <TableHead className="font-semibold text-foreground">Type</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => (
            <TableRow key={batch.id}>
              <TableCell className="font-medium">{batch.name}</TableCell>

              <TableCell>
                <Badge variant="outline" className="text-muted-foreground">
                  {batchTypeOptions.find((option) => option.value === batch.type)?.label}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <Button size="icon-sm" variant="ghost" title="Edit batch" onClick={() => onEdit(batch)}>
                  <PencilIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
