import { Class, Medium, Subject, Teacher } from "@/generated/prisma/client";
import { ClassGetPayload, ClassSelect } from "@/generated/prisma/models";

export type IClassListItem = {
  id: Class["id"];
  name: Class["name"];
  studentCount: number;
};

export type IClassList = IClassListItem[];

export const classSelect = {
  id: true,
  name: true,
  academicYear: { select: { id: true, name: true, isCurrent: true } },
  gradeLevel: { select: { id: true, name: true, number: true } },
  defaultMedium: { select: { id: true, name: true } },
  classTeacher: { select: { id: true, fullName: true, phone: true } },
  batch: { select: { id: true, name: true } },
  enrollments: {
    select: {
      id: true,
      classIndex: true,
      status: true,
      joinedOn: true,
      endedOn: true,
      student: {
        select: {
          id: true,
          admissionNo: true,
          fullName: true,
        },
      },
    },
  },
} satisfies ClassSelect;

export interface IClass extends ClassGetPayload<{
  select: typeof classSelect;
}> {
  subjects: {
    id: Subject["id"];
    name: Subject["name"];
    code: Subject["code"];
    category: Subject["category"];
    medium: { id: Medium["id"]; name: Medium["name"] } | null;
    teacher: { id: Teacher["id"]; fullName: Teacher["fullName"] };
  }[];
}

export type IClassOption = { value: Class["id"]; label: Class["name"] };
