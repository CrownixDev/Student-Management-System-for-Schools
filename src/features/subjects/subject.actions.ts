"use server";

import { SubjectCategory } from "@/generated/prisma/enums";
import { IQueryParams } from "@/lib/filter";
import { ISubjectListItem, subjectService } from ".";
import { IResponse } from "@/lib/types";
import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { subjectSchema } from "./subject.schema";
import { revalidatePath } from "next/cache";
import { Route } from "next";
import { ApiErrorV2 } from "@/lib/ApiError";
import z from "zod";

export async function getSubjectListAction({
  search,
  category,
}: {
  search: IQueryParams["search"];
  category: SubjectCategory;
}): Promise<IResponse<ISubjectListItem[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });
  const subjects = await subjectService.getList({ search, category });
  try {
    return { success: true, data: subjects };
  } catch (error) {
    console.log("Error fetching subject list:", error);
    return { success: false, message: "Failed to fetch subject list" };
  }
}

export async function createSubjectAction(data: z.infer<typeof subjectSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  const parsedData = subjectSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await subjectService.create(parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Subject Created" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateSubjectAction(subjectId: string, data: z.infer<typeof subjectSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!subjectId) {
    return { success: false, message: "Subject id is required" };
  }

  const parsedData = subjectSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await subjectService.update(subjectId, parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Subject Updated" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function deleteSubjectAction(subjectId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!subjectId) {
    return { success: false, message: "Subject id is required" };
  }

  try {
    await subjectService.delete(subjectId);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Subject Deleted" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}
