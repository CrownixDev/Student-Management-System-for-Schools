import { AcademicYear, Batch, GradeLevel } from "@/generated/prisma/client";
import { BatchGetPayload, BatchSelect } from "@/generated/prisma/models";

export const batchListSelect = {
  id: true,
  name: true,
  type: true,
} satisfies BatchSelect;

export type IBatchListItem = BatchGetPayload<{
  select: typeof batchListSelect;
}>;

export type IBatchList = {
  list: IBatchListItem[];
  count: number;
};

export interface IBatch {
  id: Batch["id"];
  name: Batch["name"];
  type: Batch["type"];
  academicYears: {
    id: AcademicYear["id"];
    name: AcademicYear["name"];
    grades: {
      id: GradeLevel["id"];
      name: GradeLevel["name"];
      classCount: number;
    }[];
  }[];
}
