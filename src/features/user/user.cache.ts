import { UserRole } from "@/generated/prisma/enums";
import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";

export type UserFilterRole = UserRole | "all";
export const userFilterParsers = {
  role: parseAsStringLiteral(["all", "admin", "mod", "class_teacher", "subject_teacher"] satisfies UserFilterRole[])
    .withDefault("all")
    .withOptions({ shallow: false }),
};

export const userFilterCache = createSearchParamsCache(userFilterParsers);
