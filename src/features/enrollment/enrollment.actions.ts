"use server";

import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { IResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { Route } from "next";
import { ApiErrorV2 } from "@/lib/ApiError";
import { enrollmentService } from ".";
import {
  enrollmentCreateSchema,
  enrollmentIndexUpdateSchema,
  enrollmentSubjectMediumUpdateSchema,
  enrollmentSubjectUpdateSchema,
} from "./enrollment.schema";
import z from "zod";

export async function createEnrollmentsAction(
  classId: string,
  data: z.infer<typeof enrollmentCreateSchema>,
): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  const parsedRes = enrollmentCreateSchema.safeParse(data);
  if (!parsedRes.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await enrollmentService.create(classId, parsedRes.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Enrollments created successfully" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateStudentIndexAction(
  classId: string,
  studentId: string,
  data: z.infer<typeof enrollmentIndexUpdateSchema>,
): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!studentId || !classId) {
    return { success: false, message: "Class and Student ids are required" };
  }

  const parsedRes = enrollmentIndexUpdateSchema.safeParse(data);
  if (!parsedRes.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await enrollmentService.updateIndex(classId, studentId, parsedRes.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Medium Updated" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateStudentSubjectEnrollmentAction(
  classId: string,
  studentId: string,
  data: z.infer<typeof enrollmentSubjectUpdateSchema>,
): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!studentId || !classId) {
    return { success: false, message: "Class and Student ids are required" };
  }

  const parsedRes = enrollmentSubjectUpdateSchema.safeParse(data);
  if (!parsedRes.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await enrollmentService.updateSubjectEnrollment(classId, studentId, parsedRes.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Subject enrollment Updated" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateSubjectMediumAction(
  classId: string,
  studentId: string,
  data: z.infer<typeof enrollmentSubjectMediumUpdateSchema>,
): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!studentId || !classId) {
    return { success: false, message: "Class and Student ids are required" };
  }

  const parsedRes = enrollmentSubjectMediumUpdateSchema.safeParse(data);
  if (!parsedRes.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await enrollmentService.updateSubjectMedium(classId, studentId, parsedRes.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Subject Medium Updated" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function deleteEnrollmentAction(classId: string, studentId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!studentId || !classId) {
    return { success: false, message: "Class and Student ids are required" };
  }

  try {
    await enrollmentService.delete(classId, studentId);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Enrollment Deleted" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}
