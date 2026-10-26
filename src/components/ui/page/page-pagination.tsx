"use client";

import { ComponentProps, useId } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/shadcn/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Field, FieldLabel } from "@/components/shadcn/field";
import { filterParsers } from "@/lib/nuqs/filter";
import { useQueryStates } from "nuqs";
import { cn } from "cn";

interface Props extends ComponentProps<"div"> {
  itemCount: number;
}

export default function PagePagination({ itemCount, className, ...props }: Props) {
  const [{ page, limit }, setParsers] = useQueryStates(filterParsers);
  const selectId = useId();
  const pageCount = Math.max(1, Math.ceil(itemCount / limit));
  const isPreviousDisabled = page <= 1;
  const isNextDisabled = page >= pageCount;

  return (
    <div className={cn("flex w-full min-w-0 items-center justify-between gap-4 border-t pt-3", className)} {...props}>
      <p className="shrink-0 whitespace-nowrap text-sm text-muted-foreground">
        {itemCount === 0
          ? "No Results"
          : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, itemCount)} of ${itemCount}`}
      </p>
      <Pagination className="mx-0 w-auto shrink-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
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
              className="min-w-8 px-2 tabular-nums pointer-events-none"
            >
              {page} / {pageCount}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
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
      <Field orientation="horizontal" className="w-auto shrink-0 gap-2">
        <FieldLabel htmlFor={selectId} className="whitespace-nowrap text-muted-foreground">
          Results per page
        </FieldLabel>
        <Select value={limit} onValueChange={(value) => setParsers({ limit: value, page: 1 })}>
          <SelectTrigger className="w-20" id={selectId}>
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
