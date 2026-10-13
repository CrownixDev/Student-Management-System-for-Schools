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
    },
  },
} satisfies GradeLevelSelect;

export type IGrades = GradeLevelGetPayload<{
  select: typeof gradesSelect;
}>;
