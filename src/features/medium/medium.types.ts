import { MediumGetPayload, MediumSelect } from "@/generated/prisma/models";

export const mediumSelect = {
  id: true,
  name: true,
} satisfies MediumSelect;

export type IMediumListItem = MediumGetPayload<{
  select: typeof mediumSelect;
}>;
