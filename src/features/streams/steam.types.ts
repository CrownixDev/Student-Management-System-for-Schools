import { StreamGetPayload, StreamSelect } from "@/generated/prisma/models";

export const streamListSelect = {
  id: true,
  name: true,
} satisfies StreamSelect;

export type IStreamListItem = StreamGetPayload<{
  select: typeof streamListSelect;
}>;
