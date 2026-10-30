import z from "zod";

export const classDetailsDialogSchema = z.object({
  name: z
    .string("Class name is required")
    .min(3, "Class name must be at least 3 characters long")
    .max(20, "CLass name cannot be longer than 20 characters"),
  teacher: z.object({ id: z.string(), fullName: z.string() }).nullable(),
  mediumId: z.string().nullable(),
});

export const classDetailsSchema = z.object({
  name: z.string().min(3).max(20),
  teacherId: z.string().nullable(),
  mediumId: z.string().nullable(),
});
