import { academicYearProcedures } from "@/features/academic-years/year.procedures";

export const router = {
  academicYear: academicYearProcedures,
};

export type AppRouter = typeof router;
