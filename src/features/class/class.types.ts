import { Class, Medium, Subject, Teacher } from "@/generated/prisma/client";
import { ClassGetPayload, ClassSelect } from "@/generated/prisma/models";

export const classListItemSelect = {
  id: true,
  name: true,
  enrollments: {
    select: { id: true },
  },
} satisfies ClassSelect;

export type IClassListItem = {
  id: Class["id"];
  name: Class["name"];
  studentCount: number;
};

export const classListWithSubjectsItemSelect = {
  id: true,
  name: true,
  enrollments: {
    select: { id: true },
  },
  classSubjects: {
    select: {
      subject: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
  },
} satisfies ClassSelect;

export type IClassListWithSubjectsItem = {
  id: Class["id"];
  name: Class["name"];
  studentCount: number;
  subjects: {
    id: string;
    name: string;
    code: string | null;
  }[];
};

export type IClassList = IClassListItem[];

export const classSelect = {
  id: true,
  name: true,
  gradeLevel: {
    select: {
      id: true,
      name: true,
      academicYear: { select: { id: true, name: true, isCurrent: true } },
      batch: { select: { id: true, name: true } },
    },
  },
  teacher: { select: { id: true, fullName: true, phone: true } },
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
  select: Omit<typeof classSelect, "teacher"> & { teacher: typeof classSelect.teacher };
}> {
  subjects: {
    id: Subject["id"];
    name: Subject["name"];
    code: Subject["code"];
    category: Subject["category"];
    medium: { id: Medium["id"]; name: Medium["name"] };
    teacher: { id: Teacher["id"]; fullName: Teacher["fullName"] } | null;
    studentCount: number;
  }[];
}

export type IClassOption = { value: Class["id"]; label: Class["name"] };
