"use server";

import { IResponse } from "@/lib/types";
import { IClassList, IClassOption } from "./class.types";
import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { classService } from ".";
import { classDetailsSchema, classSubjectsSchema } from "./class.schema";
import { revalidatePath } from "next/cache";
import { Route } from "next";
import { ApiErrorV2 } from "@/lib/ApiError";
import z from "zod";

export async function getClassOptionsAction(gradeId: string): Promise<IResponse<IClassOption[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const result = await classService.getAsOptions(gradeId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching class options:", error);
    return { success: false, message: "Failed to fetch class options." };
  }
}

export async function getClassListAction(gradeId: string): Promise<IResponse<IClassList>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const result = await classService.getList(gradeId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching class list:", error);
    return { success: false, message: "Failed to fetch class list." };
  }
}

export async function createClassAction(gradeId: string, data: z.infer<typeof classDetailsSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  const parsedData = classDetailsSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await classService.create(gradeId, parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Class Created" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateClassmAction(
  classId: string,
  data: z.infer<typeof classDetailsSchema>,
): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!classId) {
    return { success: false, message: "Class id is required" };
  }

  const parsedData = classDetailsSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await classService.updateDetails(classId, parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Class Details Updated" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function deleteClassAction(classId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!classId) {
    return { success: false, message: "Class id is required" };
  }

  try {
    await classService.delete(classId);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Class Deleted" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateClassBatchAction(batchId: string | null, gradeId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!gradeId) {
    return { success: false, message: "Grade id is required" };
  }

  try {
    await classService.updateBatch(batchId, gradeId);
    revalidatePath("/setup" as Route);
    return { success: true, message: batchId ? "Batch assigned successfully" : "Batch removed successfully" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateClassSubjectsAction(classId: string, data: z.infer<typeof classSubjectsSchema>) {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!classId) {
    return { success: false, message: "Class id is required" };
  }

  const parsedData = classSubjectsSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await classService.updateSubjects(classId, data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Subjects updated successfully" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function deleteClassSubjectAction(classId: string, subjectId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!classId) {
    return { success: false, message: "Class id is required" };
  }

  if (!subjectId) {
    return { success: false, message: "Subject id is required" };
  }

  try {
    await classService.deleteSubject(classId, subjectId);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Subject removed from class" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}
