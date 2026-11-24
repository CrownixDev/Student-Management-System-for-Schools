import { teacherIdRequiredError, teacherNotFoundError } from "./teachers.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import { protectedProcedure } from "@/lib/orpc/base";
import { roleGuard } from "@/lib/orpc/middleware/role-guard";
import { teachersService } from ".";
import { teacherSchema } from "./teachers.schema";
import { queryParamsSchema } from "@/lib/filter";
import z from "zod";

const teacherProcedure = protectedProcedure.errors({
  [teacherIdRequiredError.code]: teacherIdRequiredError,
  [teacherNotFoundError.code]: teacherNotFoundError,
  [invalidDataProvidedError.code]: invalidDataProvidedError,
  [recordInUseError.code]: recordInUseError,
});

export const teacherProcedures = {
  getList: teacherProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(queryParamsSchema)
    .handler(({ input }) => {
      return teachersService.getList(input);
    }),

  getById: teacherProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(({ input }) => {
      return teachersService.getById(input.id);
    }),

  create: teacherProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(teacherSchema)
    .handler(({ input }) => {
      return teachersService.create(input);
    }),

  update: teacherProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string(), data: teacherSchema }))
    .handler(({ input }) => {
      return teachersService.update(input.id, input.data);
    }),

  delete: teacherProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(({ input }) => {
      return teachersService.delete(input.id);
    }),
};
