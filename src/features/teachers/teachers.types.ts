import { TeacherGetPayload, TeacherSelect } from "@/generated/prisma/models";

export const teacherListSelect = {
  id: true,
  fullName: true,
  isActive: true,
} satisfies TeacherSelect;

export type ITeacherListItem = TeacherGetPayload<{
  select: typeof teacherListSelect;
}>;

export const teacherSelect = {
  id: true,
  fullName: true,
  phone: true,
  isActive: true,
  classSubjects: {
    select: {
      medium: { select: { name: true } },
      subject: { select: { name: true } },
      class: { select: { name: true } },
    },
  },
  classesAsClassTeacher: {
    select: {
      id: true,
      name: true,
      academicYear: { select: { id: true, name: true } },
    },
  },
} satisfies TeacherSelect;

export type ITeacher = TeacherGetPayload<{
  select: typeof teacherSelect;
}>;
