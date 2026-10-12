import { BatchGetPayload, BatchSelect } from "@/generated/prisma/models";

export const batchListSelect = {
  id: true,
  name: true,
} satisfies BatchSelect;

export type IBatchListItem = BatchGetPayload<{
  select: typeof batchListSelect;
}>;
