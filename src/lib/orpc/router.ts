import { academicYearProcedures } from "@/features/academic-years/year.procedures";
import { batchProcedures } from "@/features/batch/batch.procedures,";

export const router = {
  academicYear: academicYearProcedures,
  batch: batchProcedures,
};

export type AppRouter = typeof router;
