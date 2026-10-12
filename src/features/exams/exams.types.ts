import { Mark, Subject } from "@/generated/prisma/client";
import { SubjectCategory } from "@/generated/prisma/enums";
import { ExamGetPayload, ExamSelect } from "@/generated/prisma/models";

export const examListSelect = {
  id: true,
  name: true,
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
    },
  },
  marks: {
    select: {
      id: true,
      subjectId: true,
      marks: true,
      status: true,
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
