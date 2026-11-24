import { protectedProcedure } from "@/lib/orpc/base";
import {
  classIdRequiredError,
  classSubjectNotFoundError,
  enrollmentNotFoundError,
  studentAlreadyEnrolledError,
  subjectInUseError,
} from "./enrollment.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import { studentIdRequiredError } from "../students/student.errors";
import {
  enrollmentCreateSchema,
  enrollmentIndexUpdateSchema,
  enrollmentSubjectMediumUpdateSchema,
  enrollmentSubjectUpdateSchema,
} from "./enrollment.schema";
import { enrollmentService } from ".";
import { roleGuard } from "@/lib/orpc/middleware/role-guard";
import z from "zod";

const enrollemtProcedure = protectedProcedure.errors({
  [classIdRequiredError.code]: classIdRequiredError,
  [classSubjectNotFoundError.code]: classSubjectNotFoundError,
  [enrollmentNotFoundError.code]: enrollmentNotFoundError,
  [studentAlreadyEnrolledError.code]: studentAlreadyEnrolledError,
  [subjectInUseError.code]: subjectInUseError,
  [invalidDataProvidedError.code]: invalidDataProvidedError,
  [recordInUseError.code]: recordInUseError,
  [studentIdRequiredError.code]: studentIdRequiredError,
});

export const enrollmentProcedures = {
  create: enrollemtProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ classId: z.string(), data: enrollmentCreateSchema }))
    .handler(({ input }) => {
      return enrollmentService.create(input.classId, input.data);
    }),

  updateIndex: enrollemtProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(
      z.object({
        classId: z.string(),
        studentId: z.string(),
        data: enrollmentIndexUpdateSchema,
      }),
    )
    .handler(({ input }) => {
      return enrollmentService.updateIndex(input.classId, input.studentId, input.data);
    }),

  updateSubjectEnrollment: enrollemtProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(
      z.object({
        classId: z.string(),
        studentId: z.string(),
        data: enrollmentSubjectUpdateSchema,
      }),
    )
    .handler(({ input }) => {
      return enrollmentService.updateSubjectEnrollment(input.classId, input.studentId, input.data);
    }),

  updateSubjectMedium: enrollemtProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(
      z.object({
        classId: z.string(),
        studentId: z.string(),
        data: enrollmentSubjectMediumUpdateSchema,
      }),
    )
    .handler(({ input }) => {
      return enrollmentService.updateSubjectMedium(input.classId, input.studentId, input.data);
    }),

  delete: enrollemtProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ classId: z.string(), studentId: z.string() }))
    .handler(({ input }) => {
      return enrollmentService.delete(input.classId, input.studentId);
    }),
};
