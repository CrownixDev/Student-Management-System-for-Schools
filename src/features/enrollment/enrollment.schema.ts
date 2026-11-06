import z from "zod";

export const enrollmentCreateSchema = z.array(
  z.object({
    classIndex: z.number(),
    studentId: z.string(),
    subjects: z.array(
      z.object({
        subjectId: z.string(),
        mediumId: z.string(),
      }),
    ),
  }),
);

export const enrollmentIndexUpdateSchema = z.object({
  classIndex: z.number(),
});

export const enrollmentSubjectUpdateSchema = z.object({
  subjectId: z.string(),
  enrolled: z.boolean(),
});

export const enrollmentSubjectMediumUpdateSchema = z.object({
  subjectId: z.string(),
  mediumId: z.string(),
});
