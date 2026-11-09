import { AcademicYear, Class, Enrollment, GradeLevel, Mark, Medium, Student, Subject } from "@/generated/prisma/client";
import { MarkStatus, SubjectCategory } from "@/generated/prisma/enums";
import { ExamGetPayload, ExamSelect, ExamSubjectGetPayload, ExamSubjectSelect } from "@/generated/prisma/models";

export const examSubjectSelect = {
  id: true,
  passMark: true,
  maxMarks: true,
  ignoreRanking: true,
  subject: { select: { id: true, name: true, code: true, category: true } },
} satisfies ExamSubjectSelect;

export type IExamSubject = ExamSubjectGetPayload<{
  select: typeof examSubjectSelect;
}>;

export const examListSelect = {
  id: true,
  name: true,
  gradeLevel: {
    select: {
      id: true,
      name: true,
      academicYear: { select: { id: true, name: true } },
    },
  },
  examSubjects: { select: examSubjectSelect },
} satisfies ExamSelect;

export type IExamListItem = ExamGetPayload<{
  select: typeof examListSelect;
}>;

export const examSelect = {
  id: true,
  name: true,
  examSubjects: {
    select: {
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
      marks: {
        select: {
          id: true,
          marks: true,
          status: true,
        },
      },
    },
  },
} satisfies ExamSelect;

export type IExam = ExamGetPayload<{
  select: typeof examSelect;
}>;

export interface IExamByEnrollmentId {
  id: string;
  name: string;
  subjects: {
    id: Subject["id"];
    name: Subject["name"];
    code: Subject["code"];
    category: SubjectCategory;
    medium: string | null;
    result: {
      marks: Mark["marks"];
      status: Mark["status"] | null;
    };
  }[];
}

//---------------------- Ranking related Types ----------------------

export interface TopResultStudent {
  id: Student["id"];
  fullName: Student["fullName"];
  admissionNo: Student["admissionNo"];
  fullMarks: number;
}

export type TopResultStudentWithClass = TopResultStudent & {
  class: Pick<Class, "id" | "name">;
};

export interface TopResultClass {
  id: Class["id"];
  name: Class["name"];
  topResult: (TopResultStudent & { classIndex: number | null })[];
}

export interface TopResultSubject {
  id: Subject["id"];
  name: Subject["name"];
  topResult: (TopResultStudentWithClass & {
    medium: Medium["name"] | null;
    status: MarkStatus | null;
  })[];
}

export interface IExamTopResults {
  byGrade: TopResultStudentWithClass[];
  byClass: TopResultClass[];
  bySubject: TopResultSubject[];
}

export interface IExamClassData {
  id: Class["id"];
  name: Class["name"];
  gradeLevel: { id: GradeLevel["id"]; name: GradeLevel["name"] };
  academicYear: { id: AcademicYear["id"]; name: AcademicYear["name"] };
  students: {
    id: Student["id"];
    enrollmentId: Enrollment["id"];
    fullName: Student["fullName"];
    admissionNo: Student["admissionNo"];
    classIndex: Enrollment["classIndex"];
    subjects: {
      id: Subject["id"];
      name: Subject["name"];
      code: Subject["code"];
      result: {
        marks: Mark["marks"];
        status: Mark["status"];
      };
    }[];
  }[];
}
