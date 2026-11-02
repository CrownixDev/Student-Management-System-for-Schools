import { MediumCreateInput } from "@/generated/prisma/models";
import z from "zod";

export const mediumSchema = z.object({
  name: z
    .string()
    .min(3, "Name should have at least 3 characters")
    .max(20, "Name cannot be longer thatn 20 characters"),
} satisfies Partial<Record<keyof MediumCreateInput, z.ZodType>>);
