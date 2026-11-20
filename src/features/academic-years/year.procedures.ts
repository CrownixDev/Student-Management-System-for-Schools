import {
  yearIdRequiredError,
  yearNotFoundError,
  activeYearNotFoundError,
  invalidDataProvidedError,
  yearNameAlreadyExistError,
  yearUsingByOthersError,
} from "./year.errors";
import { academicYearsService } from ".";
import { protectedProcedure } from "@/lib/orpc/base";
import { academicYearSchema } from "./year.schema";
import { roleGuard } from "@/lib/orpc/middleware/role-guard";
import { z } from "zod";

const academicYearProcedure = protectedProcedure.errors({
  [yearIdRequiredError.code]: yearIdRequiredError,
  [yearNotFoundError.code]: yearNotFoundError,
  [activeYearNotFoundError.code]: activeYearNotFoundError,
  [invalidDataProvidedError.code]: invalidDataProvidedError,
  [yearNameAlreadyExistError.code]: yearNameAlreadyExistError,
  [yearUsingByOthersError.code]: yearUsingByOthersError,
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
