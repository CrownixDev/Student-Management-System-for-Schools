import { TeacherCreateInput } from "@/generated/prisma/models";
import z from "zod";

export const teacherSchema = z.object({
  fullName: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name cannot be longer than 100 characters"),
  phone: z.string().max(10, "Invalid phone number").optional(),
  isActive: z.boolean(),
} satisfies Partial<Record<keyof TeacherCreateInput, z.ZodType>>);
