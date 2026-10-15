import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const idParsers = {
  yearId: parseAsString.withOptions({ shallow: false }),
  batchId: parseAsString.withOptions({ shallow: false }),
  gradeId: parseAsString.withOptions({ shallow: false }),
  classId: parseAsString.withOptions({ shallow: false }),
  studentId: parseAsString.withOptions({ shallow: false }),
  examId: parseAsString.withOptions({ shallow: false }),
};

export const idCache = createSearchParamsCache(idParsers);
