"use server";

import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { IQueryParams } from "@/lib/filter";
import { academicYearsService, IAcademicYear } from ".";
import { IResponse } from "@/lib/types";
import { academicYearSchema } from "./year.schema";
import { revalidatePath } from "next/cache";
import { Route } from "next";
import { ApiErrorV2 } from "@/lib/ApiError";
import z from "zod";

export async function getAcademicYearListAction({
  search,
}: Pick<IQueryParams, "search">): Promise<IResponse<IAcademicYear[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const result = await academicYearsService.getList({ search });
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching academic year list:", error);
    return { success: false, message: "Failed to fetch academic year list." };
  }
}

export async function getActiveAcademicYearAction(): Promise<IResponse<IAcademicYear>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const result = await academicYearsService.getActiveYear();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching active academic year:", error);
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function createAcademicYearAction(data: z.infer<typeof academicYearSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  const result = z.safeParse(academicYearSchema, data);
  if (!result.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await academicYearsService.create(result.data);
    revalidatePath("/setup/years" as Route);
    return { success: true, message: "Academic year created" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateAcademicYearAction(
  yearId: string,
  data: z.infer<typeof academicYearSchema>,
): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!yearId) {
    return { success: false, message: "Year id is required" };
  }

  const result = academicYearSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await academicYearsService.update(yearId, result.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Academic year updated" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function setCurrentAcademicYearAction(yearId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!yearId) {
    return { success: false, message: "Year id is required" };
  }

  try {
    await academicYearsService.setAsCurrent(yearId);
    revalidatePath("/setup" as Route);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function deleteAcademicYearAction(yearId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!yearId) {
    return { success: false, message: "Year id is required" };
  }

  try {
    await academicYearsService.delete(yearId);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Academic year deleted" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}
