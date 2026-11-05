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

export const studentListWithSubjectsSelect = {
  id: true,
  admissionNo: true,
  fullName: true,
  enrollments: {
    select: {
      classIndex: true,
      enrollmentSubjects: {
        select: {
          medium: { select: { id: true } },
          classSubject: {
            select: {
              subject: { select: { id: true } },
            },
          },
        },
      },
    },
  },
} satisfies StudentSelect;

export type IStudentsListWithSubjectsItem = {
  id: string;
  admissionNo: string;
  fullName: string;
  enrollment: {
    classIndex: number | null;
    subjects: {
      subjectId: string;
      mediumId: string | null;
    }[];
  };
};

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
          marks: true,
          status: true,
          examSubject: {
            select: {
              exam: { select: { id: true, name: true } },
              subject: { select: { id: true, name: true } },
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
      class: {
        select: {
          id: true,
          name: true,
          gradeLevel: {
            select: {
              id: true,
              name: true,
              academicYear: { select: { id: true, name: true } },
            },
          },
        },
      },
      enrollmentSubjects: {
        select: {
          classSubject: { select: { subject: { select: { name: true, code: true, category: true } } } },
          medium: { select: { name: true } },
        },
      },
    },
  },
} satisfies StudentSelect;

export interface IStudentEnrollment {
  id: string;
  status: EnrollmentStatus;
  classIndex: number | null;
  joinedOn: Date;
  endedOn: Date | null;
  academicYear: { id: string; name: string };
  class: {
    id: string;
    name: string;
    gradeLevel: { id: string; name: string };
  };
  subjects: {
    name: string;
    category: SubjectCategory;
    code: string | null;
    medium: string | null;
  }[];
}
