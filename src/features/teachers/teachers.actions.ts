"use server";

import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { ITeacherList, teachersService } from ".";
import { IQueryParams } from "@/lib/filter";
import { IResponse } from "@/lib/types";

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
