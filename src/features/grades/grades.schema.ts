import { GradeLevelCreateInput } from "@/generated/prisma/models";
import z, { ZodType } from "zod";

export const gradeSchema = z.object({
  name: z
    .string()
    .min(3, "Grade name should have at least 3 characters")
    .max(20, "Grade name cannot be longer than 20 characters"),
  number: z.number("Please enter a grade number").positive("Grade number cannot be negative"),
} satisfies Partial<Record<keyof GradeLevelCreateInput, ZodType>>);
