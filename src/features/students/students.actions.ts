"use server";

import { IQueryParams } from "@/lib/filter";
import { IStudentEnrollment, IStudentList, IStudentsListItem, IStudentsListWithSubjectsItem } from "./students.types";
import { studentsService } from ".";
import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { IResponse } from "@/lib/types";
import { studentSchema } from "./student.schema";
import { revalidatePath } from "next/cache";
import { Route } from "next";
import { ApiErrorV2 } from "@/lib/ApiError";
import z from "zod";

export async function getStudentListAction({ search, page, limit }: IQueryParams): Promise<IResponse<IStudentList>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const result = await studentsService.getList({ search, page, limit });
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching student list:", error);
    return { success: false, message: "Failed to fetch student list." };
  }
}

export async function getStudentListForClassAction(classId: string): Promise<IResponse<IStudentsListItem[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!classId) {
    return { success: false, message: "Class id is required" };
  }

  try {
    const result = await studentsService.getListForClass(classId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching class student list:", error);
    return { success: false, message: "Failed to fetch class student list." };
  }
}

export async function getStudentListForClassWithSubjectsAction(
  classId: string,
): Promise<IResponse<IStudentsListWithSubjectsItem[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!classId) {
    return { success: false, message: "Class id is required" };
  }

  try {
    const result = await studentsService.getListForClassWithSubjects(classId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching class student list:", error);
    return { success: false, message: "Failed to fetch class student list." };
  }
}

export async function getStudentEnrollmentsAction(studentId: string): Promise<IResponse<IStudentEnrollment[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!studentId) {
    return { success: false, message: "Student id is required" };
  }

  try {
    const result = await studentsService.getEnrollmentsById(studentId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching student enrollment list:", error);
    return { success: false, message: "Failed to fetch student enrollment list." };
  }
}

export async function createStudentAction(data: z.infer<typeof studentSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  const parsedData = studentSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await studentsService.create(parsedData.data);
    revalidatePath("/setup/students" as Route);
    return { success: true, message: "Student Created" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateStudentAction(studentId: string, data: z.infer<typeof studentSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!studentId) {
    return { success: false, message: "Student id is required" };
  }

  const parsedData = studentSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await studentsService.update(studentId, parsedData.data);
    revalidatePath("/setup/students" as Route);
    return { success: true, message: "Student Updated" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function deleteStudentAction(studentId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!studentId) {
    return { success: false, message: "Student id is required" };
  }

  try {
    await studentsService.delete(studentId);
    revalidatePath("/setup/students" as Route);
    return { success: true, message: "Student Deleted" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}
