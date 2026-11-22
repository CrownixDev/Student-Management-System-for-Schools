import { academicYearProcedures } from "@/features/academic-years/year.procedures";
import { batchProcedures } from "@/features/batch/batch.procedures,";
import { mediumProcedures } from "@/features/medium/medium.procedures";

export const router = {
  academicYear: academicYearProcedures,
  batch: batchProcedures,
  medium: mediumProcedures,
};

export type AppRouter = typeof router;
