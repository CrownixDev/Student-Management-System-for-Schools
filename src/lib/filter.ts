import { RESULT_LIMIT } from "@/constraints";
import { StrictOmit } from "./utils";
import z from "zod";

export interface IQueryParams {
  search?: string | null;
  page?: number | null;
  limit?: number | null;
}

export const queryParamsSchema = z.object({
  search: z.string().nullable(),
  page: z.number().positive().nullable(),
  limit: z.number().positive().default(RESULT_LIMIT).nullable(),
});

/**
 * This function returns the pagination details
 * @param page Page number
 * @param limit Limit
 * @returns Object containing the pagination details {pageNumber, limitNumber, skipCount}
 */

export const getPagination = ({ page, limit }: StrictOmit<IQueryParams, "search">) => {
  const pageNumber = Math.max(1, page || 1);
  const limitNumber = Math.max(1, Math.min(100, limit || RESULT_LIMIT));
  const skipCount = (pageNumber - 1) * limitNumber;
  return { pageNumber, limitNumber, skipCount };
};

export const getCleanSearch = (search: undefined | null | string): string => {
  const cleanSearch = search === "undefined" || search === "null" || !search ? "" : search;
  return cleanSearch;
};
