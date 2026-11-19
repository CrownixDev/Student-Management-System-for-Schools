import { academicYearsService } from ".";
import { protectedProcedure } from "@/lib/orpc/base";
import { academicYearSchema } from "./year.schema";
import { roleGuard } from "@/lib/orpc/middleware/role-guard";
import { z } from "zod";

export const academicYearProcedures = {
  getlist: protectedProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ search: z.string() }))
    .handler(async ({ input }) => {
      return academicYearsService.getList(input);
    }),

  getActiveYear: protectedProcedure.use(roleGuard.adaptInput(() => ["admin"])).handler(async () => {
    return academicYearsService.getActiveYear();
  }),

  setAsCurrent: protectedProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      return academicYearsService.setAsCurrent(input.id);
    }),

  create: protectedProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(academicYearSchema)
    .handler(async ({ input }) => {
      return academicYearsService.create(input);
    }),

  update: protectedProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string(), data: academicYearSchema }))
    .handler(async ({ input }) => {
      return academicYearsService.update(input.id, input.data);
    }),

  delete: protectedProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      return academicYearsService.delete(input.id);
    }),
};
