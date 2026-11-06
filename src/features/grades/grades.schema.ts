import { GradeLevelCreateInput } from "@/generated/prisma/models";
import z from "zod";

export const gradeSchema = z.object({
  name: z
    .string()
    .min(3, "Grade name should have at least 3 characters")
    .max(20, "Grade name cannot be longer than 20 characters"),
} satisfies Partial<Record<keyof GradeLevelCreateInput, z.ZodType>>);
