import { Batch, Class, GradeLevel } from "@/generated/prisma/client";
import { GradeLevelGetPayload, GradeLevelSelect } from "@/generated/prisma/models";

export const gradeListSelect = {
  id: true,
  number: true,
  name: true,
} satisfies GradeLevelSelect;

export type IGradeListItem = GradeLevelGetPayload<{
  select: typeof gradeListSelect;
}>;

export interface IGradeListItemForYear extends IGradeListItem {
  classCount: number;
}

export const gradesSelect = {
  id: true,
  number: true,
  name: true,
  classes: {
    select: {
      id: true,
      name: true,
      batch: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  },
} satisfies GradeLevelSelect;

export type IGradeWithClassesItem = {
  id: GradeLevel["id"];
  number: GradeLevel["number"];
  name: GradeLevel["name"];
  classes: {
    id: Class["id"];
    name: Class["name"];
    studentCount: number;
    batch: {
      id: Batch["id"];
      name: Batch["name"];
      type: Batch["type"];
    } | null;
  }[];
};
