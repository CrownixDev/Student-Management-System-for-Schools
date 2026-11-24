import {
  classNotFoundError,
  enrollmentIdRequiredError,
  enrollmentNotFoundError,
  examIdRequiredError,
  examNameExistsError,
  examNotFoundError,
  examSubjectIdRequiredError,
  examSubjectNotFoundError,
  gradeIdRequiredError,
  gradeNotFoundError,
  marksShouldBeFromCurrentYearsError,
} from "./exams.errors";
import { activeYearNotFoundError } from "../academic-years/year.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import { classIdRequiredError } from "../students/student.errors";
import { protectedProcedure } from "@/lib/orpc/base";
import { roleGuard } from "@/lib/orpc/middleware/role-guard";
import { examService } from ".";
import { examMarksSchema, examSchema } from "./exams.schema";
import z from "zod";

const examProcedure = protectedProcedure.errors({
  [classNotFoundError.code]: classNotFoundError,
  [enrollmentIdRequiredError.code]: enrollmentIdRequiredError,
  [enrollmentNotFoundError.code]: enrollmentNotFoundError,
  [examIdRequiredError.code]: examIdRequiredError,
  [examNameExistsError.code]: examNameExistsError,
  [examNotFoundError.code]: examNotFoundError,
  [examSubjectIdRequiredError.code]: examSubjectIdRequiredError,
  [examSubjectNotFoundError.code]: examSubjectNotFoundError,
  [gradeIdRequiredError.code]: gradeIdRequiredError,
  [gradeNotFoundError.code]: gradeNotFoundError,
  [marksShouldBeFromCurrentYearsError.code]: marksShouldBeFromCurrentYearsError,
  [activeYearNotFoundError.code]: activeYearNotFoundError,
  [invalidDataProvidedError.code]: invalidDataProvidedError,
  [recordInUseError.code]: recordInUseError,
  [classIdRequiredError.code]: classIdRequiredError,
});

export const examProcedures = {
  getList: examProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ gradeId: z.string() }))
    .handler(({ input }) => {
      return examService.getList(input.gradeId);
    }),

  getListItemById: examProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ examId: z.string() }))
    .handler(({ input }) => {
      return examService.getListItemById(input.examId);
    }),

  getExamSubjects: examProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ examId: z.string() }))
    .handler(({ input }) => {
      return examService.getExamSubjects(input.examId);
    }),

  getDataByEnrollmentId: examProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ enrollmentId: z.string() }))
    .handler(({ input }) => {
      return examService.getDataByEnrollmentId(input.enrollmentId);
    }),

  getTopResults: examProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ gradeId: z.string(), examId: z.string() }))
    .handler(({ input }) => {
      return examService.getTopResults(input.gradeId, input.examId);
    }),

  getExamDataForClass: examProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ classId: z.string(), examId: z.string() }))
    .handler(({ input }) => {
      return examService.getExamDataForClass(input.classId, input.examId);
    }),

  updateMarks: examProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ examId: z.string(), data: examMarksSchema }))
    .handler(({ input }) => {
      return examService.updateMarks(input.examId, input.data);
    }),

  create: examProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ gradeId: z.string(), data: examSchema }))
    .handler(({ input }) => {
      return examService.create(input.gradeId, input.data);
    }),

  update: examProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ examId: z.string(), data: examSchema }))
    .handler(({ input }) => {
      return examService.update(input.examId, input.data);
    }),

  delete: examProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ examId: z.string() }))
    .handler(({ input }) => {
      return examService.delete(input.examId);
    }),

  deleteExamSubject: examProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(({ input }) => {
      return examService.deleteExamSubject(input.id);
    }),
};
