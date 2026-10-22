"use client";

import { ComponentProps } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/shadcn/pagination";
import { cn } from "cn";
import { TypographyP } from "../typography";
import { RESULT_LIMIT } from "@/constraints";

interface Props extends ComponentProps<"div"> {
  itemCount: number;
  page: number;
  onPageChange: (page: number) => void;
  disable?: {
    previous?: boolean;
    next?: boolean;
  };
}

export default function DialogPagination({ itemCount, page, onPageChange, className, disable, ...props }: Props) {
  const pageCount = Math.max(1, Math.ceil(itemCount / RESULT_LIMIT));
  const isPreviousDisabled = page <= 1 || disable?.previous;
  const isNextDisabled = page >= pageCount || disable?.next;

  return (
    <div className={cn("flex w-full flex-wrap items-center justify-between gap-3", className)} {...props}>
      <TypographyP>
        {itemCount} results · Page {page} of {pageCount}
      </TypographyP>
      <div className="flex items-center gap-3">
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="Previous"
                aria-disabled={isPreviousDisabled}
                tabIndex={isPreviousDisabled ? -1 : 0}
                className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                onClick={(event) => {
                  event.preventDefault();
                  if (!isPreviousDisabled) onPageChange(page - 1);
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                text="Next"
                aria-disabled={isNextDisabled}
                tabIndex={isNextDisabled ? -1 : 0}
                className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                onClick={(event) => {
                  event.preventDefault();
                  if (!isNextDisabled) onPageChange(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
