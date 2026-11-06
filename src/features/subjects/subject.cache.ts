import { SubjectCategory } from "@/generated/prisma/enums";
import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";

export const subjectTabParsers = {
  tab: parseAsStringLiteral(["al_main", "al_common", "core", "ol_basket", "religion", "other"] as SubjectCategory[])
    .withDefault("al_main")
    .withOptions({ shallow: false }),
};

export const subjectTabCache = createSearchParamsCache(subjectTabParsers);
