import { protectedProcedure } from "@/lib/orpc/base";
import { gradeIdRequiredError, gradeNameExistsError, gradeNotFoundError, yearIdRequiredError } from "./grades.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import { roleGuard } from "@/lib/orpc/middleware/role-guard";
import z from "zod";
import { gradesService } from ".";
import { gradeSchema } from "./grades.schema";

const gradeProcedure = protectedProcedure.errors({
  [gradeIdRequiredError.code]: gradeIdRequiredError,
  [gradeNameExistsError.code]: gradeNameExistsError,
  [gradeNotFoundError.code]: gradeNotFoundError,
  [yearIdRequiredError.code]: yearIdRequiredError,
  [invalidDataProvidedError.code]: invalidDataProvidedError,
  [recordInUseError.code]: recordInUseError,
});

export const gradeProcedures = {
  getList: gradeProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ search: z.string().nullable(), yearId: z.string() }))
    .handler(({ input }) => {
      return gradesService.getListByYear(input);
    }),

  getListItemById: gradeProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ gradeId: z.string() }))
    .handler(({ input }) => {
      return gradesService.getListItemById(input.gradeId);
    }),

  getListWithClasses: gradeProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ yearId: z.string() }))
    .handler(({ input }) => {
      return gradesService.getListWithClasses(input.yearId);
    }),

  create: gradeProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ yearId: z.string(), data: gradeSchema }))
    .handler(({ input }) => {
      return gradesService.create(input.yearId, input.data);
    }),

  update: gradeProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string(), data: gradeSchema }))
    .handler(({ input }) => {
      return gradesService.update(input.id, input.data);
    }),

  delete: gradeProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(({ input }) => {
      return gradesService.delete(input.id);
    }),
};
