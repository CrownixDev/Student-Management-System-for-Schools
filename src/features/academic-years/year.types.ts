import { AcademicYearGetPayload, AcademicYearSelect } from "@/generated/prisma/models";

export const academicYearListSelect = {
  id: true,
  name: true,
  isCurrent: true,
} satisfies AcademicYearSelect;

export type IAcademicYearListItem = AcademicYearGetPayload<{
  select: typeof academicYearListSelect;
}>;

export const academicYearSelect = {
  id: true,
  name: true,
  startDate: true,
  endDate: true,
  isCurrent: true,
} satisfies AcademicYearSelect;

export type IAcademicYear = AcademicYearGetPayload<{
  select: typeof academicYearSelect;
}>;
