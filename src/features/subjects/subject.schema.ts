import { SubjectCategory } from "@/generated/prisma/enums";
import { SubjectCreateInput } from "@/generated/prisma/models";
import z from "zod";

export const subjectSchema = z.object({
  name: z
    .string()
    .min(2, "Subject name must be at least 2 characters long")
    .max(50, "Subject name cannot have more than 50 characters"),
  code: z.string().max(20, "Subject name cannot have more that 20 characters").optional(),
  category: z.enum(["core", "ol_basket", "religion", "al_main", "al_common", "other"] satisfies SubjectCategory[]),
} satisfies Partial<Record<keyof SubjectCreateInput, z.ZodType>>);
