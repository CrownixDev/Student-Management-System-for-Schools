import { protectedProcedure } from "@/lib/orpc/base";
import {
  classIdRequiredError,
  classNameExistsError,
  classNotFoundError,
  classSubjectInUseError,
  classSubjectNotFoundError,
  gradeIdRequiredError,
  subjectIdRequiredError,
} from "./class.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import { roleGuard } from "@/lib/orpc/middleware/role-guard";
import z from "zod";
import { classService } from ".";
import { classDetailsSchema, classSubjectsSchema } from "./class.schema";

const classProcedure = protectedProcedure.errors({
  [classIdRequiredError.code]: classIdRequiredError,
  [classNameExistsError.code]: classNameExistsError,
  [classNotFoundError.code]: classNotFoundError,
  [classSubjectInUseError.code]: classSubjectInUseError,
  [classSubjectNotFoundError.code]: classSubjectNotFoundError,
  [gradeIdRequiredError.code]: gradeIdRequiredError,
  [subjectIdRequiredError.code]: subjectIdRequiredError,
  [invalidDataProvidedError.code]: invalidDataProvidedError,
  [recordInUseError.code]: recordInUseError,
});

export const classProcedures = {
  getById: classProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(({ input }) => {
      return classService.getById(input.id);
    }),

  getSubjectsById: classProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(({ input }) => {
      return classService.getSubjectsById(input.id);
    }),

  getList: classProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ gradeId: z.string() }))
    .handler(({ input }) => {
      return classService.getList(input.gradeId);
    }),

  getListWithSubjects: classProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ gradeId: z.string() }))
    .handler(({ input }) => {
      return classService.getListWithSubjects(input.gradeId);
    }),

  getAsOptions: classProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ gradeId: z.string() }))
    .handler(({ input }) => {
      return classService.getAsOptions(input.gradeId);
    }),

  create: classProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ gradeId: z.string(), data: classDetailsSchema }))
    .handler(({ input }) => {
      return classService.create(input.gradeId, input.data);
    }),

  updateDetails: classProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string(), data: classDetailsSchema }))
    .handler(({ input }) => {
      return classService.updateDetails(input.id, input.data);
    }),

  delete: classProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(({ input }) => {
      return classService.delete(input.id);
    }),

  updateBatch: classProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ batchId: z.string().nullable(), gradeId: z.string() }))
    .handler(({ input }) => {
      return classService.updateBatch(input.batchId, input.gradeId);
    }),

  updateSubjects: classProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ classId: z.string(), data: classSubjectsSchema }))
    .handler(({ input }) => {
      return classService.updateSubjects(input.classId, input.data);
    }),

  deleteSubject: classProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ classId: z.string(), subjectId: z.string() }))
    .handler(({ input }) => {
      return classService.deleteSubject(input.classId, input.subjectId);
    }),
};
