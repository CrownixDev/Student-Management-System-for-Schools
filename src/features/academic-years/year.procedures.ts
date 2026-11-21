import {
  yearIdRequiredError,
  yearNotFoundError,
  activeYearNotFoundError,
  yearNameAlreadyExistError,
} from "./year.errors";
import { academicYearsService } from ".";
import { protectedProcedure } from "@/lib/orpc/base";
import { academicYearSchema } from "./year.schema";
import { roleGuard } from "@/lib/orpc/middleware/role-guard";
import { z } from "zod";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";

const academicYearProcedure = protectedProcedure.errors({
  [yearIdRequiredError.code]: yearIdRequiredError,
  [yearNotFoundError.code]: yearNotFoundError,
  [activeYearNotFoundError.code]: activeYearNotFoundError,
  [yearNameAlreadyExistError.code]: yearNameAlreadyExistError,
  [invalidDataProvidedError.code]: invalidDataProvidedError,
  [recordInUseError.code]: recordInUseError,
});

export const academicYearProcedures = {
  getlist: academicYearProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ search: z.string().nullable() }))
    .handler(async ({ input }) => {
      return academicYearsService.getList(input);
    }),

  getListItemById: academicYearProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      return academicYearsService.getListItemById(input.id);
    }),

  getActiveYear: academicYearProcedure.use(roleGuard.adaptInput(() => ["admin"])).handler(async () => {
    return academicYearsService.getActiveYear();
  }),

  setAsCurrent: academicYearProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      return academicYearsService.setAsCurrent(input.id);
    }),

  create: academicYearProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(academicYearSchema)
    .handler(async ({ input }) => {
      return academicYearsService.create(input);
    }),

  update: academicYearProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string(), data: academicYearSchema }))
    .handler(async ({ input }) => {
      return academicYearsService.update(input.id, input.data);
    }),

  delete: academicYearProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      return academicYearsService.delete(input.id);
    }),
};
