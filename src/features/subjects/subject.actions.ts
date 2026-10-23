"use server";

import { SubjectCategory } from "@/generated/prisma/enums";
import { IQueryParams } from "@/lib/filter";
import { ISubjectListItem, subjectService } from ".";
import { IResponse } from "@/lib/types";
import { requireAuthServerAction } from "@/lib/auth/authenticate";

export async function getSubjectListAction({
  search,
  category,
}: {
  search: IQueryParams["search"];
  category: SubjectCategory;
}): Promise<IResponse<ISubjectListItem[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });
  const subjects = await subjectService.getList({ search, category });
  try {
    return { success: true, data: subjects };
  } catch (error) {
    console.log("Error fetching subject list:", error);
    return { success: false, message: "Failed to fetch subject list" };
  }
}
