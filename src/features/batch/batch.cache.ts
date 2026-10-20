import { BatchType } from "@/generated/prisma/enums";
import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";

export const batchTabParsers = {
  tab: parseAsStringLiteral(["ol", "al"] as BatchType[])
    .withDefault("al")
    .withOptions({ shallow: false }),
};

export const batchTabCache = createSearchParamsCache(batchTabParsers);
