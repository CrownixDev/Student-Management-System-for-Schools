import z from "zod";

export const classDetailsDialogSchema = z.object({
  name: z
    .string("Class name is required")
    .min(1, "Class name must be at least 1 characters long")
    .max(20, "CLass name cannot be longer than 20 characters"),
  teacher: z.object({ id: z.string(), fullName: z.string() }).nullable(),
});

export const classDetailsSchema = z.object({
  name: z.string().min(1).max(20),
  teacherId: z.string().nullable(),
});

export const classSubjectsSchema = z.array(
  z.object({
    subjectId: z.string(),
    mediumId: z.string(),
    teacherId: z.string().nullable(),
  }),
);
