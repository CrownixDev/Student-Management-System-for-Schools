"use server";

import { batchService, IBatchListItem } from ".";
import { BatchType } from "@/generated/prisma/enums";
import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { IQueryParams } from "@/lib/filter";
import { batchSchema } from "./batch.schema";
import { IResponse } from "@/lib/types";
import { ApiErrorV2 } from "@/lib/ApiError";
import { revalidatePath } from "next/cache";
import { Route } from "next";
import z from "zod";

export async function getBatchListAction({
  search,
  type,
}: Pick<IQueryParams, "search"> & { type: BatchType }): Promise<IResponse<IBatchListItem[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const batches = await batchService.getList({ search, type });
    return { success: true, data: batches };
  } catch (error) {
    console.error("Failed to fetch batch list:", error);
    return { success: false, message: "Failed to get batch list" };
  }
}

export async function createBatchAction(data: z.infer<typeof batchSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  const parsedData = batchSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await batchService.create(parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Batch Created" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateBatchAction(batchId: string, data: z.infer<typeof batchSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!batchId) {
    return { success: false, message: "Batch id is required" };
  }

  const parsedData = batchSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await batchService.update(batchId, parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Batch Updated" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function deleteBatchAction(batchId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!batchId) {
    return { success: false, message: "Batch id is required" };
  }

  try {
    await batchService.delete(batchId);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Batch Deleted" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}
