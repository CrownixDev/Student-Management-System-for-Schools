import { Class, Medium, Subject } from "@/generated/prisma/client";
import { TeacherGetPayload, TeacherSelect } from "@/generated/prisma/models";
import { StrictOmit } from "@/lib/utils";

export const teacherListSelect = {
  id: true,
  fullName: true,
  isActive: true,
} satisfies TeacherSelect;

export type ITeacherListItem = TeacherGetPayload<{
  select: typeof teacherListSelect;
}>;

export type ITeacherList = {
  list: ITeacherListItem[];
  count: number;
};

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

export type ITeacher = StrictOmit<
  TeacherGetPayload<{
    select: typeof teacherSelect;
  }>,
  "classSubjects"
> & {
  subjects: {
    name: Subject["name"];
    medium: Medium["name"] | null;
    class: Class["name"];
  }[];
};
