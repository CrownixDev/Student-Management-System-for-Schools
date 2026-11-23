import {
  enrollmentIdRequiredError,
  subjectCategoryRequiredError,
  subjectCodeExistsError,
  subjectIdRequiredError,
  subjectNotFoundError,
} from "./subject.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import { protectedProcedure } from "@/lib/orpc/base";
import { roleGuard } from "@/lib/orpc/middleware/role-guard";
import { subjectService } from ".";
import { SubjectCategory } from "@/generated/prisma/enums";
import { subjectSchema } from "./subject.schema";
import z from "zod";

const subjectProcedure = protectedProcedure.errors({
  [subjectCategoryRequiredError.code]: subjectCategoryRequiredError,
  [enrollmentIdRequiredError.code]: enrollmentIdRequiredError,
  [invalidDataProvidedError.code]: invalidDataProvidedError,
  [subjectCodeExistsError.code]: subjectCodeExistsError,
  [subjectIdRequiredError.code]: subjectIdRequiredError,
  [subjectNotFoundError.code]: subjectNotFoundError,
  [recordInUseError.code]: recordInUseError,
});

export const subjectProcedures = {
  getListByEnrollmentId: subjectProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(({ input }) => {
      return subjectService.getListByEnrollmentId(input.id);
    }),

  getList: subjectProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ search: z.string().nullable(), category: z.enum(SubjectCategory) }))
    .handler(({ input }) => {
      return subjectService.getList({ search: input.search, category: input.category });
    }),

  getById: subjectProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(({ input }) => {
      return subjectService.getById(input.id);
    }),

  create: subjectProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(subjectSchema)
    .handler(({ input }) => {
      return subjectService.create(input);
    }),

  update: subjectProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string(), data: subjectSchema }))
    .handler(({ input }) => {
      return subjectService.update(input.id, input.data);
    }),

  delete: subjectProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(({ input }) => {
      return subjectService.delete(input.id);
    }),
};
