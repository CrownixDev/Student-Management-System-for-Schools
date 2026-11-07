import { IExamListItem } from "./exams.types";
import { MarkStatus, SubjectCategory } from "@/generated/prisma/enums";
import z from "zod";

export const examSchema = z.object({
  name: z.string().min(2).max(50),
  examSubjects: z.array(
    z.object({
      id: z.string(),
      passMark: z.number(),
      maxMarks: z.number(),
      ignoreRanking: z.boolean(),
      subject: z.object({ id: z.string() }),
    } satisfies Partial<Record<keyof IExamListItem["examSubjects"][number], z.ZodType>>),
  ),
} satisfies Partial<Record<keyof IExamListItem, z.ZodType>>);

export const examDialogSchema = z.object({
  name: z
    .string()
    .min(2, "Exam name should be at least 2 characters long")
    .max(50, "Exam name cannot be longer than 50 characters"),
  examSubjects: z.array(
    z.object({
      id: z.string(),
      subject: z.object({
        id: z.string(),
        name: z.string(),
        code: z.string().nullable(),
        category: z.enum(SubjectCategory),
      } satisfies Partial<Record<keyof IExamListItem["examSubjects"][number]["subject"], z.ZodType>>),
      passMark: z.number("Enter a valid number"),
      maxMarks: z.number("Enter a valid number"),
      ignoreRanking: z.boolean(),
    } satisfies Partial<Record<keyof IExamListItem["examSubjects"][number], z.ZodType>>),
  ),
});

export const examMarksSchema = z.array(
  z.object({
    enrollmentId: z.string(),
    subjectId: z.string(),
    marks: z.number().positive().nullable(),
    status: z.enum(MarkStatus),
  }),
);
