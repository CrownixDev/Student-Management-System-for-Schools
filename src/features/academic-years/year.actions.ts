"use server";

import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { IQueryParams } from "@/lib/filter";
import { academicYearsService, IAcademicYear } from ".";
import { IResponse } from "@/lib/types";

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
    return { success: false, message: "Failed to fetch active academic year list." };
  }
}
