import { mediumIdRequiredError, mediumNameExistsError, mediumNotFoundError } from "./medium.errors";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import { protectedProcedure } from "@/lib/orpc/base";
import { mediumService } from ".";
import { mediumSchema } from "./medium.schema";
import { roleGuard } from "@/lib/orpc/middleware/role-guard";
import z from "zod";

const mediumProcedure = protectedProcedure.errors({
  [mediumIdRequiredError.code]: mediumIdRequiredError,
  [mediumNameExistsError.code]: mediumNameExistsError,
  [mediumNotFoundError.code]: mediumNotFoundError,
  [invalidDataProvidedError.code]: invalidDataProvidedError,
  [recordInUseError.code]: recordInUseError,
});

export const mediumProcedures = {
  getList: mediumProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ search: z.string().nullable() }))
    .handler(({ input }) => {
      return mediumService.getList({ search: input.search });
    }),

  getAsOptions: mediumProcedure.use(roleGuard.adaptInput(() => ["admin"])).handler(async () => {
    const mediumList = await mediumService.getList({});
    return mediumList.map((medium) => ({ value: medium.id, label: medium.name }));
  }),

  create: mediumProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(mediumSchema)
    .handler(({ input }) => {
      return mediumService.create(input);
    }),

  update: mediumProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string(), data: mediumSchema }))
    .handler(({ input }) => {
      return mediumService.update(input.id, input.data);
    }),

  delete: mediumProcedure
    .use(roleGuard.adaptInput(() => ["admin"]))
    .input(z.object({ id: z.string() }))
    .handler(({ input }) => {
      return mediumService.delete(input.id);
    }),
};
