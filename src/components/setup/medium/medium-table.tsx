"use client";

import { Button } from "@/components/shadcn/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { PencilIcon } from "lucide-react";
import { IMediumItem } from "@/components/dialog/medium/medium-dialog";

interface MediumTableProps {
  mediums: IMediumItem[];
  onEdit: (medium: IMediumItem) => void;
}

export default function MediumTable({ mediums, onEdit }: MediumTableProps) {
  return (
    <div className="overflow-y-auto">
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
                <Button size="icon-sm" variant="ghost" title="Edit medium" onClick={() => onEdit(medium)}>
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
