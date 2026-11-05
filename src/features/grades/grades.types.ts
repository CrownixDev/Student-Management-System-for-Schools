import { Batch, Class, GradeLevel } from "@/generated/prisma/client";
import { GradeLevelGetPayload, GradeLevelSelect } from "@/generated/prisma/models";

export const gradeListSelect = {
  id: true,
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
  name: true,
  batch: {
    select: {
      id: true,
      name: true,
      type: true,
    },
  },
  classes: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies GradeLevelSelect;

export type IGradeWithClassesItem = {
  id: GradeLevel["id"];
  name: GradeLevel["name"];
  batch: {
    id: Batch["id"];
    name: Batch["name"];
    type: Batch["type"];
  } | null;
  classes: {
    id: Class["id"];
    name: Class["name"];
    studentCount: number;
  }[];
};
