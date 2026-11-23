import { academicYearProcedures } from "@/features/academic-years/year.procedures";
import { batchProcedures } from "@/features/batch/batch.procedures,";
import { mediumProcedures } from "@/features/medium/medium.procedures";
import { teacherProcedures } from "@/features/teachers/teachers.procedures";

export const router = {
  academicYear: academicYearProcedures,
  batch: batchProcedures,
  medium: mediumProcedures,
  teacher: teacherProcedures,
};

export type AppRouter = typeof router;
