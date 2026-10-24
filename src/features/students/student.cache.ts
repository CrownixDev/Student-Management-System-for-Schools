import { Gender } from "@/generated/prisma/enums";
import { createSearchParamsCache, parseAsIsoDate, parseAsStringLiteral } from "nuqs/server";

export type GenderFilter = Gender | "all";
export type DOBFilter = Date | null;

export const studentFilterParsers = {
  gender: parseAsStringLiteral(["male", "female", "all"] satisfies GenderFilter[])
    .withDefault("all")
    .withOptions({ shallow: false }),
  dobFrom: parseAsIsoDate.withOptions({ shallow: false, limitUrlUpdates: { method: "debounce", timeMs: 300 } }),
  dobTo: parseAsIsoDate.withOptions({ shallow: false, limitUrlUpdates: { method: "debounce", timeMs: 300 } }),
};

export const studentFilterCach = createSearchParamsCache(studentFilterParsers);
