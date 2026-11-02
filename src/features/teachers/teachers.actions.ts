"use server";

import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { ITeacherList, teachersService } from ".";
import { IQueryParams } from "@/lib/filter";
import { IResponse } from "@/lib/types";
import { teacherSchema } from "./teachers.schema";
import { revalidatePath } from "next/cache";
import { Route } from "next";
import { ApiErrorV2 } from "@/lib/ApiError";
import z from "zod";

export async function getTeachersListAction({ search, limit, page }: IQueryParams): Promise<IResponse<ITeacherList>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const teachers = await teachersService.getList({ search, limit, page });
    return { success: true, data: teachers };
  } catch (error) {
    console.error("Failed to fetch teachers list:", error);
    return { success: false, message: "Failed to get teachers list" };
  }
}

export async function createTeacherAction(data: z.infer<typeof teacherSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  const parsedData = teacherSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await teachersService.create(parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Teacher Created" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateTeacherAction(teacherId: string, data: z.infer<typeof teacherSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!teacherId) {
    return { success: false, message: "Teacher id is required" };
  }

  const parsedData = teacherSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await teachersService.update(teacherId, parsedData.data);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Teacher Updated" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function deleteTeacherAction(teacherId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!teacherId) {
    return { success: false, message: "Teacher id is required" };
  }

  try {
    await teachersService.delete(teacherId);
    revalidatePath("/setup" as Route);
    return { success: true, message: "Teacher Deleted" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}
