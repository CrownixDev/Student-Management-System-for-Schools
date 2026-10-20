import { BatchType } from "@/generated/prisma/enums";

export const batchTypeOptions = [
  { label: "A/L Batch", value: "al" },
  { label: "O/L Batch", value: "ol" },
] as { label: string; value: BatchType }[];
