import { ClassGetPayload, ClassSelect } from "@/generated/prisma/models";

export const classListSelect = {
  id: true,
  name: true,
} satisfies ClassSelect;

export type IClassListItem = ClassGetPayload<{
  select: typeof classListSelect;
}>;
