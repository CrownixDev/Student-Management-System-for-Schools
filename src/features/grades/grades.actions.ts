"use server";

import { IQueryParams } from "@/lib/filter";
import { IResponse } from "@/lib/types";
import { IGradeListItem } from "./grades.types";
import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { gradesService } from ".";
import { gradeSchema } from "@/features/grades/grades.schema";
import z from "zod";
import { ApiErrorV2 } from "@/lib/ApiError";
import { revalidatePath } from "next/cache";
import { Route } from "next";

export async function getGradesListAction({
  search,
}: Pick<IQueryParams, "search">): Promise<IResponse<IGradeListItem[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const result = await gradesService.getList({ search });
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching grades list:", error);
    return { success: false, message: "Failed to fetch grades list." };
  }
}

export async function createGradeAction(data: z.infer<typeof gradeSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  const parsedData = gradeSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await gradesService.create(parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Grade created" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateGradeAction(gradeId: string, data: z.infer<typeof gradeSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!gradeId) {
    return { success: false, message: "Grade id is required" };
  }

  const parsedData = gradeSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await gradesService.update(gradeId, parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Grade updated" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function deleteGradeAction(gradeId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!gradeId) {
    return { success: false, message: "Grade id is required" };
  }

  try {
    await gradesService.delete(gradeId);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Grade deleted" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}
