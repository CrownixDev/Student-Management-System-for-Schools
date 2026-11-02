"use server";

import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { IMediumOption, mediumService } from ".";
import { IResponse } from "@/lib/types";
import { mediumSchema } from "./medium.schema";
import z from "zod";
import { revalidatePath } from "next/cache";
import { Route } from "next";
import { ApiErrorV2 } from "@/lib/ApiError";

export async function getMediumOptionsAction(): Promise<IResponse<IMediumOption[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const mudium = await mediumService.getAsOptions();
    return { success: true, data: mudium };
  } catch (error) {
    console.error("Error fetching medium options:", error);
    return { success: false, message: "Failed to fetch medium options." };
  }
}

export async function createMediumAction(data: z.infer<typeof mediumSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  const parsedData = mediumSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await mediumService.create(parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Medium Created" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateMediumAction(mediumId: string, data: z.infer<typeof mediumSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!mediumId) {
    return { success: false, message: "Medium id is required" };
  }

  const parsedData = mediumSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await mediumService.update(mediumId, parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Medium Updated" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function deleteMediumAction(mediumId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!mediumId) {
    return { success: false, message: "Medium id is required" };
  }

  try {
    await mediumService.delete(mediumId);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Medium Deleted" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}
