"use client";

import { ComponentProps, useId } from "react";
import { Field, FieldLabel } from "@/components/shadcn/field";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/shadcn/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { filterParsers } from "@/lib/nuqs/filter";
import { useQueryStates } from "nuqs";
import { cn } from "cn";

interface Props extends ComponentProps<"div"> {
  itemCount: number;
}

export default function SidebarPagination({ itemCount, className, ...props }: Props) {
  const [{ page, limit }, setParsers] = useQueryStates(filterParsers);
  const selectId = useId();
  const pageCount = Math.max(1, Math.ceil(itemCount / limit));
  const isPreviousDisabled = page <= 1;
  const isNextDisabled = page >= pageCount;

  return (
    <div className={cn("flex min-w-0 flex-col gap-2 bg-background p-2", className)} {...props}>
      <Pagination className="w-full">
        <PaginationContent className="w-full min-w-0 justify-between">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text=""
              aria-disabled={isPreviousDisabled}
              tabIndex={isPreviousDisabled ? -1 : 0}
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              onClick={(event) => {
                event.preventDefault();
                if (!isPreviousDisabled) void setParsers({ page: page - 1 });
              }}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              isActive
              size="sm"
              aria-disabled="true"
              tabIndex={-1}
              aria-label={`Page ${page} of ${pageCount}`}
              className="min-w-8 px-2 tabular-nums"
            >
              {page} / {pageCount}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              text=""
              aria-disabled={isNextDisabled}
              tabIndex={isNextDisabled ? -1 : 0}
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              onClick={(event) => {
                event.preventDefault();
                if (!isNextDisabled) void setParsers({ page: page + 1 });
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Field orientation="horizontal" className="min-w-0 justify-between gap-2">
        <FieldLabel htmlFor={selectId} className="min-w-0 truncate text-muted-foreground">
          Results per page
        </FieldLabel>
        <Select value={limit} onValueChange={(value) => setParsers({ limit: value, page: 1 })}>
          <SelectTrigger className="w-20 shrink-0" id={selectId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              <SelectItem value={25}>25</SelectItem>
              <SelectItem value={50}>50</SelectItem>
              <SelectItem value={100}>100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
