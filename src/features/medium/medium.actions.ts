"use server";

import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { IMediumOption, mediumService } from ".";
import { IResponse } from "@/lib/types";

export async function getMediumOptionsAction(): Promise<IResponse<IMediumOption[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const mudium = await mediumService.getAsOptions();
    return { success: true, data: mudium };
  } catch (error) {
    console.error("Error fetching medium options:", error);
    return { success: false, message: "Failed to fetch medium options." };
  }
}
