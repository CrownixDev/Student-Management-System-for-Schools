import { batchIdRequiredError, batchNameExistsError, batchNotFoundError, batchTypeRequiredError } from "./batch.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import { protectedProcedure } from "@/lib/orpc/base";
import { batchService } from ".";
import { batchSchema } from "./batch.schema";
import { BatchType } from "@/generated/prisma/enums";
import { roleGuard } from "@/lib/orpc/middleware/role-guard";
import z from "zod";

const batchProcedure = protectedProcedure.errors({
  [batchTypeRequiredError.code]: batchTypeRequiredError,
  [batchIdRequiredError.code]: batchIdRequiredError,
  [batchNotFoundError.code]: batchNotFoundError,
  [batchNameExistsError.code]: batchNameExistsError,
  [invalidDataProvidedError.code]: invalidDataProvidedError,
  [recordInUseError.code]: recordInUseError,
});

export const batchProcedures = {
  getList: batchProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ search: z.string().nullable(), type: z.enum(BatchType) }))
    .handler(async ({ input }) => {
      return batchService.getList({ search: input.search, type: input.type });
    }),

  getListItemById: batchProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      return batchService.getListItemById(input.id);
    }),

  getById: batchProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      return batchService.getById(input.id);
    }),

  create: batchProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(batchSchema)
    .handler(async ({ input }) => {
      return batchService.create(input);
    }),

  update: batchProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string(), data: batchSchema }))
    .handler(async ({ input }) => {
      return batchService.update(input.id, input.data);
    }),

  delete: batchProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      return batchService.delete(input.id);
    }),
};
