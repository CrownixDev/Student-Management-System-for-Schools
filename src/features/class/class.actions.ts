"use server";

import { IResponse } from "@/lib/types";
import { IClassList, IClassOption } from "./class.types";
import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { classService } from ".";

export async function getClassOptionsAction(yearId: string, gradeId: string): Promise<IResponse<IClassOption[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const result = await classService.getAsOptions(yearId, gradeId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching class options:", error);
    return { success: false, message: "Failed to fetch class options." };
  }
}

export async function getClassListAction(yearId: string, gradeId: string): Promise<IResponse<IClassList>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const result = await classService.getList(yearId, gradeId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching class list:", error);
    return { success: false, message: "Failed to fetch class list." };
  }
}
