import { academicYearProcedures } from "@/features/academic-years/year.procedures";
import { batchProcedures } from "@/features/batch/batch.procedures,";
import { classProcedures } from "@/features/class/class.procedures";
import { examProcedures } from "@/features/exams/exams.procedures";
import { gradeProcedures } from "@/features/grades/grades.procedures";
import { mediumProcedures } from "@/features/medium/medium.procedures";
import { studentProcedures } from "@/features/students/student.procedures";
import { subjectProcedures } from "@/features/subjects/subject.procedures";
import { teacherProcedures } from "@/features/teachers/teachers.procedures";

export const router = {
  academicYear: academicYearProcedures,
  batch: batchProcedures,
  medium: mediumProcedures,
  teacher: teacherProcedures,
  subject: subjectProcedures,
  student: studentProcedures,
  exam: examProcedures,
  grade: gradeProcedures,
  class: classProcedures,
};

export type AppRouter = typeof router;
