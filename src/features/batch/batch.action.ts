"use server";

import { batchService } from ".";
import { BatchType } from "@/generated/prisma/enums";
import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { IQueryParams } from "@/lib/filter";

export async function getBatchListAction({ search, page, limit, type }: IQueryParams & { type: BatchType }) {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const batches = await batchService.getList({ search, limit, page, type });
    return { success: true, data: batches };
  } catch (error) {
    console.error("Failed to fetch batch list:", error);
    return { success: false, message: "Failed to get batch list" };
  }
}
