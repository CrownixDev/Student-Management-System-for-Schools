import { BatchType } from "@/generated/prisma/enums";
import { BatchCreateInput } from "@/generated/prisma/models";
import z from "zod";

export const batchSchema = z.object({
  name: z
    .string()
    .min(3, "Batch name should be at least 3 characters long")
    .max(20, "Batch name cannot be longer than 20 characters"),
  type: z.enum(["ol", "al"] satisfies BatchType[]),
} satisfies Partial<Record<keyof BatchCreateInput, z.ZodType>>);
