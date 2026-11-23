import { academicYearProcedures } from "@/features/academic-years/year.procedures";
import { batchProcedures } from "@/features/batch/batch.procedures,";
import { mediumProcedures } from "@/features/medium/medium.procedures";
import { subjectProcedures } from "@/features/subjects/subject.procedures";
import { teacherProcedures } from "@/features/teachers/teachers.procedures";

export const router = {
  academicYear: academicYearProcedures,
  batch: batchProcedures,
  medium: mediumProcedures,
  teacher: teacherProcedures,
  subject:subjectProcedures
};

export type AppRouter = typeof router;
