"use server";

import { IQueryParams } from "@/lib/filter";
import { IStudentList } from "./students.types";
import { studentsService } from ".";
import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { IResponse } from "@/lib/types";

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

export async function getStudentListForClassAction(yearId: string, gradeId: string, classId: string) {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const result = await studentsService.getListForClass(yearId, gradeId, classId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching class student list:", error);
    return { success: false, message: "Failed to fetch class student list." };
  }
}
