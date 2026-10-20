import { AcademicYear, Batch, GradeLevel } from "@/generated/prisma/client";
import { ClassSelect } from "./../../generated/prisma/models/Class";
import { BatchGetPayload, BatchSelect } from "@/generated/prisma/models";

export const batchListSelect = {
  id: true,
  name: true,
  type: true,
} satisfies BatchSelect;

export type IBatchListItem = BatchGetPayload<{
  select: typeof batchListSelect;
}>;

export const batchClassSelect = {
  id: true,
  name: true,
  academicYear: {
    select: {
      id: true,
      name: true,
    },
  },
  gradeLevel: {
    select: {
      id: true,
      number: true,
      name: true,
    },
  },
} satisfies ClassSelect;

export interface IBatch {
  id: Batch["id"];
  name: Batch["name"];
  type: Batch["type"];
  academicYear: {
    id: AcademicYear["id"];
    name: AcademicYear["name"];
    grades: {
      id: GradeLevel["id"];
      number: GradeLevel["number"];
      name: GradeLevel["name"];
      classCount: number;
    }[];
  }[];
}
