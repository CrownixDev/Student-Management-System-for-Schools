"use server";

import { IQueryParams } from "@/lib/filter";
import { IResponse } from "@/lib/types";
import { IGradeListItem } from "./grades.types";
import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { gradesService } from ".";

export async function getGradesListAction({
  search,
}: Pick<IQueryParams, "search">): Promise<IResponse<IGradeListItem[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const result = await gradesService.getList({ search });
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching grades list:", error);
    return { success: false, message: "Failed to fetch grades list." };
  }
}
