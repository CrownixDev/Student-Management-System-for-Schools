import {
  Enrollment,
  EnrollmentStatus,
  Exam,
  Mark,
  Student,
  StudentStatus,
  Subject,
  SubjectCategory,
} from "@/generated/prisma/client";
import { StudentGetPayload, StudentSelect } from "@/generated/prisma/models";
import { StrictOmit } from "@/lib/utils";

// Student List types
export const studentListSelect = {
  id: true,
  admissionNo: true,
  fullName: true,
} satisfies StudentSelect;

export type IStudentsListItem = StudentGetPayload<{
  select: typeof studentListSelect;
}>;

export type IStudentList = {
  list: IStudentsListItem[];
  count: number;
};

export const studentSelect = {
  id: true,
  admissionNo: true,
  fullName: true,
  dob: true,
  gender: true,
  nic: true,
  phone: true,
  address: true,
  guardianName: true,
  guardianPhone: true,
  status: true,
  enrollments: {
    select: {
      id: true,
      status: true,
      classIndex: true,
      marks: {
        select: {
          exam: {
            select: {
              name: true,
            },
          },
          marks: true,
          status: true,
          subject: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
} satisfies StudentSelect;

export type IStudent = {
  id: Student["id"];
  admissionNo: Student["admissionNo"];
  fullName: Student["fullName"];
  dob: Student["dob"];
  gender: Student["gender"];
  nic: Student["nic"];
  phone: Student["phone"];
  address: Student["address"];
  guardianName: Student["guardianName"];
  guardianPhone: Student["guardianPhone"];
  status: StudentStatus;
  enrollment: {
    id: Enrollment["id"];
    status: Enrollment["status"];
    classIndex: Enrollment["classIndex"];
    exams: {
      name: Exam["name"];
      subjects: {
        id: Subject["id"];
        name: Subject["name"];
        result: {
          marks: Mark["marks"];
          status: Mark["status"];
        };
      }[];
    }[];
  };
};

// Student Profile List Types
export const studentProfuileSelect = {
  id: true,
  admissionNo: true,
  fullName: true,
  dob: true,
  gender: true,
  nic: true,
  phone: true,
  address: true,
  guardianName: true,
  guardianPhone: true,
  status: true,
} satisfies StudentSelect;

export type IStudentProfile = StrictOmit<IStudent, "enrollment">;

export type IStudentProfileList = {
  list: IStudentProfile[];
  count: number;
};

// Student Enrollment Types
export const studentEnrollmentSelect = {
  enrollments: {
    select: {
      id: true,
      classIndex: true,
      status: true,
      joinedOn: true,
      endedOn: true,
      academicYear: { select: { id: true, name: true } },
      class: { select: { id: true, name: true, gradeLevel: { select: { id: true, name: true } } } },
      subjects: {
        select: {
          subject: { select: { name: true, code: true, category: true } },
          medium: { select: { name: true } },
        },
      },
      previousEnrollment: { select: { id: true } },
      nextEnrollment: { select: { id: true } },
    },
  },
} satisfies StudentSelect;

export interface IStudentEnrollment {
  id: string;
  status: EnrollmentStatus;
  classIndex: number;
  joinedOn: Date;
  endedOn: Date | null;
  academicYear: { id: string; name: string };
  class: {
    id: string;
    name: string;
    gradeLevel: { id: string; name: string };
  };
  previousEnrollment: { id: string } | null;
  nextEnrollment: { id: string } | null;
  subjects: {
    name: string;
    category: SubjectCategory;
    code: string | null;
    medium: string | null;
  }[];
}
