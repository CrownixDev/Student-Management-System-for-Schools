"use server";

import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { revalidatePath } from "next/cache";
import { examSchema } from "./exams.schema";
import { ApiErrorV2 } from "@/lib/ApiError";
import { IResponse } from "@/lib/types";
import { examService } from ".";
import { Route } from "next";
import z from "zod";

export async function createExamAction(
  yearId: string,
  gradeId: string,
  data: z.infer<typeof examSchema>,
): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  const parsedData = examSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await examService.create(yearId, gradeId, parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Exam Created" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateExamAction(examId: string, data: z.infer<typeof examSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!examId) {
    return { success: false, message: "Exam id is required" };
  }

  const parsedData = examSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await examService.update(examId, parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Exam Updated" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function deleteExamAction(examId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!examId) {
    return { success: false, message: "Exam id is required" };
  }

  try {
    await examService.delete(examId);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Exam Deleted" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function deleteExamSubjectAction(eSubjectId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!eSubjectId) {
    return { success: false, message: "Exam subject id is required" };
  }

  try {
    await examService.deleteExamSubject(eSubjectId);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Subject deleted from exam" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}
